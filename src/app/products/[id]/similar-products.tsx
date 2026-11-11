"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import type { Product } from "@/lib/api";
import ProductCard from "@/components/home/product-card";

import "swiper/css";

export default function SimilarProducts({ products }: { products: Product[] }) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (products.length === 0) return null;

  return (
    <section id="similar-products" className="py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700" />
            <h2 className="text-2xl font-bold text-gray-800">
              You May Also <span className="text-emerald-600">Like</span>
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-primary-100 hover:text-primary-600"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-primary-100 hover:text-primary-600"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        <Swiper
          onSwiper={(s) => {
            swiperRef.current = s;
          }}
          slidesPerView={5}
          spaceBetween={16}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 12 },
            768: { slidesPerView: 3, spaceBetween: 14 },
            1024: { slidesPerView: 4, spaceBetween: 16 },
            1280: { slidesPerView: 5, spaceBetween: 16 },
          }}
        >
          {products.map((p) => (
            <SwiperSlide key={p._id} className="h-auto pb-2">
              <ProductCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
