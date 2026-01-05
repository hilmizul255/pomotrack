import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    return NextResponse.json({ columns: result.rows });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Database connection failed", details: err.message },
      { status: 500 }
    );
  }
}
