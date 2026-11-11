import Link from "next/link";
import { FaTruckFast } from "react-icons/fa6";

export const metadata = { title: "Track Order | FreshCart" };

export default function TrackOrderPage() {
  return (
    <section className="py-10">
      <div className="container mx-auto max-w-2xl px-4">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-primary-600">Home</Link>
          <span>/</span>
          <span className="font-medium text-gray-900">Track Order</span>
        </nav>
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
            <FaTruckFast className="text-2xl text-primary-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Track Your Order</h1>
          <p className="mb-6 text-sm leading-relaxed text-gray-600">
            Sign in and open your Orders page to see the live status of every order -
            processing, paid, and delivered - as it is updated.
          </p>
          <Link
            href="/orders"
            className="inline-block rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            Go to My Orders
          </Link>
        </div>
      </div>
    </section>
  );
}
