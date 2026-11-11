import type { Product } from "@/lib/api";
import ProductCard from "./product-card";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="my-8 flex items-center gap-3">
          <div className="h-8 w-1.5 rounded-full bg-linear-to-b from-emerald-500 to-emerald-700"></div>
          <h2 className="text-3xl font-bold text-gray-800">
            Featured <span className="text-emerald-600">Products</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
