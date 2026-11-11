import Link from "next/link";
import { notFound } from "next/navigation";
import { FaStar, FaStarHalfStroke, FaRegStar, FaTruck, FaRotateLeft, FaShieldHalved } from "react-icons/fa6";
import { API_BASE } from "@/lib/api";
import type { Product } from "@/lib/api";
import Gallery from "./gallery";
import PurchasePanel from "./purchase-panel";
import ProductTabs from "./tabs";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex text-yellow-400">
      {[1, 2, 3, 4, 5].map((i) =>
        rating >= i ? <FaStar key={i} /> : rating >= i - 0.5 ? <FaStarHalfStroke key={i} /> : <FaRegStar key={i} />
      )}
    </span>
  );
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`${API_BASE}/products/${id}`, { next: { revalidate: 300 } });
  if (!res.ok) notFound();
  const { data: product }: { data: Product } = await res.json();

  const revRes = await fetch(`${API_BASE}/products/${id}/reviews`, { next: { revalidate: 300 } });
  const reviews = revRes.ok ? (await revRes.json()).data ?? [] : [];

  const hasDiscount =
    !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const price = hasDiscount ? product.priceAfterDiscount! : product.price;
  const savePct = hasDiscount
    ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
    : null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href={`/categories/${product.category._id}`} className="hover:text-primary-600">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-800">{product.title}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          <Gallery
            images={product.images?.length ? product.images : [product.imageCover]}
            title={product.title}
          />

          <div id="product-info" className="lg:w-3/5">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap gap-2">
                <Link
                  href={`/categories/${product.category._id}`}
                  className="rounded-full bg-primary-50 px-3 py-1.5 text-xs text-primary-700 transition hover:bg-primary-100"
                >
                  {product.category.name}
                </Link>
                {product.brand?.name && (
                  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700">
                    {product.brand.name}
                  </span>
                )}
              </div>

              <h1 className="mb-3 text-2xl font-bold text-gray-900 lg:text-3xl">{product.title}</h1>

              <div className="mb-4 flex items-center gap-3">
                <Stars rating={product.ratingsAverage} />
                <span className="text-sm text-gray-500">
                  {product.ratingsAverage} ({product.ratingsQuantity} reviews)
                </span>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">{price} EGP</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{product.price} EGP</span>
                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
                      Save {savePct}%
                    </span>
                  </>
                )}
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                  In Stock
                </span>
              </div>

              <p className="mb-6 leading-relaxed text-gray-600">{product.description}</p>

              <PurchasePanel
                productId={product._id}
                price={price}
                cartUnitPrice={product.price}
                available={product.quantity}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { icon: FaTruck, title: "Free Delivery", sub: "Orders over $50" },
                { icon: FaRotateLeft, title: "30 Days Return", sub: "Money back" },
                { icon: FaShieldHalved, title: "Secure Payment", sub: "100% Protected" },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="rounded-xl bg-white p-4 text-center shadow-sm">
                  <Icon className="mx-auto mb-2 text-xl text-primary-600" />
                  <p className="text-sm font-semibold text-gray-800">{title}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProductTabs description={product.description} reviews={reviews} />
      </div>
    </section>
  );
}
