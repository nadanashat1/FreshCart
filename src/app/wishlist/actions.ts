"use server";

import { getApiToken } from "@/lib/get-token";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

export async function removeFromWishlist(
  productId: string
): Promise<{ ok: boolean; needAuth?: boolean; error?: string }> {
  const token = await getApiToken();
  if (!token) return { ok: false, needAuth: true };
  try {
    const res = await fetch(`${API_BASE}/wishlist/${productId}`, {
      method: "DELETE",
      headers: { token },
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: "Could not remove from wishlist." };
    revalidatePath("/wishlist");
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
