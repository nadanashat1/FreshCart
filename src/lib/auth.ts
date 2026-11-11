import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { provisionRouteAccount } from "./social-provision";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

const providers: NextAuthOptions["providers"] = [
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
  ];

// Social providers are only enabled when their OAuth app credentials AND a
// dedicated SOCIAL_PROVISION_SECRET are configured; without them the login UI
// keeps its honest "not available yet" notice instead of offering a dead
// button. The dedicated secret is mandatory (no NEXTAUTH_SECRET fallback) so
// session-secret rotation cannot orphan social-provisioned Route accounts.
const socialReady = Boolean(process.env.SOCIAL_PROVISION_SECRET);
if (
  !socialReady &&
  (process.env.GOOGLE_CLIENT_ID || process.env.FACEBOOK_CLIENT_ID)
) {
  console.error(
    "[auth] SOCIAL_PROVISION_SECRET is missing; social providers disabled."
  );
}
if (
  socialReady &&
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}
if (
  socialReady &&
  process.env.FACEBOOK_CLIENT_ID &&
  process.env.FACEBOOK_CLIENT_SECRET
) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ account, profile }) {
      // Credentials sign-in already returned a Route token from authorize().
      if (!account || account.provider === "credentials") return true;
      // Social sign-in: bridge to a Route account so cart/orders/wishlist work.
      // Google: only a verified email may authenticate a Route identity.
      if (account.provider === "google") {
        const verified = (profile as { email_verified?: boolean } | undefined)
          ?.email_verified;
        if (verified !== true) return "/login?error=SocialEmailMissing";
      }
      // Facebook: the Graph API only returns confirmed email addresses; a
      // profile without one (phone-only or unconfirmed) yields no email and
      // is rejected below.
      const email = profile?.email;
      if (!email) return "/login?error=SocialEmailMissing";
      const result = await provisionRouteAccount(
        email,
        profile.name ?? "FreshCart user"
      );
      if ("error" in result) {
        // The email already has a Route account with its own password (e.g.
        // registered via the form, or reset after social provisioning). Allow
        // a limited session with NO Route token: the user proves ownership of
        // that account once per session via /link-account (see api/auth/
        // link-account). The identity stays fixed to the provider-verified
        // email; nothing about the Route account is changed.
        if (result.error === "AccountExists") {
          (account as unknown as Record<string, unknown>).pendingLink = true;
          return true;
        }
        return `/login?error=${result.error}`;
      }
      (account as unknown as Record<string, unknown>).routeApiToken =
        result.apiToken;
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) token.apiToken = (user as { apiToken?: string }).apiToken;
      const routeToken = (account as unknown as Record<string, unknown> | null)
        ?.routeApiToken;
      if (typeof routeToken === "string") token.apiToken = routeToken;
      const pending = (account as unknown as Record<string, unknown> | null)
        ?.pendingLink;
      if (pending === true) {
        token.pendingLink = true;
        delete token.apiToken;
      }
      return token;
    },
    async session({ session }) {
      // apiToken and the pendingLink flag stay server-side only (decoded from
      // the httpOnly JWT cookie in server code); neither is exposed to the
      // client session.
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
