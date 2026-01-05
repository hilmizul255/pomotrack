import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const period = req.nextUrl.searchParams.get("period") || "day"; // day / week / month

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  let groupBy: string;
  switch (period) {
    case "week":
      groupBy = "DATE_TRUNC('week', logical_date)";
      break;
    case "month":
      groupBy = "DATE_TRUNC('month', logical_date)";
      break;
    default:
      groupBy = "logical_date";
  }

  try {
    // 1. Fetch period-based stats (Existing logic)
    const statsResult = await pool.query(
      `SELECT ${groupBy} as period,
              SUM(duration_minutes) as total_focus_minutes,
              COUNT(*) as session_count
       FROM pomodoro_sessions
       WHERE user_id=$1 AND mode='focus'
       GROUP BY ${groupBy}
       ORDER BY ${groupBy} DESC`,
      [userId]
    );

    // 2. Fetch overall summary
    const summaryResult = await pool.query(
      `SELECT SUM(duration_minutes) as total_minutes,
              COUNT(*) as total_sessions
       FROM pomodoro_sessions
       WHERE user_id=$1 AND mode='focus'`,
      [userId]
    );

    // 3. Calculate streak
    const datesResult = await pool.query(
      `SELECT DISTINCT logical_date 
       FROM pomodoro_sessions 
       WHERE user_id=$1 AND mode='focus'
       ORDER BY logical_date DESC`,
      [userId]
    );

    let streak = 0;
    if (datesResult.rows.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      let lastDate = datesResult.rows[0].logical_date;
      // Convert to string in case it's a Date object
      if (typeof lastDate !== "string") {
        lastDate = lastDate.toISOString().split("T")[0];
      }

      // Check if the streak is still active (today or yesterday)
      if (lastDate === today || lastDate === yesterdayStr) {
        streak = 1;
        for (let i = 1; i < datesResult.rows.length; i++) {
          const prev = new Date(lastDate);
          prev.setDate(prev.getDate() - 1);
          const prevStr = prev.toISOString().split("T")[0];

          let currentDate = datesResult.rows[i].logical_date;
          if (typeof currentDate !== "string") {
            currentDate = currentDate.toISOString().split("T")[0];
          }

          if (currentDate === prevStr) {
            streak++;
            lastDate = currentDate;
          } else {
            break;
          }
        }
      }
    }

    return NextResponse.json({
      summary: {
        total_focus_minutes: summaryResult.rows[0].total_minutes || 0,
        total_sessions: summaryResult.rows[0].total_sessions || 0,
        current_streak: streak,
      },
      stats: statsResult.rows,
    });
  } catch (err: any) {
    console.error("Stats API error:", err);
    return NextResponse.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}
