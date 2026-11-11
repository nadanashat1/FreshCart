import Link from "next/link";
import { FaBoxOpen } from "react-icons/fa6";
import ProductCard from "@/components/home/product-card";
import { API_BASE } from "@/lib/api";
import type { Product } from "@/lib/api";

async function fetchPage(page: number): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products?page=${page}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    keyword?: string;
    category?: string;
    brand?: string;
    subcategory?: string;
  }>;
}) {
  const { keyword, category, brand, subcategory } = await searchParams;
  const q = keyword?.trim().toLowerCase() ?? "";

  let products: Product[];
  let contextName: string | null = null;
  let contextKind: "Category" | "Brand" | "Subcategory" = category ? "Category" : "Brand";
  if (category || brand || subcategory) {
    // API-side filter by category, brand, or subcategory (real server filtering).
    const filter = category
      ? `category[in]=${category}`
      : brand
        ? `brand=${brand}`
        : `subcategory[in]=${subcategory}`;
    if (subcategory) contextKind = "Subcategory";
    const res = await fetch(`${API_BASE}/products?${filter}`, { next: { revalidate: 300 } });
    products = res.ok ? (await res.json()).data ?? [] : [];
    if (!subcategory && products.length > 0) {
      contextName = category ? products[0].category?.name ?? null : products[0].brand?.name ?? null;
    } else {
      // Subcategory (products carry no subcategory name) or empty result:
      // resolve the name from the taxonomy endpoint.
      const ep = subcategory
        ? `subcategories/${subcategory}`
        : category
          ? `categories/${category}`
          : `brands/${brand}`;
      const nr = await fetch(`${API_BASE}/${ep}`, { next: { revalidate: 300 } });
      contextName = nr.ok ? (await nr.json()).data?.name ?? null : null;
    }
  } else if (q) {
    // The Route API's ?keyword= filter returns empty even for existing titles,
    // and the reference demo silently ignores it. FreshCart instead searches
    // the full catalog client-side (disclosed divergence from the demo).
    const [p1, p2] = await Promise.all([fetchPage(1), fetchPage(2)]);
    products = [...p1, ...p2].filter((p) => p.title.toLowerCase().includes(q));
  } else {
    products = await fetchPage(1);
  }

  return (
    <>
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">{contextName ?? "All Products"}</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
              <FaBoxOpen className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {contextName ?? (q ? `Results for "${keyword}"` : "All Products")}
              </h1>
              <p className="mt-1 text-white/80">
                {contextName
                  ? `${contextKind} products from our collection`
                  : q
                    ? "Search across our complete product collection"
                    : "Explore our complete product collection"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <p className="mb-6 text-sm text-gray-500">Showing {products.length} products</p>
          {products.length === 0 ? (
            <p className="py-16 text-center text-gray-500">
              No products matched your search. Try a different keyword.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
