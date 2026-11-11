import Link from "next/link";
import { notFound } from "next/navigation";
import { FaLayerGroup, FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { API_BASE } from "@/lib/api";

type Subcategory = { _id: string; name: string; category: string };

async function fetchSubcategories(categoryId: string): Promise<Subcategory[]> {
  // API quirks, verified by probing: the category-scoped endpoint ignores its
  // category filter and returns the same global list as /subcategories; the
  // global endpoint's page 2 is broken (consistently returns 0 items), so only
  // the first 40 subcategories are reachable at all. We fetch the stable global
  // first page and filter to this category ourselves - real filtering instead
  // of mirroring the demo, which displays all 40 global subcategories (incl.
  // Kitchen & Dining) under every category.
  const res = await fetch(`${API_BASE}/subcategories`, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const all: Subcategory[] = (await res.json()).data ?? [];
  return all.filter((s) => s.category === categoryId);
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
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="text-white/40">/</span>
            <Link href="/categories" className="transition-colors hover:text-white">Categories</Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">{category.name}</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
              <FaLayerGroup className="text-3xl" />
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
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <FaArrowLeft className="text-xs" /> Back to Categories
          </Link>
          {subcategories.length > 0 && (
            <h2 className="mb-6 text-lg font-bold text-gray-900">
              {subcategories.length} available subcategories in {category.name}
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {subcategories.map((s) => (
                <div
                  key={s._id}
                  className="rounded-xl bg-white p-5 text-center shadow-sm transition hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  <Link
                    href={`/products?subcategory=${s._id}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Browse Products <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
