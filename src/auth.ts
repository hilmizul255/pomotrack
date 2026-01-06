import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import pool from "./app/lib/db";
import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!account || account.provider !== "google") return false;

        const googleSub = account.providerAccountId;

        // Check if user exists
        const existing = await pool.query(
          "SELECT id FROM users WHERE google_sub = $1",
          [googleSub]
        );

        // If not exist → create user with default settings
        if (existing.rowCount === 0) {
          console.log("Creating new user:", user.email);

          // Attempt to get settings from cookies set by TimerProvider
          const cookieStore = await cookies();
          const pomo = cookieStore.get("pomo_length")?.value || "25";
          const short = cookieStore.get("short_length")?.value || "5";
          const long = cookieStore.get("long_length")?.value || "15";
          const target = cookieStore.get("session_target")?.value || "4";
          const start = cookieStore.get("work_day_start")?.value || "00:00";

          await pool.query(
            `INSERT INTO users (google_sub, email, name, profile_pic_url, pomo_length, short_length, long_length, session_target, work_day_start, timer_mode)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pomo')`,
            [
              googleSub,
              user.email,
              user.name,
              user.image,
              Number(pomo),
              Number(short),
              Number(long),
              Number(target),
              start,
            ]
          );
        }

        return true;
      } catch (err) {
        console.error("Error in signIn callback:", err);
        return false;
      }
    },

    async jwt({ token, account }) {
      try {
        if (account?.provider === "google") {
          const res = await pool.query(
            "SELECT id FROM users WHERE google_sub = $1",
            [account.providerAccountId]
          );

          if (res.rows[0]) {
            token.userId = res.rows[0].id;
          }
        }
      } catch (err) {
        console.error("Error in jwt callback:", err);
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.userId && session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
});
