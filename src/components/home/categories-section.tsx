import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import type { Category } from "@/lib/api";

export default function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section id="categories" className="py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
          <div className="my-8 flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700" />
            <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Shop By <span className="text-emerald-600">Category</span>
            </h2>
          </div>
          <Link
            href="/categories"
            className="flex items-center self-end font-medium text-primary-600 hover:text-primary-700 sm:self-auto"
          >
            View All Categories <FaArrowRight className="ml-2" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`/categories/${c._id}`}
              className="group cursor-pointer rounded-lg bg-white p-4 text-center shadow-sm transition hover:shadow-md"
            >
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary-100 transition group-hover:bg-primary-200">
                <Image
                  src={c.image}
                  alt={c.name}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-medium">{c.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
