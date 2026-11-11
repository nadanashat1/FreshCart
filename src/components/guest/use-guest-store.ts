"use client";

import { useEffect, useState } from "react";
import {
  GUEST_STORE_EVENT,
  getGuestCart,
  getGuestWishlist,
  type GuestCartItem,
  type GuestWishlistItem,
} from "@/lib/guest-store";

// Returns null until mounted on the client (localStorage is unreadable on the
// server), so components can render a stable placeholder and avoid hydration
// mismatches.
function useGuestStore<T>(reader: () => T): T | null {
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    const read = () => setValue(reader());
    read();
    window.addEventListener(GUEST_STORE_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(GUEST_STORE_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, [reader]);
  return value;
}

const readCart = () => getGuestCart();
const readWishlist = () => getGuestWishlist();

export function useGuestCartItems(): GuestCartItem[] | null {
  return useGuestStore(readCart);
}

export function useGuestWishlistItems(): GuestWishlistItem[] | null {
  return useGuestStore(readWishlist);
}

// Demo parity: the guest badge counts total quantity, the signed-in badge
// counts distinct items (the API's numOfCartItems).
export function useGuestCartCount(): number | null {
  const items = useGuestCartItems();
  return items === null ? null : items.reduce((t, i) => t + i.count, 0);
}

export function useGuestWishlistCount(): number | null {
  const items = useGuestWishlistItems();
  return items === null ? null : items.length;
}

export function useIsInGuestWishlist(productId: string): boolean {
  const items = useGuestWishlistItems();
  return items?.some((i) => i.productId === productId) ?? false;
}
