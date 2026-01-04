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
    const startHour = new Date(started_at).getHours();
    let logicalDate = new Date(started_at);
    if (startHour < 10) {
      logicalDate.setDate(logicalDate.getDate() - 1);
    }
    logicalDateStr = logicalDate.toISOString().split("T")[0];
  }

  try {
    const result = await pool.query(
      `INSERT INTO pomodoro_sessions 
       (user_id, started_at, ended_at, duration_minutes, mode, status, logical_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [user_id, started_at, ended_at, duration, mode, status, logicalDateStr]
    );

    return NextResponse.json({ session: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
