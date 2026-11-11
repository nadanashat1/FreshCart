"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaRegHeart, FaHeart, FaCheck } from "react-icons/fa6";
import { addToCart, addToWishlist } from "@/app/products/[id]/actions";

export function CardAddToCart({ productId }: { productId: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");

  async function onClick() {
    setState("loading");
    const res = await addToCart(productId, 1);
    if (res.needAuth) {
      router.push("/login");
      return;
    }
    setState(res.ok ? "added" : "error");
  }

  return (
    <button
      onClick={onClick}
      disabled={state === "loading"}
      aria-label="Add to cart"
      title={state === "error" ? "Could not add to cart. Try again." : "Add to cart"}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition disabled:opacity-70 ${
        state === "added" ? "bg-green-600" : "bg-primary-600 hover:bg-primary-700"
      }`}
    >
      {state === "added" ? <FaCheck /> : <FaPlus />}
    </button>
  );
}

export function CardAddToWishlist({ productId }: { productId: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");

  async function onClick() {
    setState("loading");
    const res = await addToWishlist(productId);
    if (res.needAuth) {
      router.push("/login");
      return;
    }
    setState(res.ok ? "added" : "error");
  }

  return (
    <button
      onClick={onClick}
      disabled={state === "loading"}
      aria-label="Add to wishlist"
      title={state === "error" ? "Could not add to wishlist. Try again." : "Add to wishlist"}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:text-red-500 disabled:opacity-60"
    >
      {state === "added" ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
    </button>
  );
}
