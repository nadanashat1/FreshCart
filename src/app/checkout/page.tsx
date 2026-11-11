import Link from "next/link";
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
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>
        <CheckoutForm items={items} total={total} addresses={addresses} liveEnabled={liveEnabled} />
      </div>
    </section>
  );
}
