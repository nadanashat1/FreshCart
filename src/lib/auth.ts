import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${API_BASE}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          const data = await res.json().catch(() => null);
          if (!res.ok || !data?.token || !data?.user) return null;
          return {
            id: data.user.email,
            name: data.user.name,
            email: data.user.email,
            apiToken: data.token,
          } as { id: string; name: string; email: string; apiToken: string };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.apiToken = (user as { apiToken?: string }).apiToken;
      return token;
    },
    async session({ session }) {
      // apiToken stays server-side only (decoded from the httpOnly JWT cookie
      // in server code); it is never exposed to the client session.
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
