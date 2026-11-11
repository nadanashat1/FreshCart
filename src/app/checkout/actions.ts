"use server";

import { headers } from "next/headers";
import { getApiToken } from "@/lib/get-token";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

type ShippingAddress = { details: string; phone: string; city: string };

export type PlaceOrderResult =
  | { ok: true; redirect: string }
  | { ok: false; error: string; gated?: boolean };

// LIVE ORDER GATE: ordering is OFF unless ALLOW_LIVE_ORDER_SUBMISSION=true is
// set in the server environment. When the gate is off this action returns
// before any network call: it never sends a request to the orders endpoints.
// Enabling the gate places REAL orders in the shared Route course database
// and, for card payments, creates a REAL Stripe checkout session.
export async function placeOrder(input: {
  shippingAddress: ShippingAddress;
  method: "cash" | "card";
}): Promise<PlaceOrderResult> {
  if (process.env.ALLOW_LIVE_ORDER_SUBMISSION !== "true") {
    return {
      ok: false,
      gated: true,
      error:
        "Ordering is disabled in this build. No request was sent - no order or payment was created.",
    };
  }

  const token = await getApiToken();
  if (!token) return { ok: false, error: "You must be signed in to place an order." };

  try {
    const cartRes = await fetch(`${API_BASE}/cart`, { headers: { token }, cache: "no-store" });
    if (!cartRes.ok) return { ok: false, error: "Could not load your cart." };
    const cartData = await cartRes.json();
    const cartId: string | undefined = cartData?.cartId ?? cartData?.data?._id;
    if (!cartId) return { ok: false, error: "Could not find your cart." };

    if (input.method === "cash") {
      const res = await fetch(`${API_BASE}/orders/${cartId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ shippingAddress: input.shippingAddress }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) return { ok: false, error: body?.message ?? "Could not place the order." };
      return { ok: true, redirect: "/orders" };
    }

    const origin =
      (await headers()).get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(
      `${API_BASE}/orders/checkout-session/${cartId}?url=${encodeURIComponent(origin)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ shippingAddress: input.shippingAddress }),
      },
    );
    const body = await res.json().catch(() => null);
    const url: string | undefined = body?.session?.url;
    if (!res.ok || !url)
      return { ok: false, error: body?.message ?? "Could not start online payment." };
    return { ok: true, redirect: url };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
