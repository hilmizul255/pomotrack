import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import pool from "../../lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider !== "google") return false;

      const googleSub = account.providerAccountId;

      // Check if user exists
      const existing = await pool.query(
        "SELECT id FROM users WHERE google_sub = $1",
        [googleSub]
      );

      // If not exist → create user
      if (existing.rowCount === 0) {
        await pool.query(
          `INSERT INTO users (google_sub, email, name, profile_pic_url)
           VALUES ($1,$2,$3,$4)`,
          [googleSub, user.email, user.name, user.image]
        );
      }

      return true;
    },

    async jwt({ token, account }) {
      if (account?.provider === "google") {
        const res = await pool.query(
          "SELECT id FROM users WHERE google_sub = $1",
          [account.providerAccountId]
        );

        token.userId = res.rows[0].id;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.userId as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
