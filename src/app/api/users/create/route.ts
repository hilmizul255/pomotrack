import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { google_sub, email, name, profile_pic_url } = body;

    if (!google_sub || !email) {
      return NextResponse.json(
        { error: "google_sub and email are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO users (google_sub, email, name, profile_pic_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [google_sub, email, name || null, profile_pic_url || null]
    );

    return NextResponse.json({ user: result.rows[0] });
  } catch (err: any) {
    // Handle duplicate google_sub
    if (err.code === "23505") {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}
