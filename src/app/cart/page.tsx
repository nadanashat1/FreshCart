import Link from "next/link";
import { redirect } from "next/navigation";
import { FaCartShopping, FaLock, FaTruck, FaShieldHalved } from "react-icons/fa6";
import { getApiToken } from "@/lib/get-token";
import CartItems from "./cart-items";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";
const FREE_SHIPPING_THRESHOLD = 500;

export default async function CartPage() {
  const token = await getApiToken();
  if (!token) redirect("/login");

  const res = await fetch(`${API_BASE}/cart`, {
    headers: { token },
    cache: "no-store",
  });
  const data = res.ok ? await res.json() : null;
  const items = data?.data?.products ?? [];

  // The store API prices cart lines at the product's base price, ignoring
  // priceAfterDiscount. Fetch catalog prices so discounted lines can say so
  // instead of silently dropping the discount the catalog advertises.
  const discountMap: Record<string, number> = {};
  await Promise.all(
    items.map(async (it: { price: number; product: { _id: string } }) => {
      try {
        const pr = await fetch(`${API_BASE}/products/${it.product._id}`, { next: { revalidate: 300 } });
        if (!pr.ok) return;
        const pd = (await pr.json()).data;
        if (pd?.priceAfterDiscount && pd.priceAfterDiscount < it.price) {
          discountMap[it.product._id] = pd.priceAfterDiscount;
        }
      } catch {
        // catalog enrichment is best-effort; the charged prices shown are unaffected
      }
    })
  );
  const total = data?.data?.totalCartPrice ?? 0;
  const numItems = data?.numOfCartItems ?? 0;
  const freeShipping = total >= FREE_SHIPPING_THRESHOLD;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="transition hover:text-primary-600">Home</Link>
            <span>/</span>
            <span className="font-medium text-gray-900">Shopping Cart</span>
          </nav>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <FaCartShopping />
            </span>
            Shopping Cart
          </h1>
          <p className="mt-2 text-gray-500">
            {numItems === 0 ? (
              "Your cart is empty"
            ) : (
              <>
                You have <span className="font-semibold text-primary-600">{numItems} item{numItems === 1 ? "" : "s"}</span> in your cart
              </>
            )}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl bg-white p-16 text-center shadow-sm">
            <FaCartShopping className="mx-auto mb-4 text-5xl text-gray-300" />
            <p className="mb-6 text-gray-500">Looks like you haven&apos;t added anything yet.</p>
            <Link
              href="/products"
              className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CartItems items={items} discountMap={discountMap} />
            </div>
            <div>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h2>
                <p className="mb-4 text-sm text-gray-500">{numItems} item{numItems === 1 ? "" : "s"} in your cart</p>
                {freeShipping ? (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-primary-50 p-3 text-sm text-primary-700">
                    <FaTruck />
                    <span><span className="font-semibold">Free Shipping!</span> You qualify for free delivery</span>
                  </div>
                ) : (
                  <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                    Add {(FREE_SHIPPING_THRESHOLD - total).toLocaleString()} EGP more to qualify for free delivery
                  </div>
                )}
                <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold">{total.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-semibold text-primary-600">{freeShipping ? "FREE" : "Calculated at checkout"}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 text-base">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary-600">{total.toLocaleString()} EGP</span>
                  </div>
                </div>
                <button
                  disabled
                  title="Promo codes are not available in this build yet"
                  className="mt-4 w-full cursor-not-allowed rounded-xl border-2 border-dashed border-gray-200 py-2.5 text-sm text-gray-400"
                >
                  Apply Promo Code
                </button>
                <Link
                  href="/checkout"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 font-semibold text-white transition hover:bg-gray-800"
                >
                  <FaLock /> Secure Checkout
                </Link>
                <p className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <FaShieldHalved /> Secure Payment • Fast Delivery
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
