import Link from "next/link";
import { FaBagShopping, FaCartShopping, FaLock, FaTruck, FaShieldHalved, FaBoxOpen, FaArrowRight } from "react-icons/fa6";
import { getApiToken } from "@/lib/get-token";
import CartItems from "./cart-items";
import CouponForm from "./coupon-form";
import GuestCartView from "./guest-cart-view";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";
const FREE_SHIPPING_THRESHOLD = 500;

export default async function CartPage() {
  const token = await getApiToken();
  if (!token) return <GuestCartView />;

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
  // Present only after a coupon was applied to this cart (PUT /cart/applyCoupon).
  const discounted: number | null =
    typeof data?.data?.totalPriceAfterDiscount === "number" &&
    data.data.totalPriceAfterDiscount < total
      ? data.data.totalPriceAfterDiscount
      : null;
  const payable = discounted ?? total;
  const freeShipping = payable >= FREE_SHIPPING_THRESHOLD;

  return (
    <section className="bg-gray-50/50 py-8">
      <div className="container mx-auto px-4">
        {items.length > 0 && (
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
        )}

        {items.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="max-w-md text-center">
              <div className="relative mb-8">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
                  <FaBoxOpen className="text-5xl text-gray-300" />
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-gray-900">Your cart is empty</h2>
              <p className="mb-8 leading-relaxed text-gray-500">
                Looks like you haven&apos;t added anything to your cart yet.
                <br />
                Start exploring our products!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:bg-primary-700 active:scale-[0.98]"
              >
                Start Shopping <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CartItems items={items} discountMap={discountMap} />
            </div>
            <div>
              <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                    <FaBagShopping /> Order Summary
                  </h2>
                  <p className="mt-1 text-sm text-primary-100">
                    {numItems} item{numItems === 1 ? "" : "s"} in your cart
                  </p>
                </div>
                <div className="space-y-5 p-6">
                  {freeShipping ? (
                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <FaTruck />
                      </div>
                      <div>
                        <p className="font-semibold text-green-700">Free Shipping!</p>
                        <p className="text-sm text-green-600">You qualify for free delivery</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-amber-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm text-amber-700">
                        <FaTruck className="shrink-0" />
                        <span>Add {(FREE_SHIPPING_THRESHOLD - payable).toLocaleString()} EGP for free shipping</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-amber-100">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all"
                          style={{ width: `${Math.min(100, Math.round((payable / FREE_SHIPPING_THRESHOLD) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">{total.toLocaleString()} EGP</span>
                    </div>
                    {discounted !== null && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon discount</span>
                        <span className="font-medium">-{(total - discounted).toLocaleString()} EGP</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-medium text-gray-900">{freeShipping ? "FREE" : "50 EGP"}</span>
                    </div>
                    <div className="mt-3 border-t border-dashed border-gray-200 pt-3">
                      <div className="flex items-baseline justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-900">{(payable + (freeShipping ? 0 : 50)).toLocaleString()}</span>
                          <span className="ml-1 text-sm text-gray-500">EGP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CouponForm applied={discounted !== null} />
                  <Link
                    href="/checkout"
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 font-semibold text-white shadow-lg shadow-primary-600/20 transition-all hover:from-primary-700 hover:to-primary-800 active:scale-[0.98]"
                  >
                    <FaLock />
                    <span>Secure Checkout</span>
                  </Link>
                  <div className="flex items-center justify-center gap-4 py-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FaShieldHalved />
                      <span>Secure Payment</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FaTruck />
                      <span>Fast Delivery</span>
                    </div>
                  </div>
                  <Link
                    href="/"
                    className="block py-2 text-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
