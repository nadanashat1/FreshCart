"use client";

import { useState } from "react";
import { FaBox, FaStar, FaTruck, FaCheck, FaRotateLeft } from "react-icons/fa6";
import type { Product } from "@/lib/api";

type Review = {
  _id: string;
  rating: number;
  review: string;
  user?: { name?: string };
  createdAt?: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex justify-center text-amber-400">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar key={i} className={i <= Math.round(rating) ? "" : "text-gray-300"} />
      ))}
    </span>
  );
}

export default function ProductTabs({
  product,
  reviews,
}: {
  product: Product;
  reviews: Review[];
}) {
  const [tab, setTab] = useState<"details" | "reviews" | "shipping">("details");
  const tabs = [
    { id: "details" as const, label: "Product Details", icon: FaBox },
    { id: "reviews" as const, label: `Reviews (${product.ratingsQuantity})`, icon: FaStar },
    { id: "shipping" as const, label: "Shipping & Returns", icon: FaTruck },
  ];

  return (
    <section id="product-details-tabs" className="py-8">
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 font-medium transition-all duration-200 ${
                  tab === t.id
                    ? "border-b-2 border-primary-600 bg-primary-50/50 text-primary-600"
                    : "text-gray-600 hover:text-primary-600"
                }`}
              >
                <t.icon />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {tab === "details" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">About this Product</h3>
                <p className="leading-relaxed text-gray-600">{product.description}</p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-3 font-medium text-gray-900">Product Information</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-500">Category</span>
                      <span className="font-medium text-gray-900">{product.category.name}</span>
                    </li>
                    {product.subcategory && product.subcategory.length > 0 && (
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-500">Subcategory</span>
                        <span className="font-medium text-gray-900">
                          {product.subcategory.map((s) => s.name).join(", ")}
                        </span>
                      </li>
                    )}
                    {product.brand?.name && (
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-500">Brand</span>
                        <span className="font-medium text-gray-900">{product.brand.name}</span>
                      </li>
                    )}
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-500">Items Sold</span>
                      <span className="font-medium text-gray-900">{product.sold}+ sold</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-3 font-medium text-gray-900">Key Features</h4>
                  <ul className="space-y-2">
                    {[
                      "Premium Quality Product",
                      "100% Authentic Guarantee",
                      "Fast & Secure Packaging",
                      "Quality Tested",
                    ].map((f) => (
                      <li key={f} className="flex items-center text-sm text-gray-600">
                        <FaCheck className="mr-2 w-4 text-primary-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === "reviews" && (
            <div className="space-y-6">
              <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
                <div className="text-center">
                  <div className="mb-2 text-5xl font-bold text-gray-900">
                    {product.ratingsAverage}
                  </div>
                  <Stars rating={product.ratingsAverage} />
                  <p className="mt-2 text-sm text-gray-500">
                    Based on {product.ratingsQuantity} reviews
                  </p>
                </div>
                <div className="w-full flex-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const rounded = Math.round(product.ratingsAverage);
                    const pct =
                      star === rounded
                        ? 60
                        : star === rounded - 1 || star === rounded + 1
                          ? 25
                          : 5;
                    return (
                      <div key={star} className="mb-2 flex items-center gap-3">
                        <span className="w-8 text-sm text-gray-600">{star} star</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-yellow-400 transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-sm text-gray-500">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                {reviews.length === 0 ? (
                  <div className="py-8 text-center">
                    <FaStar className="mb-3 text-4xl text-gray-300" />
                    <p className="text-gray-500">Customer reviews will be displayed here.</p>
                    <button className="mt-4 font-medium text-primary-600 hover:text-primary-700">
                      Write a Review
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {reviews.map((r) => (
                      <li key={r._id} className="rounded-lg border border-gray-100 p-4">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {r.user?.name ?? "Customer"}
                          </span>
                          <span className="flex text-sm text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < Math.round(r.rating) ? "" : "text-gray-300"}
                              />
                            ))}
                          </span>
                        </div>
                        <p className="text-gray-600">{r.review}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {tab === "shipping" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white">
                      <FaTruck className="text-xl" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Shipping Information</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Free shipping on orders over $50",
                      "Standard delivery: 3-5 business days",
                      "Express delivery available (1-2 business days)",
                      "Track your order in real-time",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <FaCheck className="mt-0.5 text-primary-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                      <FaRotateLeft className="text-xl" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Returns &amp; Refunds</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "30-day hassle-free returns",
                      "Full refund or exchange available",
                      "Free return shipping on defective items",
                      "Easy online return process",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <FaCheck className="mt-0.5 text-green-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="rounded-lg bg-primary-50 p-4">
                <h3 className="mb-1 font-bold text-gray-800">Buyer Protection Guarantee</h3>
                <p className="text-gray-600">
                  Get a full refund if your order doesn&apos;t arrive or isn&apos;t as described. We
                  ensure your shopping experience is safe and secure.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
