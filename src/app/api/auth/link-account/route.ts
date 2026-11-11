import { NextRequest, NextResponse } from "next/server";
import { decode, encode } from "next-auth/jwt";

const API_BASE =
  process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // match NextAuth's default 30 days

// Completes a pending-link social session: the user signed in with a
// provider-verified email (Google/Facebook), but that email already owns a
// Route account with its own password. The user re-authenticates here with
// that account's current password; on success the server exchanges it for the
// account's real Route token and rewrites the session cookie itself.
//
// Security contract:
// - The email is ALWAYS read from the existing server-side JWT (the
//   provider-verified identity), never from the request body.
// - The password is used once for the Route sign-in call and never stored,
//   logged, returned, or placed in the session.
// - The client never supplies the Route token; the new cookie is minted
//   server-side from the sign-in response. There is no session-update
//   endpoint accepting a client-supplied token.
// - Only pending-link sessions can use this; a fully signed-in session is
//   left untouched.
export async function POST(req: NextRequest) {
  let password: unknown;
  try {
    password = (await req.json())?.password;
  } catch {
    password = undefined;
  }
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "password-required" }, { status: 400 });
  }

  const isSecure =
    req.headers.get("x-forwarded-proto") === "https" ||
    req.nextUrl.protocol === "https:";
  const cookieName = isSecure
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
  const raw =
    req.cookies.get("__Secure-next-auth.session-token")?.value ??
    req.cookies.get("next-auth.session-token")?.value;
  if (!raw) {
    return NextResponse.json({ error: "no-session" }, { status: 401 });
  }
  const decoded = await decode({
    token: raw,
    secret: process.env.NEXTAUTH_SECRET!,
  }).catch(() => null);
  if (
    !decoded?.email ||
    (decoded as { pendingLink?: boolean }).pendingLink !== true
  ) {
    return NextResponse.json({ error: "not-pending-link" }, { status: 403 });
  }

  // Prove ownership of the existing Route account for THIS verified email.
  const signin = await fetch(`${API_BASE}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: decoded.email, password }),
    cache: "no-store",
  }).catch(() => null);
  const data = signin ? await signin.json().catch(() => null) : null;
  if (!signin?.ok || !data?.token) {
    return NextResponse.json({ error: "incorrect-password" }, { status: 401 });
  }

  const { iat: _iat, exp: _exp, ...claims } = decoded;
  const newJwt = await encode({
    token: {
      ...claims,
      apiToken: data.token as string,
      pendingLink: false,
    },
    secret: process.env.NEXTAUTH_SECRET!,
    maxAge: SESSION_MAX_AGE,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName, newJwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
