"use client";

import { useState } from "react";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="sticky top-4 rounded-xl bg-white p-4 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[active]} alt={title} className="h-96 w-full object-contain" />
      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`Image ${i + 1}`}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition ${
                i === active ? "border-primary-600" : "border-transparent hover:border-primary-300"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
