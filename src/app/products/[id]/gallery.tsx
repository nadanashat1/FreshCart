"use client";

import { useState } from "react";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="sticky top-4 rounded-xl bg-white p-4 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[active]} alt={title} className="w-full" />
      {images.length > 1 && (
        <div className="mt-[3px] flex gap-[2px] overflow-x-auto py-[3px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`Image ${i + 1}`}
              className={`w-[75px] shrink-0 border-[3px] bg-white transition ${
                i === active
                  ? "border-[#337ab7]"
                  : "border-transparent hover:border-[#337ab7]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
