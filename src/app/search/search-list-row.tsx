"use client";

import Image from "next/image";
import Link from "next/link";
import { Fa7Star, Fa7StarHalf, Fa7StarOutline } from "@/components/icons/fa7";
import type { Product } from "@/lib/api";
import { CardAddToCart, CardAddToWishlist } from "@/components/home/card-actions";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex text-amber-400">
      {[1, 2, 3, 4, 5].map((i) =>
        rating >= i ? (
          <Fa7Star key={i} />
        ) : rating >= i - 0.5 ? (
          <Fa7StarHalf key={i} />
        ) : (
          <Fa7StarOutline key={i} />
        )
      )}
    </div>
  );
}

export default function SearchListRow({ product }: { product: Product }) {
  const hasDiscount =
    !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const price = hasDiscount ? product.priceAfterDiscount! : product.price;

  return (
    <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <Link
        href={`/products/${product._id}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50"
      >
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          sizes="96px"
          className="object-contain p-2"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400">{product.category?.name}</p>
        <Link
          href={`/products/${product._id}`}
          className="line-clamp-1 font-semibold text-gray-900 transition-colors hover:text-primary-600"
        >
          {product.title}
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <Stars rating={product.ratingsAverage} />
          <span className="text-xs text-gray-400">({product.ratingsQuantity})</span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-bold text-primary-600">{price} EGP</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">{product.price} EGP</span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <CardAddToWishlist product={product} />
        <CardAddToCart product={product} />
      </div>
    </div>
  );
}
