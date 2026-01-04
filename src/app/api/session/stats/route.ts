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
    const result = await pool.query(
      `SELECT ${groupBy} as period,
              SUM(duration_minutes) as total_focus_minutes,
              COUNT(*) as session_count
       FROM pomodoro_sessions
       WHERE user_id=$1 AND mode='focus'
       GROUP BY ${groupBy}
       ORDER BY ${groupBy} DESC`,
      [userId]
    );

    return NextResponse.json({ stats: result.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
