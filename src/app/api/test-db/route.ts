import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW()");
    return NextResponse.json({ now: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Database connection failed", details: err.message },
      { status: 500 }
    );
  }
}
