import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, started_at, ended_at, mode, status } = body;

  if (!user_id || !started_at || !ended_at || !mode || !status) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Calculate duration in minutes if not provided
  const duration =
    body.duration_minutes ||
    Math.floor(
      (new Date(ended_at).getTime() - new Date(started_at).getTime()) / 60000
    );

  // Compute logical date for night sessions if not provided
  let logicalDateStr = body.logical_date;
  if (!logicalDateStr) {
    try {
      const userSettings = await pool.query(
        "SELECT work_day_start FROM users WHERE id = $1",
        [user_id]
      );
      const workDayStart = userSettings.rows[0]?.work_day_start || "00:00";
      const [startHour, startMin] = workDayStart.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;

      const startDate = new Date(started_at);
      const currentMinutes = startDate.getHours() * 60 + startDate.getMinutes();

      let logicalDate = new Date(started_at);
      if (currentMinutes < startMinutes) {
        logicalDate.setDate(logicalDate.getDate() - 1);
      }
      logicalDateStr = logicalDate.toISOString().split("T")[0];
    } catch (err) {
      console.error("Error fetching user settings for logical date:", err);
      logicalDateStr = new Date(started_at).toISOString().split("T")[0];
    }
  }

  //INSERT session
  try {
    console.log("Creating session for user:", user_id);
    console.log("Data to insert:", {
      user_id,
      started_at,
      ended_at,
      duration,
      mode,
      status,
      logicalDateStr,
    });
    const result = await pool.query(
      `INSERT INTO pomodoro_sessions 
       (user_id, started_at, ended_at, duration_minutes, mode, status, logical_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [user_id, started_at, ended_at, duration, mode, status, logicalDateStr]
    );

    return NextResponse.json({ session: result.rows[0] });
  } catch (err: any) {
    console.error("Database error in /api/session/create:", err);
    return NextResponse.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}
