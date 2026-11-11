"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaMinus, FaPlus, FaCartShopping, FaHeart } from "react-icons/fa6";
import { addToCart, addToWishlist } from "./actions";

export default function PurchasePanel({
  productId,
  price,
  cartUnitPrice,
  available,
}: {
  productId: string;
  price: number;
  cartUnitPrice: number;
  available: number;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [cartState, setCartState] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [wishState, setWishState] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onAddToCart() {
    setError(null);
    setCartState("loading");
    const res = await addToCart(productId, qty);
    if (res.needAuth) {
      router.push("/login");
      return;
    }
    setCartState(res.ok ? "added" : "error");
    if (!res.ok) setError(res.error ?? "Could not add to cart.");
  }

  async function onAddToWishlist() {
    setError(null);
    setWishState("loading");
    const res = await addToWishlist(productId);
    if (res.needAuth) {
      router.push("/login");
      return;
    }
    setWishState(res.ok ? "added" : "error");
    if (!res.ok) setError(res.error ?? "Could not add to wishlist.");
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-700">Quantity</span>
        <div className="flex items-center rounded-xl border-2 border-gray-200">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="px-4 py-3 text-gray-600 transition hover:bg-gray-100 hover:text-primary-600 disabled:opacity-50"
          >
            <FaMinus />
          </button>
          <span className="w-10 text-center font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(available, q + 1))}
            disabled={qty >= available}
            aria-label="Increase quantity"
            className="px-4 py-3 text-gray-600 transition hover:bg-gray-100 hover:text-primary-600 disabled:opacity-50"
          >
            <FaPlus />
          </button>
        </div>
        <span className="text-sm text-gray-500">{available} available</span>
      </div>

      <p className="mb-1 text-lg">
        <span className="text-gray-600">Total Price: </span>
        <span className="font-bold text-primary-600">{(cartUnitPrice * qty).toFixed(2)} EGP</span>
      </p>
      {cartUnitPrice > price && (
        <p className="mb-4 text-xs text-amber-600">
          In our tests the store cart charged the pre-discount price ({cartUnitPrice} EGP per unit) for discounted items; the displayed {price} EGP discount may not be applied in the cart.
        </p>
      )}
      {cartUnitPrice <= price && <div className="mb-4" />}

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="mb-3 flex gap-3">
        <button
          onClick={onAddToCart}
          disabled={cartState === "loading"}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 font-medium text-white transition-all hover:bg-primary-700 active:scale-[0.98] disabled:opacity-60"
        >
          <FaCartShopping />
          {cartState === "loading" ? "Adding..." : cartState === "added" ? "Added to Cart" : "Add to Cart"}
        </button>
        <button
          disabled
          title="Checkout is not available in this build yet"
          className="flex flex-1 cursor-not-allowed items-center justify-center rounded-xl bg-gray-900 px-6 py-3.5 font-medium text-white opacity-60"
        >
          Buy Now
        </button>
      </div>
      <button
        onClick={onAddToWishlist}
        disabled={wishState === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-3 font-medium text-gray-700 transition hover:border-primary-300 hover:text-primary-600 disabled:opacity-60"
      >
        <FaHeart className={wishState === "added" ? "text-red-500" : ""} />
        {wishState === "loading" ? "Adding..." : wishState === "added" ? "Added to Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
}
