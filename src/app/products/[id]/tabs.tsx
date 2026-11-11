"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa6";

type Review = {
  _id: string;
  rating: number;
  review: string;
  user?: { name?: string };
  createdAt?: string;
};

export default function ProductTabs({
  description,
  reviews,
}: {
  description: string;
  reviews: Review[];
}) {
  const [tab, setTab] = useState<"details" | "reviews" | "shipping">("details");
  const tabs = [
    { id: "details" as const, label: "Product Details" },
    { id: "reviews" as const, label: `Reviews (${reviews.length})` },
    { id: "shipping" as const, label: "Shipping & Returns" },
  ];
  return (
    <div className="mt-10 rounded-xl bg-white shadow-sm">
      <div className="flex border-b border-gray-100">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 font-medium transition-all duration-200 ${
              tab === t.id
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-600 hover:text-primary-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        {tab === "details" && (
          <div>
            <h3 className="mb-3 text-lg font-bold text-gray-800">About this Product</h3>
            <p className="leading-relaxed text-gray-600">{description}</p>
          </div>
        )}
        {tab === "reviews" &&
          (reviews.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No reviews yet for this product.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r._id} className="rounded-lg border border-gray-100 p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{r.user?.name ?? "Customer"}</span>
                    <span className="flex text-sm text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} className={i < Math.round(r.rating) ? "" : "text-gray-300"} />
                      ))}
                    </span>
                  </div>
                  <p className="text-gray-600">{r.review}</p>
                </li>
              ))}
            </ul>
          ))}
        {tab === "shipping" && (
          <div className="space-y-6 text-gray-600">
            <div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">Shipping Information</h3>
              <ul className="list-disc space-y-1 pl-5 leading-relaxed">
                <li>Free shipping on orders over $50</li>
                <li>Standard delivery: 3-5 business days</li>
                <li>Express delivery available (1-2 business days)</li>
                <li>Track your order in real-time</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">Returns &amp; Refunds</h3>
              <ul className="list-disc space-y-1 pl-5 leading-relaxed">
                <li>30-day hassle-free returns</li>
                <li>Full refund or exchange available</li>
                <li>Free return shipping on defective items</li>
                <li>Easy online return process</li>
              </ul>
            </div>
            <div className="rounded-lg bg-primary-50 p-4">
              <h3 className="mb-1 font-bold text-gray-800">Buyer Protection Guarantee</h3>
              <p>
                Get a full refund if your order doesn&apos;t arrive or isn&apos;t as described. We
                ensure your shopping experience is safe and secure.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
