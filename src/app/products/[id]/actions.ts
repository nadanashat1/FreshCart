"use server";

import { getApiToken } from "@/lib/get-token";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

export async function addToCart(
  productId: string,
  quantity: number
): Promise<{ ok: boolean; needAuth?: boolean; error?: string; count?: number }> {
  const token = await getApiToken();
  if (!token) return { ok: false, needAuth: true };
  try {
    const res = await fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ productId }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: data?.message ?? "Could not add to cart." };
    if (quantity > 1) {
      await fetch(`${API_BASE}/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ count: quantity }),
        cache: "no-store",
      });
    }
    return { ok: true, count: data?.numOfCartItems };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function createReview(
  productId: string,
  rating: number,
  review: string
): Promise<{ ok: boolean; needAuth?: boolean; error?: string }> {
  const token = await getApiToken();
  if (!token) return { ok: false, needAuth: true };
  try {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ review, rating }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: data?.message ?? "Could not submit your review." };
    revalidatePath(`/products/${productId}`);
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function updateReview(
  productId: string,
  reviewId: string,
  rating: number,
  review: string
): Promise<{ ok: boolean; needAuth?: boolean; error?: string }> {
  const token = await getApiToken();
  if (!token) return { ok: false, needAuth: true };
  try {
    const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ review, rating }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: data?.message ?? "Could not update your review." };
    revalidatePath(`/products/${productId}`);
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function deleteReview(
  productId: string,
  reviewId: string
): Promise<{ ok: boolean; needAuth?: boolean; error?: string }> {
  const token = await getApiToken();
  if (!token) return { ok: false, needAuth: true };
  try {
    const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: { token },
      cache: "no-store",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { ok: false, error: data?.message ?? "Could not delete the review." };
    }
    revalidatePath(`/products/${productId}`);
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function addToWishlist(
  productId: string
): Promise<{ ok: boolean; needAuth?: boolean; error?: string }> {
  const token = await getApiToken();
  if (!token) return { ok: false, needAuth: true };
  try {
    const res = await fetch(`${API_BASE}/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ productId }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: data?.message ?? "Could not add to wishlist." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
