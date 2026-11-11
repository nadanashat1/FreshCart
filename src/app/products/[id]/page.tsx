import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaStar,
  FaStarHalfStroke,
  FaRegStar,
  FaTruckFast,
  FaArrowRotateLeft,
  FaShieldHalved,
  FaHouse,
  FaChevronRight,
} from "react-icons/fa6";
import { API_BASE } from "@/lib/api";
import type { Product } from "@/lib/api";
import { getApiToken } from "@/lib/get-token";
import Gallery from "./gallery";
import PurchasePanel from "./purchase-panel";
import ProductTabs from "./tabs";
import SimilarProducts from "./similar-products";

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

  const simRes = await fetch(
    `${API_BASE}/products?category%5Bin%5D=${product.category._id}&limit=13`,
    { next: { revalidate: 300 } }
  );
  const similar: Product[] = simRes.ok
    ? ((await simRes.json()).data ?? []).filter((p: Product) => p._id !== product._id).slice(0, 12)
    : [];

  const token = await getApiToken();
  let initialInWishlist = false;
  if (token) {
    try {
      const wishRes = await fetch(`${API_BASE}/wishlist`, {
        headers: { token },
        cache: "no-store",
      });
      if (wishRes.ok) {
        const wishData = (await wishRes.json()).data ?? [];
        initialInWishlist = wishData.some((w: { _id: string }) => w._id === product._id);
      }
    } catch {
      initialInWishlist = false;
    }
  }

  const hasDiscount =
    !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const price = hasDiscount ? product.priceAfterDiscount! : product.price;
  const savePct = hasDiscount
    ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
    : null;
  const lowStock = product.quantity > 0 && product.quantity <= 10;

  return (
    <section id="product-detail" className="py-6">
      <div className="container mx-auto px-4">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="flex items-center gap-1.5 transition hover:text-primary-600">
            <FaHouse className="text-xs" /> Home
          </Link>
          <FaChevronRight className="text-xs text-gray-400" />
          <Link
            href={`/categories/${product.category._id}`}
            className="transition hover:text-primary-600"
          >
            {product.category.name}
          </Link>
          {product.subcategory?.[0]?.name && (
            <>
              <FaChevronRight className="text-xs text-gray-400" />
              <span>{product.subcategory[0].name}</span>
            </>
          )}
          <FaChevronRight className="text-xs text-gray-400" />
          <span className="font-medium text-gray-900">{product.title}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div id="product-images" className="lg:w-1/4">
            <Gallery
              images={product.images?.length ? product.images : [product.imageCover]}
              title={product.title}
            />
          </div>

          <div id="product-info" className="lg:w-3/4">
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
                <span className="text-sm text-gray-600">
                  {product.ratingsAverage} ({product.ratingsQuantity} reviews)
                </span>
              </div>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">{price} EGP</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{product.price} EGP</span>
                    <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                      Save {savePct}%
                    </span>
                  </>
                )}
              </div>

              <div className="mb-6 flex items-center gap-2">
                {product.quantity > 0 ? (
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${
                      lowStock ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${lowStock ? "bg-amber-500" : "bg-green-500"}`}
                    />
                    {lowStock ? `Only ${product.quantity} left - Order soon!` : "In Stock"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-sm text-red-700">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="mb-6 border-t border-gray-100 pt-5">
                <p className="leading-relaxed text-gray-600">{product.description}</p>
              </div>

              <PurchasePanel
                productId={product._id}
                title={product.title}
                imageCover={product.imageCover}
                categoryName={product.category?.name}
                price={price}
                cartUnitPrice={product.price}
                available={product.quantity}
                initialInWishlist={initialInWishlist}
              />

              <div className="border-t border-gray-100 pt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { icon: FaTruckFast, title: "Free Delivery", sub: "Orders over $50" },
                    { icon: FaArrowRotateLeft, title: "30 Days Return", sub: "Money back" },
                    { icon: FaShieldHalved, title: "Secure Payment", sub: "100% Protected" },
                  ].map(({ icon: Icon, title, sub }) => (
                    <div key={title} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                        <Icon />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                        <p className="text-xs text-gray-500">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductTabs product={product} reviews={reviews} />
      </div>

      <SimilarProducts products={similar} />
    </section>
  );
}
