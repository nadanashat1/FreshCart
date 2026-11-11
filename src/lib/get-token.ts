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
