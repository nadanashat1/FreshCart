import Link from "next/link";
import { redirect } from "next/navigation";
import { FaBoxOpen, FaTruck, FaCircleCheck } from "react-icons/fa6";
import { getApiToken } from "@/lib/get-token";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

type Order = {
  _id: string;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  cartItems?: { count: number; product: { title: string; imageCover: string } }[];
};

// The Route API token is itself a JWT whose payload carries the user id.
function userIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    return payload.id ?? null;
  } catch {
    return null;
  }
}

export default async function OrdersPage() {
  const token = await getApiToken();
  if (!token) redirect("/login");
  const userId = userIdFromToken(token);

  let orders: Order[] = [];
  let loadFailed = false;
  if (userId) {
    try {
      const res = await fetch(`${API_BASE}/orders/user/${userId}`, { headers: { token }, cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        orders = Array.isArray(data) ? data : data.data ?? [];
      } else {
        loadFailed = true;
      }
    } catch {
      loadFailed = true;
    }
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-primary-600">Home</Link>
          <span>/</span>
          <span className="font-medium text-gray-900">Orders</span>
        </nav>
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
            <FaBoxOpen className="text-xl text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500">
              {loadFailed ? "Could not load orders" : `${orders.length} order${orders.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {loadFailed ? (
          <div className="rounded-xl bg-white p-16 text-center shadow-sm">
            <p className="mb-2 font-medium text-gray-700">We couldn&apos;t load your orders right now.</p>
            <p className="mb-6 text-sm text-gray-500">
              This is usually temporary - refresh the page to try again.
            </p>
            <Link
              href="/orders"
              className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              Refresh
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl bg-white p-16 text-center shadow-sm">
            <FaBoxOpen className="mx-auto mb-4 text-5xl text-gray-300" />
            <h2 className="mb-2 text-lg font-bold text-gray-900">No orders yet</h2>
            <p className="mb-6 text-gray-500">
              When you place orders, they&apos;ll appear here so you can track them.
            </p>
            <Link
              href="/products"
              className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o._id} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{o._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      {" · "}{o.paymentMethodType}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${o.isPaid ? "bg-primary-50 text-primary-700" : "bg-amber-50 text-amber-700"}`}>
                      <FaCircleCheck /> {o.isPaid ? "Paid" : "Cash on delivery"}
                    </span>
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${o.isDelivered ? "bg-primary-50 text-primary-700" : "bg-gray-100 text-gray-600"}`}>
                      <FaTruck /> {o.isDelivered ? "Delivered" : "Processing"}
                    </span>
                    <span className="font-bold text-gray-900">{o.totalOrderPrice} EGP</span>
                  </div>
                </div>
                {o.cartItems && o.cartItems.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    {o.cartItems.map((ci) => `${ci.product.title} x${ci.count}`).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
