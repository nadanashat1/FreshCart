"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTrashCan, FaCartShopping,
  FaCheck,
} from "react-icons/fa6";
import { removeFromWishlist } from "./actions";
import { addToCart } from "../products/[id]/actions";

type Item = {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  priceAfterDiscount?: number;
  category?: { name?: string };
};

export default function WishlistTable({
  items,
  inCartIds,
}: {
  items: Item[];
  inCartIds: string[];
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
    <>
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}
      {/* Mobile: one card per item (demo reflows the same way) */}
      <div className="space-y-4 md:hidden">
        {items.map((p) => {
          const hasDiscount = !!p.priceAfterDiscount && p.priceAfterDiscount < p.price;
          const price = hasDiscount ? p.priceAfterDiscount! : p.price;
          const inCart = inCartIds.includes(p._id);
          return (
            <div key={p._id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imageCover} alt={p.title} className="h-16 w-16 rounded-lg object-contain" />
                <div className="min-w-0">
                  <Link href={`/products/${p._id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                    {p.title}
                  </Link>
                  <p className="text-xs text-gray-500">{p.category?.name}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="text-gray-500">Price:</span>
                <span className="font-semibold text-gray-900">{price} EGP</span>
                {hasDiscount && <span className="text-xs text-gray-400 line-through">{p.price} EGP</span>}
              </div>
              {hasDiscount && (
                <p className="mt-0.5 text-xs text-amber-600">Cart may charge the pre-discount price.</p>
              )}
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-gray-500">Status:</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600"><span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> In Stock</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {inCart ? (
                  <Link
                    href="/cart"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700"
                  >
                    <FaCheck /> View Cart
                  </Link>
                ) : (
                  <button
                    onClick={() => run(p._id, () => addToCart(p._id, 1))}
                    disabled={busyId === p._id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                  >
                    <FaCartShopping /> {busyId === p._id ? "Adding..." : "Add to Cart"}
                  </button>
                )}
                <button
                  onClick={() => run(p._id, () => removeFromWishlist(p._id))}
                  disabled={busyId === p._id}
                  aria-label="Remove from wishlist"
                  className="rounded-lg bg-gray-100 p-2.5 text-gray-400 transition hover:text-red-500 disabled:opacity-50"
                >
                  <FaTrashCan />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-gray-500">
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const hasDiscount = !!p.priceAfterDiscount && p.priceAfterDiscount < p.price;
              const price = hasDiscount ? p.priceAfterDiscount! : p.price;
              const inCart = inCartIds.includes(p._id);
              return (
                <tr key={p._id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imageCover} alt={p.title} className="h-16 w-16 rounded-lg border border-gray-100 object-contain p-1" />
                      <div>
                        <Link href={`/products/${p._id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                          {p.title}
                        </Link>
                        <p className="text-xs text-gray-500">{p.category?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{price} EGP</span>
                    {hasDiscount && (
                      <>
                        <span className="ml-2 text-xs text-gray-400 line-through">{p.price} EGP</span>
                        <p className="mt-0.5 text-xs text-amber-600">Cart may charge the pre-discount price.</p>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {inCart ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600"><FaCartShopping /> In Cart</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600"><span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> In Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {inCart ? (
                        <Link href="/cart" className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-green-600 transition hover:bg-gray-50">
                          <FaCheck /> View Cart
                        </Link>
                      ) : (
                        <button
                          onClick={() => run(p._id, () => addToCart(p._id, 1))}
                          disabled={busyId === p._id}
                          className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50"
                        >
                          <FaCartShopping /> Add to Cart
                        </button>
                      )}
                      <button
                        onClick={() => run(p._id, () => removeFromWishlist(p._id))}
                        disabled={busyId === p._id}
                        aria-label="Remove from wishlist"
                        className="rounded-lg border border-gray-200 p-2.5 text-gray-400 transition hover:text-red-500 disabled:opacity-50"
                      >
                        <FaTrashCan />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}
