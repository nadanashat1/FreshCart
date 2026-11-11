"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaCartShopping,
  FaLock,
  FaMinus,
  FaPlus,
  FaShieldHalved,
  FaTrashCan,
  FaTruck,
} from "react-icons/fa6";
import {
  guestCartClear,
  guestCartRemove,
  guestCartUpdate,
} from "@/lib/guest-store";
import { useGuestCartItems } from "@/components/guest/use-guest-store";

const FREE_SHIPPING_THRESHOLD = 500;

// Guest cart: same layout as the signed-in cart, backed by localStorage.
// Checkout still requires sign-in; items merge into the account on login.
export default function GuestCartView() {
  const items = useGuestCartItems();

  if (items === null) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex h-40 items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  const numItems = items.reduce((t, i) => t + i.count, 0);
  const total = items.reduce((t, i) => t + i.price * i.count, 0);
  const freeShipping = total >= FREE_SHIPPING_THRESHOLD;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="transition hover:text-primary-600">Home</Link>
            <span>/</span>
            <span className="font-medium text-gray-900">Shopping Cart</span>
          </nav>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <FaCartShopping />
            </span>
            Shopping Cart
          </h1>
          <p className="mt-2 text-gray-500">
            {numItems === 0 ? (
              "Your cart is empty"
            ) : (
              <>
                You have <span className="font-semibold text-primary-600">{numItems} item{numItems === 1 ? "" : "s"}</span> in your cart
              </>
            )}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl bg-white p-16 text-center shadow-sm">
            <FaCartShopping className="mx-auto mb-4 text-5xl text-gray-300" />
            <p className="mb-6 text-gray-500">Looks like you haven&apos;t added anything yet.</p>
            <Link
              href="/products"
              className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    <Link
                      href={`/products/${item.productId}`}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-50"
                    >
                      <Image
                        src={item.product.imageCover}
                        alt={item.product.title}
                        fill
                        sizes="96px"
                        className="object-contain"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-primary-600">In Stock</p>
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="truncate font-semibold text-gray-900 transition hover:text-primary-600">
                          {item.product.title}
                        </h3>
                      </Link>
                      {item.product.category?.name && (
                        <p className="text-xs text-gray-500">{item.product.category.name}</p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">{item.price} EGP per unit</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => guestCartUpdate(item.productId, item.count - 1)}
                        disabled={item.count <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.count}</span>
                      <button
                        onClick={() => guestCartUpdate(item.productId, item.count + 1)}
                        aria-label="Increase quantity"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                    <p className="w-24 text-right font-bold text-gray-900">
                      {(item.price * item.count).toLocaleString()} EGP
                    </p>
                    <button
                      onClick={() => guestCartRemove(item.productId)}
                      aria-label="Remove item"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <FaTrashCan />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <Link href="/products" className="font-medium text-primary-600 hover:text-primary-700">
                  ← Continue Shopping
                </Link>
                <button
                  onClick={() => guestCartClear()}
                  className="text-sm font-medium text-red-500 transition hover:text-red-600"
                >
                  Clear all items
                </button>
              </div>
            </div>
            <div>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h2>
                <p className="mb-4 text-sm text-gray-500">{numItems} item{numItems === 1 ? "" : "s"} in your cart</p>
                {freeShipping ? (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-primary-50 p-3 text-sm text-primary-700">
                    <FaTruck />
                    <span><span className="font-semibold">Free Shipping!</span> You qualify for free delivery</span>
                  </div>
                ) : (
                  <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                    Add {(FREE_SHIPPING_THRESHOLD - total).toLocaleString()} EGP more to qualify for free delivery
                  </div>
                )}
                <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold">{total.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-semibold text-primary-600">{freeShipping ? "FREE" : "Calculated at checkout"}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 text-base">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary-600">{total.toLocaleString()} EGP</span>
                  </div>
                </div>
                <button
                  disabled
                  title="Promo codes are not available in this build yet"
                  className="mt-4 w-full cursor-not-allowed rounded-xl border-2 border-dashed border-gray-200 py-2.5 text-sm text-gray-400"
                >
                  Apply Promo Code
                </button>
                <Link
                  href="/login"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 font-semibold text-white transition hover:bg-gray-800"
                >
                  <FaLock /> Secure Checkout
                </Link>
                <p className="mt-2 text-center text-xs text-gray-500">
                  Sign in to complete your order. Your cart is saved on this device and moves to your account automatically.
                </p>
                <p className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <FaShieldHalved /> Secure Payment • Fast Delivery
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
