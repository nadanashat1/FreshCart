"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-lg font-bold text-gray-700 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-lg sm:w-auto"
    >
      {children}
    </button>
  );
}
