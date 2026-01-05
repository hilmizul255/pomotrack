import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS pomo_length INTEGER DEFAULT 25,
      ADD COLUMN IF NOT EXISTS short_length INTEGER DEFAULT 5,
      ADD COLUMN IF NOT EXISTS long_length INTEGER DEFAULT 15,
      ADD COLUMN IF NOT EXISTS session_target INTEGER DEFAULT 4,
      ADD COLUMN IF NOT EXISTS timer_mode TEXT DEFAULT 'pomo'
    `);

    const result = await pool.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    return NextResponse.json({ success: true, columns: result.rows });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Database migration failed", details: err.message },
      { status: 500 }
    );
  }
}
