"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCheck, FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { updateCartCount, removeCartItem, clearCart } from "./actions";

type CartItem = {
  _id: string;
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    quantity: number;
    category?: { name?: string };
  };
};

export default function CartItems({
  items,
  discountMap = {},
}: {
  items: CartItem[];
  discountMap?: Record<string, number>;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(id: string, fn: () => Promise<{ ok: boolean; needAuth?: boolean; error?: string }>) {
    setError(null);
    setBusyId(id);
    const res = await fn();
    setBusyId(null);
    if (res.needAuth) {
      router.push("/login");
      return;
    }
    if (!res.ok) setError(res.error ?? "Something went wrong.");
    router.refresh();
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}
      <ul className="space-y-4">
        {items.map((it) => (
          <li
            key={it._id}
            className="relative rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="p-4 sm:p-5">
              <div className="flex gap-4 sm:gap-6">
                <Link href={`/products/${it.product._id}`} className="group relative shrink-0">
                  <div className="h-28 w-28 overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-3 sm:h-32 sm:w-32">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.product.imageCover}
                      alt={it.product.title}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <FaCheck className="text-[8px]" />
                    In Stock
                  </div>
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="mb-3">
                    <Link href={`/products/${it.product._id}`} className="group/title">
                      <h3 className="text-base font-semibold leading-relaxed text-gray-900 transition-colors group-hover/title:text-primary-600 sm:text-lg">
                        {it.product.title}
                      </h3>
                    </Link>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-block rounded-full bg-gradient-to-r from-primary-50 to-emerald-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                        {it.product.category?.name}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        SKU: {it.product._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary-600">{it.price} EGP</span>
                      <span className="text-xs text-gray-400">per unit</span>
                    </div>
                    {discountMap[it.product._id] != null && (
                      <p className="mt-0.5 text-xs text-amber-600">
                        Catalog lists {discountMap[it.product._id]} EGP after discount; the store
                        cart charged the pre-discount price for discounted items we tested.
                      </p>
                    )}
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center">
                      <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                        <button
                          onClick={() => run(it._id, () => updateCartCount(it.product._id, it.count - 1))}
                          disabled={busyId === it._id || it.count <= 1}
                          aria-label="Decrease quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-12 text-center font-bold text-gray-900">{it.count}</span>
                        <button
                          onClick={() => run(it._id, () => updateCartCount(it.product._id, it.count + 1))}
                          disabled={busyId === it._id || it.count >= it.product.quantity}
                          aria-label="Increase quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm shadow-primary-600/30 transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="mb-0.5 text-xs text-gray-400">Total</p>
                        <p className="text-xl font-bold text-gray-900">
                          {(it.price * it.count).toLocaleString()}{" "}
                          <span className="text-sm font-medium text-gray-400">EGP</span>
                        </p>
                      </div>
                      <button
                        onClick={() => run(it._id, () => removeCartItem(it.product._id))}
                        disabled={busyId === it._id}
                        title="Remove item"
                        aria-label="Remove from cart"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition-all duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-40"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between">
        <Link href="/products" className="font-medium text-primary-600 hover:text-primary-700">
          ← Continue Shopping
        </Link>
        <button
          onClick={() => run("all", clearCart)}
          disabled={busyId === "all"}
          className="text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
        >
          Clear all items
        </button>
      </div>
    </div>
  );
}
