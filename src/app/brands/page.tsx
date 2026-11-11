import Link from "next/link";
import { FaTags, FaArrowRight } from "react-icons/fa6";
import { API_BASE } from "@/lib/api";

type Brand = { _id: string; name: string; image: string };

export default async function BrandsPage() {
  // The API paginates brands (max 50/page); fetch both pages for the full list.
  const [r1, r2] = await Promise.all([
    fetch(`${API_BASE}/brands?limit=50&page=1`, { next: { revalidate: 300 } }),
    fetch(`${API_BASE}/brands?limit=50&page=2`, { next: { revalidate: 300 } }),
  ]);
  const brands: Brand[] = [
    ...(r1.ok ? (await r1.json()).data ?? [] : []),
    ...(r2.ok ? (await r2.json()).data ?? [] : []),
  ];

  return (
    <>
      <div className="bg-gradient-to-br from-violet-600 via-violet-500 to-purple-400 text-white">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">Brands</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
              <FaTags className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Top Brands</h1>
              <p className="mt-1 text-white/80">Shop from your favorite brands</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {brands.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <FaTags className="text-3xl text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">No Brands Found</h3>
            <p className="text-gray-500">Brands will appear here once available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-6">
            {brands.map((b) => (
              <Link
                key={b._id}
                href={`/products?brand=${b._id}`}
                className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl sm:p-5"
              >
                <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.image}
                    alt={b.name}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="truncate text-center text-sm font-semibold text-gray-900 transition-colors group-hover:text-violet-600">
                  {b.name}
                </h3>
                <div className="mt-1.5 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-1 text-xs text-violet-600">
                    View Products <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
