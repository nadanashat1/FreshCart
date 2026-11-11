import { createHmac } from "crypto";

// Server-only: bridges a verified social sign-in (Google/Facebook via
// NextAuth) to a Route API account, so social users get a real Route identity
// whose cart/orders/wishlist work with the rest of the app.
//
// The Route backend has no social-auth endpoints (verified: /auth/google,
// /auth/facebook, /auth/social all 404 on the live API), so a social login is
// mapped to a conventional Route email/password account:
//
// - The Route password is derived deterministically from the account email
//   with an HMAC keyed by SOCIAL_PROVISION_SECRET (falls back to
//   NEXTAUTH_SECRET). It is recomputed on each sign-in, never stored, and
//   never sent to the client. Prefer a dedicated SOCIAL_PROVISION_SECRET so
//   rotating NEXTAUTH_SECRET does not orphan social-provisioned accounts.
// - The phone number Route requires at signup is derived the same way
//   (Egyptian 011 + 8 digits, deterministic per email).
//
// Limitation: if the email already exists on Route with a user-chosen
// password (registered via the normal form), social sign-in cannot be linked
// automatically - Route offers no account-linking endpoint. The user is asked
// to sign in with email and password instead.

const API_BASE =
  process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

function hmac(parts: string): string {
  const secret =
    process.env.SOCIAL_PROVISION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("Missing SOCIAL_PROVISION_SECRET/NEXTAUTH_SECRET");
  return createHmac("sha256", secret).update(parts).digest("base64url");
}

function derivedPassword(email: string): string {
  const h = hmac(`freshcart-route-password:${email.toLowerCase()}`);
  // Guarantee upper/lower/digit/symbol regardless of hash content.
  return `Fc!${h.slice(0, 13)}aA9`;
}

function derivedPhone(email: string): string {
  const secret =
    process.env.SOCIAL_PROVISION_SECRET || process.env.NEXTAUTH_SECRET!;
  const hex = createHmac("sha256", secret)
    .update(`freshcart-route-phone:${email.toLowerCase()}`)
    .digest("hex");
  let digits = "";
  for (let i = 0; i < 8; i++) {
    digits += String(parseInt(hex.slice(i * 2, i * 2 + 2), 16) % 10);
  }
  return `011${digits}`;
}

async function post(
  path: string,
  body: Record<string, unknown>
): Promise<{ token?: string; message?: string } | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await res.json().catch(() => null);
  } catch {
    return null;
  }
}

export type ProvisionResult =
  | { apiToken: string }
  | { error: "AccountExists" | "ProvisionFailed" };

export async function provisionRouteAccount(
  email: string,
  name: string
): Promise<ProvisionResult> {
  const password = derivedPassword(email);

  // Existing social-provisioned account: derived password signs straight in.
  const signin = await post("/auth/signin", { email, password });
  if (signin?.token) return { apiToken: signin.token };

  // First social sign-in for this email: create the Route account.
  const signup = await post("/auth/signup", {
    name,
    email,
    password,
    rePassword: password,
    phone: derivedPhone(email),
  });
  if (signup?.token) return { apiToken: signup.token };

  // Email registered before with a user-chosen password: cannot link.
  if (typeof signup?.message === "string" && /exist/i.test(signup.message)) {
    return { error: "AccountExists" };
  }
  return { error: "ProvisionFailed" };
}
