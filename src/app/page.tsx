import { getCategories, getProducts } from "@/lib/api";
import Hero from "@/components/home/hero";
import FeaturesStrip from "@/components/home/features-strip";
import CategoriesSection from "@/components/home/categories-section";
import Promos from "@/components/home/promos";
import FeaturedProducts from "@/components/home/featured-products";
import Newsletter from "@/components/home/newsletter";

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <>
      <Hero />
      <FeaturesStrip />
      <CategoriesSection categories={categories} />
      <Promos />
      <FeaturedProducts products={products} />
      <Newsletter />
    </>
  );
}
