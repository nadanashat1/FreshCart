"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaPlus, FaRegHeart, FaHeart, FaCheck } from "react-icons/fa6";
import { addToCart, addToWishlist } from "@/app/products/[id]/actions";
import {
  guestCartAdd,
  guestWishlistHas,
  guestWishlistToggle,
  type GuestProductInput,
} from "@/lib/guest-store";

export function CardAddToCart({ product }: { product: GuestProductInput }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");

  async function onClick() {
    setState("loading");
    const res = await addToCart(product._id, 1);
    if (res.needAuth) {
      // Demo parity: guests add to a local cart instead of being redirected.
      guestCartAdd(product, 1);
      setState("added");
      return;
    }
    setState(res.ok ? "added" : "error");
    if (res.ok) router.refresh();
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={state === "loading"}
      aria-label="Add to cart"
      title={state === "error" ? "Could not add to cart. Try again." : "Add to cart"}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition disabled:opacity-70 ${
        state === "added" ? "bg-green-600" : "bg-primary-600 hover:bg-primary-700"
      }`}
    >
      {state === "added" ? <FaCheck /> : <FaPlus />}
    </motion.button>
  );
}

export function CardAddToWishlist({ product }: { product: GuestProductInput }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");

  // Reflect a guest's saved heart on mount (no-op when the guest list is empty,
  // e.g. right after a login merged it into the account).
  useEffect(() => {
    if (guestWishlistHas(product._id)) setState("added");
    const onChange = () => setState(guestWishlistHas(product._id) ? "added" : "idle");
    window.addEventListener("guest-store-changed", onChange);
    return () => window.removeEventListener("guest-store-changed", onChange);
  }, [product._id]);

  async function onClick() {
    setState("loading");
    const res = await addToWishlist(product._id);
    if (res.needAuth) {
      guestWishlistToggle(product);
      setState(guestWishlistHas(product._id) ? "added" : "idle");
      return;
    }
    setState(res.ok ? "added" : "error");
    if (res.ok) router.refresh();
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={state === "loading"}
      aria-label="Add to wishlist"
      title={state === "error" ? "Could not add to wishlist. Try again." : "Add to wishlist"}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:text-red-500 disabled:opacity-60"
    >
      {state === "added" ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
    </motion.button>
  );
}
