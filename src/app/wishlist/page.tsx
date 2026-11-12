import Link from "next/link";
import { FaHeart, FaArrowRight } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { getApiToken } from "@/lib/get-token";
import WishlistTable from "./wishlist-table";
import GuestWishlistView from "./guest-wishlist-view";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

export default async function WishlistPage() {
  const token = await getApiToken();
  if (!token) return <GuestWishlistView />;

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
    <div className="min-h-screen bg-gray-50/50">
      {items.length > 0 && (
        <div className="border-b border-gray-100 bg-white">
          <div className="container mx-auto px-4 py-6">
            <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="transition hover:text-primary-600">Home</Link>
              <span>/</span>
              <span className="font-medium text-gray-900">Wishlist</span>
            </nav>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                <FaHeart className="text-xl text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-sm text-gray-500">{items.length} item{items.length === 1 ? "" : "s"} saved</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">

        {items.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="w-full max-w-sm text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
                <FaRegHeart className="text-3xl text-gray-400" />
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-900">Your wishlist is empty</h2>
              <p className="mb-6 text-sm text-gray-500">
                Browse products and save your favorites here. Sign in to sync your wishlist across devices.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  Browse Products <FaArrowRight className="text-sm" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <WishlistTable items={items} inCartIds={inCartIds} />
            <Link href="/products" className="mt-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-primary-600">
              <span>←</span> <span>Continue Shopping</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
