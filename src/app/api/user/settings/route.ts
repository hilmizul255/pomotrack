import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { auth } from "../../../../auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await pool.query(
      "SELECT pomo_length, short_length, long_length, session_target, work_day_start, timer_mode FROM users WHERE id = $1",
      [session.user.id]
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
  const session = await auth();
  if (!session?.user?.id) {
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
      timer_mode,
    } = body;

    //UPDATE user settings
    await pool.query(
      `UPDATE users SET 
        pomo_length = $1, 
        short_length = $2, 
        long_length = $3, 
        session_target = $4, 
        work_day_start = $5, 
        timer_mode = $6
       WHERE id = $7`,
      [
        pomo_length,
        short_length,
        long_length,
        session_target,
        work_day_start,
        timer_mode,
        session.user.id,
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
