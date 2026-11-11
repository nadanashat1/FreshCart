import Link from "next/link";
import { FaLayerGroup, FaArrowRight } from "react-icons/fa6";
import { API_BASE } from "@/lib/api";

type Category = { _id: string; name: string; image: string };

export default async function CategoriesPage() {
  const res = await fetch(`${API_BASE}/categories`, { next: { revalidate: 300 } });
  const categories: Category[] = res.ok ? (await res.json()).data ?? [] : [];

  return (
    <>
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">Categories</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
              <FaLayerGroup className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All Categories</h1>
              <p className="mt-1 text-white/80">Browse our wide range of product categories</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {categories.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <FaLayerGroup className="text-3xl text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">No Categories Found</h3>
            <p className="text-gray-500">Categories will appear here once available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c._id}
                href={`/categories/${c._id}`}
                className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl sm:p-6"
              >
                <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-center font-bold text-gray-900 transition-colors group-hover:text-primary-600">
                  {c.name}
                </h3>
                <div className="mt-2 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-1 text-xs text-primary-600">
                    View Subcategories <FaArrowRight className="text-[10px]" />
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
