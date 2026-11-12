"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaBoxOpen,
  FaCartShopping,
  FaCheck,
  FaLock,
  FaMinus,
  FaPlus,
  FaShieldHalved,
  FaTrash,
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
        {items.length > 0 && (
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
        )}

        {items.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="max-w-md text-center">
              <div className="relative mb-8">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
                  <FaBoxOpen className="text-5xl text-gray-300" />
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-gray-900">Your cart is empty</h2>
              <p className="mb-8 leading-relaxed text-gray-500">
                Looks like you haven&apos;t added anything to your cart yet.
                <br />
                Start exploring our products!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:bg-primary-700 active:scale-[0.98]"
              >
                Start Shopping <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    className="relative rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex gap-4 sm:gap-6">
                        <Link href={`/products/${item.productId}`} className="group relative shrink-0">
                          <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-3 sm:h-32 sm:w-32">
                            <Image
                              src={item.product.imageCover}
                              alt={item.product.title}
                              fill
                              sizes="128px"
                              className="object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                            <FaCheck className="text-[8px]" />
                            In Stock
                          </div>
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="mb-3">
                            <Link href={`/products/${item.productId}`} className="group/title">
                              <h3 className="text-base font-semibold leading-relaxed text-gray-900 transition-colors group-hover/title:text-primary-600 sm:text-lg">
                                {item.product.title}
                              </h3>
                            </Link>
                            {item.product.category?.name && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className="inline-block rounded-full bg-gradient-to-r from-primary-50 to-emerald-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                                  {item.product.category.name}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-primary-600">{item.price} EGP</span>
                              <span className="text-xs text-gray-400">per unit</span>
                            </div>
                          </div>
                          <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center">
                              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                                <button
                                  onClick={() => guestCartUpdate(item.productId, item.count - 1)}
                                  disabled={item.count <= 1}
                                  aria-label="Decrease quantity"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                                >
                                  <FaMinus className="text-xs" />
                                </button>
                                <span className="w-12 text-center font-bold text-gray-900">{item.count}</span>
                                <button
                                  onClick={() => guestCartUpdate(item.productId, item.count + 1)}
                                  aria-label="Increase quantity"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm shadow-primary-600/30 transition-all hover:bg-primary-700 disabled:opacity-40"
                                >
                                  <FaPlus className="text-xs" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="mb-0.5 text-xs text-gray-400">Total</p>
                                <p className="text-xl font-bold text-gray-900">
                                  {(item.price * item.count).toLocaleString()}{" "}
                                  <span className="text-sm font-medium text-gray-400">EGP</span>
                                </p>
                              </div>
                              <button
                                onClick={() => guestCartRemove(item.productId)}
                                title="Remove item"
                                aria-label="Remove from cart"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition-all duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white"
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
                  <div className="mb-4 rounded-lg bg-amber-50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm text-amber-700">
                      <FaTruck className="shrink-0" />
                      <span>Add {(FREE_SHIPPING_THRESHOLD - total).toLocaleString()} EGP for free shipping</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-amber-100">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100))}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold">{total.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping (est.)</span>
                    <span className="font-semibold">{freeShipping ? "FREE" : "50 EGP"}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 text-base">
                    <span className="font-bold">Estimated Total</span>
                    <span className="font-bold text-primary-600">{(total + (freeShipping ? 0 : 50)).toLocaleString()} EGP</span>
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
