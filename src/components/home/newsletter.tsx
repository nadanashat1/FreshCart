"use client";

import { motion } from "framer-motion";
import { FaEnvelope, FaLeaf, FaArrowRight, FaApple, FaGooglePlay } from "react-icons/fa6";
import { Fa7Tag, Fa7Truck } from "@/components/icons/fa7";

const perks = [
  { icon: FaLeaf, label: "Fresh Picks Weekly" },
  { icon: Fa7Truck, label: "Free Delivery Codes" },
  { icon: Fa7Tag, label: "Members-Only Deals" },
];

export default function Newsletter() {
  return (
    <section className="overflow-hidden py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2.5rem] border border-emerald-100/50 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-2xl shadow-emerald-500/10">
            <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 -translate-y-1/2 translate-x-1/4 rounded-full bg-gradient-to-br from-emerald-200/40 to-transparent blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/4 translate-y-1/2 rounded-full bg-gradient-to-tr from-teal-200/30 to-transparent blur-3xl" />
            <div className="relative grid gap-8 p-8 lg:grid-cols-5 lg:p-14">
              <div className="space-y-6 lg:col-span-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                    <FaEnvelope className="text-xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Newsletter</h3>
                    <p className="text-xs text-gray-500">50,000+ subscribers</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold leading-snug text-gray-900 lg:text-4xl">
                    Get the Freshest Updates <span className="text-emerald-600">Delivered Free</span>
                  </h2>
                  <p className="mt-3 text-lg text-gray-500">
                    Weekly recipes, seasonal offers &amp; exclusive member perks.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {perks.map((p) => (
                    <div
                      key={p.label}
                      className="flex items-center gap-2.5 rounded-full border border-emerald-100 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-sm"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                        <p.icon className="text-xs text-emerald-600" />
                      </span>
                      <span className="text-sm font-medium text-gray-700">{p.label}</span>
                    </div>
                  ))}
                </div>
                <form className="pt-2">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border-2 border-gray-200 bg-white py-4 pl-5 pr-5 text-base text-gray-800 shadow-sm transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                    <button
                      type="submit"
                      className="group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/40"
                    >
                      <span>Subscribe</span>
                      <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                  <p className="mt-3 pl-1 text-xs text-gray-400">✨ Unsubscribe anytime. No spam, ever.</p>
                </form>
              </div>
              <div className="lg:col-span-2 lg:border-l lg:border-emerald-100 lg:pl-8">
                <div className="flex h-full flex-col justify-center">
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
                    <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl" />
                    <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-teal-500/20 blur-2xl" />
                    <div className="relative space-y-5">
                      <div className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                        📱 MOBILE APP
                      </div>
                      <h3 className="text-2xl font-bold leading-tight">Shop Faster on Our App</h3>
                      <p className="text-sm leading-relaxed text-gray-400">
                        Get app-exclusive deals &amp; 15% off your first order.
                      </p>
                      <div className="flex flex-col gap-3 pt-2">
                        <a href="#" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/15">
                          <FaApple className="text-2xl" />
                          <span className="text-left">
                            <span className="block text-[10px] uppercase tracking-wide text-gray-400">Download on</span>
                            <span className="-mt-0.5 block text-sm font-semibold">App Store</span>
                          </span>
                        </a>
                        <a href="#" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/15">
                          <FaGooglePlay className="text-2xl" />
                          <span className="text-left">
                            <span className="block text-[10px] uppercase tracking-wide text-gray-400">Get it on</span>
                            <span className="-mt-0.5 block text-sm font-semibold">Google Play</span>
                          </span>
                        </a>
                      </div>
                      <div className="flex items-center gap-2 pt-2 text-sm">
                        <span className="text-yellow-400">★★★★★</span>
                        <span className="text-gray-400">4.9 • 100K+ downloads</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
