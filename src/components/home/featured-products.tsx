import type { Product } from "@/lib/api";
import ProductCard from "./product-card";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="mb-8 border-l-4 border-primary-600 pl-3 text-3xl font-bold text-gray-800">
          Featured <span className="text-emerald-600">Products</span>
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
