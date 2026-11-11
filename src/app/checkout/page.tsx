import Link from "next/link";
import { FaClipboardList, FaArrowLeft } from "react-icons/fa6";
import { redirect } from "next/navigation";
import { getApiToken } from "@/lib/get-token";
import CheckoutForm from "./checkout-form";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

type CartItem = {
  _id: string;
  count: number;
  price: number;
  product: { _id: string; title: string; imageCover: string };
};
type Address = { _id: string; name: string; details: string; phone: string; city: string };

export default async function CheckoutPage() {
  const token = await getApiToken();
  if (!token) redirect("/login");

  const [cartRes, addrRes] = await Promise.all([
    fetch(`${API_BASE}/cart`, { headers: { token }, cache: "no-store" }),
    fetch(`${API_BASE}/addresses`, { headers: { token }, cache: "no-store" }),
  ]);
  const cartData = cartRes.ok ? (await cartRes.json()).data : null;
  const items: CartItem[] = cartData?.products ?? [];
  const total: number = cartData?.totalCartPrice ?? 0;
  const addresses: Address[] = addrRes.ok ? (await addrRes.json()).data ?? [] : [];

  // Server-side live-submission gate state, passed down so the client only
  // shows working order controls when the server action would accept them.
  const liveEnabled = process.env.ALLOW_LIVE_ORDER_SUBMISSION === "true";

  if (items.length === 0) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="rounded-xl bg-white p-16 text-center shadow-sm">
            <p className="mb-6 text-gray-500">Your cart is empty - add items before checking out.</p>
            <Link href="/products" className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/cart" className="transition hover:text-primary-600">Cart</Link>
          <span>/</span>
          <span className="font-medium text-gray-900">Checkout</span>
        </nav>
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/20">
                <FaClipboardList />
              </span>
              Complete Your Order
            </h1>
            <p className="mt-2 text-gray-500">Review your items and complete your purchase</p>
          </div>
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-primary-600 transition-all hover:bg-primary-50 hover:text-primary-700"
          >
            <FaArrowLeft /> Back to Cart
          </Link>
        </div>
        <CheckoutForm items={items} total={total} addresses={addresses} liveEnabled={liveEnabled} />
      </div>
    </section>
  );
}
