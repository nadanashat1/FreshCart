"use server";

import { getApiToken } from "@/lib/get-token";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

async function authed() {
  const token = await getApiToken();
  return token;
}

export async function updateCartCount(
  productId: string,
  count: number
): Promise<{ ok: boolean; needAuth?: boolean; error?: string }> {
  const token = await authed();
  if (!token) return { ok: false, needAuth: true };
  try {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ count }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: data?.message ?? "Could not update quantity." };
    revalidatePath("/cart");
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function removeCartItem(
  productId: string
): Promise<{ ok: boolean; needAuth?: boolean; error?: string }> {
  const token = await authed();
  if (!token) return { ok: false, needAuth: true };
  try {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: "DELETE",
      headers: { token },
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: "Could not remove item." };
    revalidatePath("/cart");
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function clearCart(): Promise<{ ok: boolean; needAuth?: boolean; error?: string }> {
  const token = await authed();
  if (!token) return { ok: false, needAuth: true };
  try {
    const res = await fetch(`${API_BASE}/cart`, {
      method: "DELETE",
      headers: { token },
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: "Could not clear cart." };
    revalidatePath("/cart");
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
