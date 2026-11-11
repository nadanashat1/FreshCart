"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaMinus, FaPlus, FaTrashCan } from "react-icons/fa6";
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
          <li key={it._id} className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <Link href={`/products/${it.product._id}`} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.product.imageCover}
                alt={it.product.title}
                className="h-24 w-24 rounded-lg object-contain"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <span className="mb-1 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
                In Stock
              </span>
              <Link href={`/products/${it.product._id}`}>
                <h3 className="truncate font-semibold text-gray-900 hover:text-primary-600">
                  {it.product.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-500">
                {it.product.category?.name} • SKU: {it.product._id.slice(-6).toUpperCase()}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{it.price} EGP</span> per unit
              </p>
              {discountMap[it.product._id] != null && (
                <p className="mt-0.5 text-xs text-amber-600">
                  Catalog lists {discountMap[it.product._id]} EGP after discount; the store cart charged the pre-discount price for discounted items we tested.
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border-2 border-gray-200">
                <button
                  onClick={() => run(it._id, () => updateCartCount(it.product._id, it.count - 1))}
                  disabled={busyId === it._id}
                  aria-label="Decrease quantity"
                  className="px-3 py-2 text-gray-600 transition hover:bg-gray-100 hover:text-primary-600 disabled:opacity-50"
                >
                  <FaMinus />
                </button>
                <span className="w-8 text-center font-semibold">{it.count}</span>
                <button
                  onClick={() => run(it._id, () => updateCartCount(it.product._id, it.count + 1))}
                  disabled={busyId === it._id || it.count >= it.product.quantity}
                  aria-label="Increase quantity"
                  className="px-3 py-2 text-gray-600 transition hover:bg-gray-100 hover:text-primary-600 disabled:opacity-50"
                >
                  <FaPlus />
                </button>
              </div>
              <p className="w-24 text-right font-bold text-gray-900">
                {(it.price * it.count).toLocaleString()} EGP
              </p>
              <button
                onClick={() => run(it._id, () => removeCartItem(it.product._id))}
                disabled={busyId === it._id}
                aria-label="Remove item"
                className="p-2 text-gray-400 transition hover:text-red-500 disabled:opacity-50"
              >
                <FaTrashCan />
              </button>
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
