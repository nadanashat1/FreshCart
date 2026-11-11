import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

// Server-only: read the Route API token out of the encrypted httpOnly
// next-auth session cookie. Never call from client components.
export async function getApiToken(): Promise<string | null> {
  const store = await cookies();
  const raw =
    store.get("__Secure-next-auth.session-token")?.value ??
    store.get("next-auth.session-token")?.value;
  if (!raw) return null;
  const decoded = await decode({
    token: raw,
    secret: process.env.NEXTAUTH_SECRET!,
  });
  return (decoded as { apiToken?: string } | null)?.apiToken ?? null;
}

// Server-only: the Route API access token is a plain JWT whose payload carries
// the API user id; decode the payload (no signature check needed - it came from
// our own encrypted session cookie).
export async function getApiUserId(): Promise<string | null> {
  const token = await getApiToken();
  if (!token) return null;
  try {
    const part = token.split(".")[1] ?? "";
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(Buffer.from(b64, "base64").toString("utf8")) as { id?: unknown };
    return typeof payload.id === "string" ? payload.id : null;
  } catch {
    return null;
  }
}

// Server-only: link state for social sign-ins whose email already owns a
// Route account with its own password. pendingLink sessions carry no Route
// token, so every API-backed page/action treats them as unauthenticated until
// the user completes /link-account with the account's current password.
export async function getLinkState(): Promise<{
  pendingLink: boolean;
  email: string;
  name?: string | null;
} | null> {
  const store = await cookies();
  const raw =
    store.get("__Secure-next-auth.session-token")?.value ??
    store.get("next-auth.session-token")?.value;
  if (!raw) return null;
  const decoded = await decode({
    token: raw,
    secret: process.env.NEXTAUTH_SECRET!,
  });
  if (!decoded?.email) return null;
  return {
    pendingLink: (decoded as { pendingLink?: boolean }).pendingLink === true,
    email: decoded.email,
    name: decoded.name,
  };
}

export async function getSessionUser() {
  const store = await cookies();
  const raw =
    store.get("__Secure-next-auth.session-token")?.value ??
    store.get("next-auth.session-token")?.value;
  if (!raw) return null;
  const decoded = await decode({
    token: raw,
    secret: process.env.NEXTAUTH_SECRET!,
  });
  if (!decoded) return null;
  return { name: decoded.name, email: decoded.email };
}
