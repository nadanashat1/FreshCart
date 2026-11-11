"use server";

import { getApiToken } from "@/lib/get-token";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

export async function updateProfile(input: {
  name: string;
  email: string;
  phone: string;
}): Promise<{ ok: boolean; needAuth?: boolean; error?: string }> {
  const token = await getApiToken();
  if (!token) return { ok: false, needAuth: true };
  if (!input.name.trim() || !input.email.trim() || !input.phone.trim()) {
    return { ok: false, error: "All fields are required." };
  }
  try {
    const res = await fetch(`${API_BASE}/users/updateMe/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify(input),
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { ok: false, error: body?.errors?.msg ?? body?.message ?? "Could not update your profile." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function changePassword(input: {
  currentPassword: string;
  password: string;
  rePassword: string;
}): Promise<{ ok: boolean; needAuth?: boolean; error?: string }> {
  const token = await getApiToken();
  if (!token) return { ok: false, needAuth: true };
  if (input.password.length < 6) {
    return { ok: false, error: "New password must be at least 6 characters." };
  }
  if (input.password !== input.rePassword) {
    return { ok: false, error: "New passwords do not match." };
  }
  try {
    const res = await fetch(`${API_BASE}/users/changeMyPassword/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({
        currentPassword: input.currentPassword,
        password: input.password,
        rePassword: input.rePassword,
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { ok: false, error: body?.errors?.msg ?? body?.message ?? "Could not change the password." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
