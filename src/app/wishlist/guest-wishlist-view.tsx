"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaHeart, FaStar, FaStarHalfStroke, FaRegStar, FaTrashCan } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { guestWishlistRemove } from "@/lib/guest-store";
import { useGuestWishlistItems } from "@/components/guest/use-guest-store";
import { CardAddToCart } from "@/components/home/card-actions";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="mr-2 flex text-amber-400">
      {[1, 2, 3, 4, 5].map((i) =>
        rating >= i ? (
          <FaStar key={i} />
        ) : rating >= i - 0.5 ? (
          <FaStarHalfStroke key={i} />
        ) : (
          <FaRegStar key={i} />
        )
      )}
    </div>
  );
}

// Guest wishlist: same page structure as the signed-in wishlist, backed by
// localStorage. Items merge into the account wishlist on login.
export default function GuestWishlistView() {
  const items = useGuestWishlistItems();

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

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        {items.length > 0 && (
          <>
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="transition hover:text-primary-600">Home</Link>
              <span>/</span>
              <span className="font-medium text-gray-900">Wishlist</span>
            </nav>
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                <FaHeart className="text-xl text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-sm text-gray-500">{items.length} item{items.length === 1 ? "" : "s"} saved</p>
              </div>
            </div>
          </>
        )}

        {items.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="w-full max-w-sm text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
                <FaRegHeart className="text-3xl text-gray-400" />
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-900">Your wishlist is empty</h2>
              <p className="mb-6 text-sm text-gray-500">
                Browse products and save your favorites here. Sign in to sync your wishlist across devices.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  Browse Products <FaArrowRight className="text-sm" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => {
                const p = item.product;
                const price = p.priceAfterDiscount && p.priceAfterDiscount < p.price ? p.priceAfterDiscount : p.price;
                return (
                  <li key={item.productId} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <Link href={`/products/${item.productId}`} className="relative block h-48 bg-white">
                      <Image
                        src={p.imageCover}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain"
                      />
                    </Link>
                    <div className="p-4">
                      {p.category?.name && <div className="mb-1 text-xs text-gray-500">{p.category.name}</div>}
                      <h3 className="mb-1 font-medium" title={p.title}>
                        <Link href={`/products/${item.productId}`} className="line-clamp-2">
                          {p.title}
                        </Link>
                      </h3>
                      {typeof p.ratingsAverage === "number" && (
                        <div className="mb-2 flex items-center">
                          <Stars rating={p.ratingsAverage} />
                          <span className="text-xs text-gray-500">{p.ratingsAverage}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-800">{price} EGP</span>
                          {p.priceAfterDiscount && p.priceAfterDiscount < p.price && (
                            <span className="ml-2 text-sm text-gray-500 line-through">{p.price} EGP</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => guestWishlistRemove(item.productId)}
                            aria-label="Remove from wishlist"
                            title="Remove from wishlist"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition hover:text-red-500"
                          >
                            <FaTrashCan />
                          </button>
                          <CardAddToCart product={p} />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link href="/products" className="mt-6 inline-block font-medium text-primary-600 hover:text-primary-700">
              ← Continue Shopping
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
