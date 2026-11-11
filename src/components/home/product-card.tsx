"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowsRotate, FaRegEye, FaStar, FaStarHalfStroke, FaRegStar } from "react-icons/fa6";
import { motion } from "framer-motion";
import type { Product } from "@/lib/api";
import { CardAddToCart, CardAddToWishlist } from "./card-actions";

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

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const discount = hasDiscount
    ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
    : null;
  const price = hasDiscount ? product.priceAfterDiscount! : product.price;

  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="overflow-hidden rounded-lg border border-gray-200 bg-white"
    >
      <div className="relative">
        {discount && (
          <div className="absolute left-3 top-3 z-10">
            <span className="rounded bg-red-500 px-2 py-1 text-xs text-white">-{discount}%</span>
          </div>
        )}
        <div className="absolute right-3 top-3 z-10 flex flex-col space-y-2">
          <CardAddToWishlist productId={product._id} />
          <button
            disabled
            title="Compare is not available in this build yet"
            className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full bg-white text-gray-400 opacity-60 shadow-sm"
          >
            <FaArrowsRotate />
          </button>
          <Link
            href={`/products/${product._id}`}
            title="Quick view"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm hover:text-primary-600"
          >
            <FaRegEye />
          </Link>
        </div>
        <Link href={`/products/${product._id}`} className="relative block h-60 bg-white">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            className="h-60 w-full object-contain"
          />
        </Link>
      </div>
      <div className="p-4">
        <div className="mb-1 text-xs text-gray-500">{product.category.name}</div>
        <h3 className="mb-1 cursor-pointer font-medium" title={product.title}>
          <Link href={`/products/${product._id}`} className="line-clamp-2">
            {product.title}
          </Link>
        </h3>
        <div className="mb-2 flex items-center">
          <Stars rating={product.ratingsAverage} />
          <span className="text-xs text-gray-500">
            {product.ratingsAverage} ({product.ratingsQuantity})
          </span>
        </div>
        {hasDiscount && (
          <p className="mb-1 text-xs text-amber-600">Cart may charge the pre-discount price.</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className={`text-lg font-bold ${hasDiscount ? "text-primary-600" : "text-gray-800"}`}>
              {price} EGP
            </span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-gray-500 line-through">{product.price} EGP</span>
            )}
          </div>
          <CardAddToCart productId={product._id} />
        </div>
      </div>
    </motion.div>
  );
}
