import Link from "next/link";
import { notFound } from "next/navigation";
import { FaLayerGroup, FaArrowLeft, FaArrowRight, FaFolderOpen } from "react-icons/fa6";
import { API_BASE } from "@/lib/api";

type Subcategory = { _id: string; name: string; category: string };

async function fetchSubcategories(categoryId: string): Promise<Subcategory[]> {
  // The category-scoped endpoint returns exactly this category's
  // subcategories (same data the demo shows).
  const res = await fetch(`${API_BASE}/categories/${categoryId}/subcategories`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  return (await res.json()).data ?? [];
}

export default async function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`${API_BASE}/categories/${id}`, { next: { revalidate: 300 } });
  if (!res.ok) notFound();
  const category = (await res.json()).data;
  const subcategories = await fetchSubcategories(id);

  return (
    <>
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="text-white/40">/</span>
            <Link href="/categories" className="transition-colors hover:text-white">Categories</Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">{category.name}</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
              {category.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={category.image} alt={category.name} className="h-12 w-12 object-contain" />
              ) : (
                <FaLayerGroup className="text-3xl" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
              <p className="mt-1 text-white/80">Choose a subcategory to browse products</p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <Link
            href="/categories"
            className="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-primary-600"
          >
            <FaArrowLeft /> <span>Back to Categories</span>
          </Link>
          {subcategories.length > 0 && (
            <h2 className="mb-6 text-lg font-bold text-gray-900">
              {subcategories.length} Subcategories in {category.name}
            </h2>
          )}
          {subcategories.length === 0 ? (
            <div className="rounded-xl bg-white p-16 text-center shadow-sm">
              <p className="mb-2 text-gray-500">Subcategories for this category aren&apos;t available from the store right now.</p>
              <p className="mb-2 text-xs text-gray-400">The store&apos;s catalog data is incomplete, so this list may be missing entries.</p>
              <p className="text-sm text-gray-400">
                You can still{" "}
                <Link href={`/products?category=${id}`} className="font-medium text-primary-600 hover:text-primary-700">
                  browse all {category.name} products
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {subcategories.map((s) => (
                <Link
                  key={s._id}
                  href={`/products?subcategory=${s._id}`}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 transition-colors group-hover:bg-primary-100">
                    <FaFolderOpen className="text-2xl text-primary-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-600">{s.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-primary-600 opacity-0 transition-opacity group-hover:opacity-100">
                    <span>Browse Products</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
