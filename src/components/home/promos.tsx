"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";

const promos = [
  {
    emoji: "🔥",
    tag: "Deal of the Day",
    title: "Fresh Organic Fruits",
    text: "Get up to 40% off on selected organic fruits",
    off: "40% OFF",
    code: "ORGANIC40",
    cta: "Shop Now",
    gradient: "from-emerald-500 to-emerald-700",
    ctaText: "text-emerald-700",
  },
  {
    emoji: "✨",
    tag: "New Arrivals",
    title: "Exotic Vegetables",
    text: "Discover our latest collection of premium vegetables",
    off: "25% OFF",
    code: "FRESH25",
    cta: "Explore Now",
    gradient: "from-orange-400 to-rose-500",
    ctaText: "text-orange-600",
  },
];

export default function Promos() {
  return (
    <section className="overflow-hidden py-10">
      <div className="container mx-auto grid gap-6 px-4 md:grid-cols-2">
        {promos.map((p, idx) => (
          <motion.div
            key={p.code}
            initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${p.gradient} p-8 text-white`}
          >
            <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10" />
            <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10" />
            <div className="relative z-10">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm">
                <span>{p.emoji}</span>
                <span>{p.tag}</span>
              </span>
              <h3 className="mb-2 text-2xl font-bold md:text-3xl">{p.title}</h3>
              <p className="mb-4 text-white/80">{p.text}</p>
              <div className="mb-6 flex items-center gap-4">
                <span className="text-3xl font-bold">{p.off}</span>
                <span className="text-sm text-white/70">
                  Use code: <span className="font-bold text-white">{p.code}</span>
                </span>
              </div>
              <Link
                href="/products"
                className={`inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold ${p.ctaText} transition-colors hover:bg-gray-100`}
              >
                {p.cta} <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
