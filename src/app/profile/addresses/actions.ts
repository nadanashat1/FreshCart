"use server";

import { getApiToken } from "@/lib/get-token";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

export async function addAddress(input: {
  name: string;
  details: string;
  phone: string;
  city: string;
}): Promise<{ ok: boolean; needAuth?: boolean; error?: string }> {
  const token = await getApiToken();
  if (!token) return { ok: false, needAuth: true };
  if (!input.name.trim() || !input.details.trim() || !input.phone.trim() || !input.city.trim()) {
    return { ok: false, error: "All fields are required." };
  }
  try {
    const res = await fetch(`${API_BASE}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify(input),
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { ok: false, error: body?.message ?? "Could not save the address." };
    }
    revalidatePath("/profile/addresses");
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function removeAddress(
  addressId: string
): Promise<{ ok: boolean; needAuth?: boolean; error?: string }> {
  const token = await getApiToken();
  if (!token) return { ok: false, needAuth: true };
  try {
    const res = await fetch(`${API_BASE}/addresses/${addressId}`, {
      method: "DELETE",
      headers: { token },
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: "Could not remove the address." };
    revalidatePath("/profile/addresses");
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
