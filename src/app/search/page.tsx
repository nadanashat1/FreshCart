import { API_BASE } from "@/lib/api";
import type { Product, Category } from "@/lib/api";
import SearchView from "./search-view";

interface Brand {
  _id: string;
  name: string;
}

async function fetchJson(path: string) {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [p1, p2, cats, brands] = await Promise.all([
    fetchJson("/products?page=1"),
    fetchJson("/products?page=2"),
    fetchJson("/categories"),
    fetchJson("/brands"),
  ]);
  const products: Product[] = [...(p1?.data ?? []), ...(p2?.data ?? [])];
  const categories: Category[] = cats?.data ?? [];
  const brandList: Brand[] = brands?.data ?? [];

  return (
    <SearchView
      initialQuery={q ?? ""}
      products={products}
      categories={categories}
      brands={brandList}
    />
  );
}
