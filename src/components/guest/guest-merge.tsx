"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getGuestCart,
  getGuestWishlist,
  guestCartRemove,
  guestWishlistRemove,
} from "@/lib/guest-store";
import { addToCart, addToWishlist } from "@/app/products/[id]/actions";

// Demo parity: after sign-in, guest cart items are pushed to the account cart
// (one add per unit, the API has no count parameter) and guest wishlist items
// to the account wishlist; local guest storage is cleared per item so a
// partial failure never double-merges on retry and accounts never mix.
export default function GuestMerge({ isAuth }: { isAuth: boolean }) {
  const router = useRouter();
  const running = useRef(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuth || running.current) return;
    const cart = getGuestCart();
    const wishlist = getGuestWishlist();
    if (cart.length === 0 && wishlist.length === 0) return;
    running.current = true;

    (async () => {
      let merged = 0;
      for (const item of cart) {
        try {
          for (let n = 0; n < item.count; n++) {
            const res = await addToCart(item.productId, 1);
            if (!res.ok) throw new Error(res.error ?? "add failed");
          }
          guestCartRemove(item.productId);
          merged++;
        } catch {
          // keep this item in guest storage for a later retry
        }
      }
      for (const item of wishlist) {
        try {
          const res = await addToWishlist(item.productId);
          if (res.ok) guestWishlistRemove(item.productId);
        } catch {
          // keep for retry
        }
      }
      if (merged > 0) {
        setToast("Your cart items have been saved!");
        setTimeout(() => setToast(null), 4000);
      }
      router.refresh();
    })().finally(() => {
      running.current = false;
    });
  }, [isAuth, router]);

  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
      {toast}
    </div>
  );
}
