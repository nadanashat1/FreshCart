"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaMagnifyingGlass,
  FaSliders,
  FaGripVertical,
  FaList,
  FaFilter,
  FaXmark,
} from "react-icons/fa6";
import ProductCard from "@/components/home/product-card";
import SearchListRow from "./search-list-row";
import type { Product, Category } from "@/lib/api";

interface Brand {
  _id: string;
  name: string;
}

const SORTS = [
  { value: "", label: "Relevance" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-ratingsAverage", label: "Rating: High to Low" },
  { value: "title", label: "Name: A to Z" },
  { value: "-title", label: "Name: Z to A" },
];

const PRICE_CHIPS = [
  { label: "Under 500", max: 500 },
  { label: "Under 1K", max: 1000 },
  { label: "Under 5K", max: 5000 },
  { label: "Under 10K", max: 10000 },
];

export default function SearchView({
  initialQuery,
  products,
  categories,
  brands,
}: {
  initialQuery: string;
  products: Product[];
  categories: Category[];
  brands: Brand[];
}) {
  const router = useRouter();
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    let list = products;
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => p.title.toLowerCase().includes(q));
    if (selectedCats.length > 0)
      list = list.filter((p) => selectedCats.includes(p.category?._id));
    if (selectedBrands.length > 0)
      list = list.filter((p) => selectedBrands.includes(p.brand?._id));
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!Number.isNaN(min) && min > 0)
      list = list.filter((p) => (p.priceAfterDiscount ?? p.price) >= min);
    if (!Number.isNaN(max) && max > 0)
      list = list.filter((p) => (p.priceAfterDiscount ?? p.price) <= max);
    if (sort) {
      const dir = sort.startsWith("-") ? -1 : 1;
      const key = sort.replace(/^-/, "") as "price" | "ratingsAverage" | "title";
      list = [...list].sort((a, b) => {
        if (key === "title") return dir * a.title.localeCompare(b.title);
        const av = key === "price" ? (a.priceAfterDiscount ?? a.price) : a.ratingsAverage;
        const bv = key === "price" ? (b.priceAfterDiscount ?? b.price) : b.ratingsAverage;
        return dir * (av - bv);
      });
    }
    return list;
  }, [products, query, selectedCats, selectedBrands, minPrice, maxPrice, sort]);

  const clearAll = () => {
    setQuery("");
    setInput("");
    setSelectedCats([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    router.replace("/search");
  };

  const hasFilters =
    query.trim() !== "" ||
    selectedCats.length > 0 ||
    selectedBrands.length > 0 ||
    minPrice !== "" ||
    maxPrice !== "";

  const toggle = (list: string[], v: string, set: (x: string[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(input);
    router.replace(input.trim() ? `/search?q=${encodeURIComponent(input.trim())}` : "/search");
  };

  const sidebar = (
    <aside className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="mb-6">
        <h3 className="mb-4 font-bold text-gray-900">Categories</h3>
        <div className="max-h-52 space-y-2 overflow-y-auto pr-2">
          {categories.map((c) => (
            <label key={c._id} className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 transition-colors hover:text-gray-900">
              <input
                type="checkbox"
                checked={selectedCats.includes(c._id)}
                onChange={() => toggle(selectedCats, c._id, setSelectedCats)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6 border-t border-gray-100 pt-6">
        <h3 className="mb-4 font-bold text-gray-900">Price Range</h3>
        <div className="mb-3 flex items-center gap-2">
          <div>
            <span className="mb-1 block text-xs text-gray-500">Min (EGP)</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <span className="mb-1 block text-xs text-gray-500">Max (EGP)</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="No limit"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRICE_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => setMaxPrice(String(chip.max))}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6 border-t border-gray-100 pt-6">
        <h3 className="mb-4 font-bold text-gray-900">Brands</h3>
        <div className="max-h-52 space-y-2 overflow-y-auto pr-2">
          {brands.map((b) => (
            <label key={b._id} className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 transition-colors hover:text-gray-900">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b._id)}
                onChange={() => toggle(selectedBrands, b._id, setSelectedBrands)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              {b.name}
            </label>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={clearAll}
        className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
      >
        Clear All Filters
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-6">
        <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-primary-600">Home</Link>
          <span>/</span>
          <span className="font-medium text-gray-900">Search Results</span>
        </nav>

        <form onSubmit={submit} className="max-w-2xl">
          <div className="relative">
            <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-lg outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </form>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Search Results{query.trim() ? ` for "${query.trim()}"` : ""}
          </h1>
          <p className="mt-1 text-sm text-gray-500">We found {results.length} products for you</p>
        </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="hidden w-64 shrink-0 lg:block"><div className="sticky top-24">{sidebar}</div></aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 lg:hidden"
                >
                  <FaSliders /> Filters
                </button>
                <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
                  <button
                    type="button"
                    aria-label="Grid view"
                    onClick={() => setView("grid")}
                    className={`rounded-md p-2 transition-colors ${view === "grid" ? "bg-primary-600 text-white" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <FaGripVertical />
                  </button>
                  <button
                    type="button"
                    aria-label="List view"
                    onClick={() => setView("list")}
                    className={`rounded-md p-2 transition-colors ${view === "list" ? "bg-primary-600 text-white" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div
              className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${filtersOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
              onClick={() => setFiltersOpen(false)}
            />
            <div
              className={`fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-4 shadow-2xl transition-transform duration-300 lg:hidden ${filtersOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              {sidebar}
            </div>

            {hasFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <FaFilter className="text-xs" /> Active:
                </span>
                {query.trim() && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                    &quot;{query.trim()}&quot;
                    <button type="button" aria-label="Remove search" onClick={() => { setQuery(""); setInput(""); router.replace("/search"); }} className="hover:text-red-500">
                      <FaXmark />
                    </button>
                  </span>
                )}
                {selectedCats.map((id) => (
                  <span key={id} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                    {categories.find((c) => c._id === id)?.name}
                    <button type="button" aria-label="Remove category" onClick={() => toggle(selectedCats, id, setSelectedCats)} className="hover:text-red-500">
                      <FaXmark />
                    </button>
                  </span>
                ))}
                {selectedBrands.map((id) => (
                  <span key={id} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                    {brands.find((b) => b._id === id)?.name}
                    <button type="button" aria-label="Remove brand" onClick={() => toggle(selectedBrands, id, setSelectedBrands)} className="hover:text-red-500">
                      <FaXmark />
                    </button>
                  </span>
                ))}
                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                    {minPrice || "0"} - {maxPrice || "any"} EGP
                    <button type="button" aria-label="Remove price" onClick={() => { setMinPrice(""); setMaxPrice(""); }} className="hover:text-red-500">
                      <FaXmark />
                    </button>
                  </span>
                )}
                <button type="button" onClick={clearAll} className="ml-2 text-xs text-gray-500 underline hover:text-gray-700">
                  Clear all
                </button>
              </div>
            )}

            {results.length === 0 ? (
              <div className="py-20 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <FaMagnifyingGlass className="text-3xl text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">No Products Found</h3>
                <p className="mb-6 text-gray-500">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4">
                {results.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((p) => (
                  <SearchListRow key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
