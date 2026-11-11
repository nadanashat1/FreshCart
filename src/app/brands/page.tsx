import Link from "next/link";
import { FaAward, FaArrowRight } from "react-icons/fa6";
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
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">Brands</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
              <FaAward className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Top Brands</h1>
              <p className="mt-1 text-white/80">Shop from your favorite brands</p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10">
        <div className="container mx-auto px-4">
          {brands.length === 0 ? (
            <p className="py-16 text-center text-gray-500">Could not load brands right now.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {brands.map((b) => (
                <div
                  key={b._id}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-gray-50 p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.image}
                      alt={b.name}
                      className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="font-semibold text-gray-900">{b.name}</h2>
                    <Link
                      href={`/products?brand=${b._id}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      View Products <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
