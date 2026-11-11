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
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
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

      <section className="py-10">
        <div className="container mx-auto px-4">
          {categories.length === 0 ? (
            <p className="py-16 text-center text-gray-500">Could not load categories right now.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {categories.map((c) => (
                <div
                  key={c._id}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="font-semibold text-gray-900">{c.name}</h2>
                    <Link
                      href={`/categories/${c._id}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      View Subcategories <FaArrowRight className="text-xs" />
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
