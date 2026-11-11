"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    title: "Fresh Products Delivered to your Door",
    subtitle: "Get 20% off your first order",
    primary: { href: "/products", label: "Shop Now" },
    secondary: { href: "/products", label: "View Deals" },
  },
  {
    title: "Premium Quality Guaranteed",
    subtitle: "Fresh from farm to your table",
    primary: { href: "/products", label: "Shop Now" },
    secondary: { href: "/products", label: "Learn More" },
  },
  {
    title: "Fast & Free Delivery",
    subtitle: "Same day delivery available",
    primary: { href: "/products", label: "Order Now" },
    secondary: { href: "/products", label: "Delivery Info" },
  },
];

export default function Hero() {
  const freeze = typeof window !== "undefined" && window.location.search.includes("freeze");
  const [active, setActive] = useState(0);
  return (
    <section className="overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={freeze ? false : { delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
        loop
        onSlideChange={(s) => setActive(s.realIndex)}
        className="hero-swiper"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={s.title}>
            <div
              className="relative flex h-[400px] items-center justify-center bg-cover bg-center"
              style={{ backgroundImage: "url(/home-slider.png)" }}
            >
              <div className="h-full w-full bg-gradient-to-r from-green-500/90 to-green-400/50 p-4 py-20 text-white">
                <div className="container mx-auto h-full content-center px-4">
                {i === active && (
                  <>
                    <motion.h2
                      key={`h2-${active}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="mb-4 max-w-96 text-3xl font-bold"
                    >
                      {s.title}
                    </motion.h2>
                    <motion.p
                      key={`p-${active}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="mb-6 font-medium"
                    >
                      {s.subtitle}
                    </motion.p>
                    <motion.div
                      key={`btns-${active}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="flex gap-3"
                    >
                      <Link
                        href={s.primary.href}
                        className="rounded-lg bg-white px-6 py-2 text-base font-semibold text-brand hover:bg-green-50"
                      >
                        {s.primary.label}
                      </Link>
                      <Link
                        href={s.secondary.href}
                        className="rounded-lg border border-white px-6 py-2 text-base font-semibold text-white hover:bg-white/10"
                      >
                        {s.secondary.label}
                      </Link>
                    </motion.div>
                  </>
                )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <button
          aria-label="Previous slide"
          className="hero-prev absolute left-4 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-md hover:bg-green-50 sm:flex"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          aria-label="Next slide"
          className="hero-next absolute right-4 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-md hover:bg-green-50 sm:flex"
        >
          <ChevronRight className="size-5" />
        </button>
      </Swiper>
    </section>
  );
}
