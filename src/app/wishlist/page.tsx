import Link from "next/link";
import { redirect } from "next/navigation";
import { FaHeart } from "react-icons/fa6";
import { getApiToken } from "@/lib/get-token";
import WishlistTable from "./wishlist-table";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

export default async function WishlistPage() {
  const token = await getApiToken();
  if (!token) redirect("/login");

  const [wishRes, cartRes] = await Promise.all([
    fetch(`${API_BASE}/wishlist`, { headers: { token }, cache: "no-store" }),
    fetch(`${API_BASE}/cart`, { headers: { token }, cache: "no-store" }),
  ]);
  const items = wishRes.ok ? (await wishRes.json()).data ?? [] : [];
  const cartData = cartRes.ok ? (await cartRes.json()).data : null;
  const inCartIds: string[] = (cartData?.products ?? []).map(
    (p: { product: { _id: string } }) => p.product._id
  );

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-primary-600">Home</Link>
          <span>/</span>
          <span className="font-medium text-gray-900">Wishlist</span>
        </nav>
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
            <FaHeart className="text-xl text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-sm text-gray-500">{items.length} item{items.length === 1 ? "" : "s"} saved</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl bg-white p-16 text-center shadow-sm">
            <FaHeart className="mx-auto mb-4 text-5xl text-gray-300" />
            <p className="mb-6 text-gray-500">Your wishlist is empty. Save products you love for later.</p>
            <Link
              href="/products"
              className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <WishlistTable items={items} inCartIds={inCartIds} />
            <Link href="/products" className="mt-6 inline-block font-medium text-primary-600 hover:text-primary-700">
              ← Continue Shopping
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
