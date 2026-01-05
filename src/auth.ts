import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import pool from "./app/lib/db";

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
          await pool.query(
            `INSERT INTO users (google_sub, email, name, profile_pic_url, pomo_length, short_length, long_length, session_target, work_day_start, timer_mode)
             VALUES ($1, $2, $3, $4, 25, 5, 15, 4, '00:00', 'pomo')`,
            [googleSub, user.email, user.name, user.image]
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
