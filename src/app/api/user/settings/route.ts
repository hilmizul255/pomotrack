import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import pool from "../../../lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await pool.query(
      "SELECT pomo_length, short_length, long_length, session_target, work_day_start, work_day_end, timer_mode FROM users WHERE email = $1",
      [session.user.email]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      pomo_length,
      short_length,
      long_length,
      session_target,
      work_day_start,
      work_day_end,
      timer_mode,
    } = body;

    await pool.query(
      `UPDATE users SET 
        pomo_length = $1, 
        short_length = $2, 
        long_length = $3, 
        session_target = $4, 
        work_day_start = $5, 
        work_day_end = $6, 
        timer_mode = $7
       WHERE email = $8`,
      [
        pomo_length,
        short_length,
        long_length,
        session_target,
        work_day_start,
        work_day_end,
        timer_mode,
        session.user.email,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}
