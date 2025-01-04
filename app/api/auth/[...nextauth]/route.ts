"use server";

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { getDb } from "@/lib/db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const db = await getDb();
        const user = await db("users")
          .where("email", credentials.email)
          .first();

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password_hash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`.trim(),
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        const db = await getDb();
        // Check if user exists in database
        const dbUser = await db("users").where("email", user.email).first();

        if (!dbUser) {
          // Create new user
          const [newUser] = await db("users")
            .insert({
              email: user.email,
              name: user.name,
              image: user.image,
              role: "user", // Default role
            })
            .returning("*");

          token.role = newUser.role;
          token.id = newUser.id;
        } else {
          token.role = dbUser.role;
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
