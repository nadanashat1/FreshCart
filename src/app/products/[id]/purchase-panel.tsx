"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaMinus,
  FaPlus,
  FaCartShopping,
  FaCheck,
  FaBolt,
  FaHeart,
  FaRegHeart,
  FaShareNodes,
  FaSpinner,
} from "react-icons/fa6";
import { addToCart, addToWishlist } from "./actions";
import { removeFromWishlist } from "@/app/wishlist/actions";

export default function PurchasePanel({
  productId,
  price,
  cartUnitPrice,
  available,
  initialInWishlist = false,
}: {
  productId: string;
  price: number;
  cartUnitPrice: number;
  available: number;
  initialInWishlist?: boolean;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [cartState, setCartState] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [wishPending, setWishPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const outOfStock = available <= 0;

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
    else {
      router.refresh();
      setTimeout(() => setCartState("idle"), 2000);
    }
  }

  async function onToggleWishlist() {
    setError(null);
    setWishPending(true);
    const res = inWishlist
      ? await removeFromWishlist(productId)
      : await addToWishlist(productId);
    if (res.needAuth) {
      router.push("/login");
      return;
    }
    if (res.ok) {
      setInWishlist((w) => !w);
      router.refresh();
    } else {
      setError(res.error ?? "Could not update wishlist.");
    }
    setWishPending(false);
  }

  return (
    <div>
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center overflow-hidden rounded-lg border-2 border-gray-200">
            <button
              id="decrease-qty"
              onClick={() => setQty((q) => Math.max(q - 1, 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="px-4 py-3 text-gray-600 transition hover:bg-gray-100 hover:text-primary-600 disabled:opacity-50"
            >
              <FaMinus />
            </button>
            <input
              type="number"
              min={1}
              max={available}
              value={qty}
              onChange={(e) =>
                setQty(Math.min(Math.max(1, Number(e.target.value) || 1), available))
              }
              aria-label="Quantity"
              className="w-16 border-0 text-center text-lg font-medium focus:outline-none focus:ring-0"
            />
            <button
              id="increase-qty"
              onClick={() => setQty((q) => Math.min(q + 1, available))}
              disabled={qty >= available}
              aria-label="Increase quantity"
              className="px-4 py-3 text-gray-600 transition hover:bg-gray-100 hover:text-primary-600 disabled:opacity-50"
            >
              <FaPlus />
            </button>
          </div>
          <span className="text-sm text-gray-500">{available} available</span>
        </div>
      </div>

      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Price:</span>
          <span className="text-2xl font-bold text-primary-600">
            {(cartUnitPrice * qty).toFixed(2)} EGP
          </span>
        </div>
      </div>

      {cartUnitPrice > price && (
        <p className="mb-6 text-xs text-amber-600">
          In our tests the store cart charged the pre-discount price ({cartUnitPrice} EGP per unit)
          for discounted items; the displayed {price} EGP discount may not be applied in the cart.
        </p>
      )}

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <button
          id="add-to-cart"
          onClick={onAddToCart}
          disabled={cartState === "loading" || outOfStock}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-medium text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 active:scale-[0.98] disabled:opacity-60 ${
            cartState === "added" ? "bg-green-500" : "bg-primary-600"
          }`}
        >
          {cartState === "loading" ? (
            <FaSpinner className="animate-spin" />
          ) : cartState === "added" ? (
            <>
              <FaCheck /> Added to Cart
            </>
          ) : (
            <>
              <FaCartShopping /> Add to Cart
            </>
          )}
        </button>
        <button
          id="buy-now"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 font-medium text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
        >
          <FaBolt /> Buy Now
        </button>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          id="wishlist-button"
          onClick={onToggleWishlist}
          disabled={wishPending}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-medium transition disabled:opacity-60 ${
            inWishlist
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600"
          }`}
        >
          {wishPending ? (
            <FaSpinner className="animate-spin" />
          ) : inWishlist ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}
          {inWishlist ? "In Wishlist" : "Add to Wishlist"}
        </button>
        <button
          aria-label="Share"
          className="rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-700 transition hover:border-primary-300 hover:text-primary-600"
        >
          <FaShareNodes />
        </button>
      </div>
    </div>
  );
}
