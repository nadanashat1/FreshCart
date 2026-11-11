import Link from "next/link";
import { redirect } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { getApiToken } from "@/lib/get-token";
import AddressManager from "./address-manager";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

export default async function AddressesPage() {
  const token = await getApiToken();
  if (!token) redirect("/login");

  const res = await fetch(`${API_BASE}/addresses`, { headers: { token }, cache: "no-store" });
  const addresses = res.ok ? (await res.json()).data ?? [] : [];

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-primary-600">Home</Link>
          <span>/</span>
          <span className="font-medium text-gray-900">My Addresses</span>
        </nav>
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
            <FaLocationDot className="text-xl text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
            <p className="text-sm text-gray-500">Manage your saved delivery addresses</p>
          </div>
        </div>

        {addresses.length === 0 && (
          <div className="mb-6 rounded-xl bg-white p-10 text-center shadow-sm">
            <FaLocationDot className="mx-auto mb-4 text-5xl text-gray-300" />
            <h2 className="mb-2 text-lg font-bold text-gray-900">No Addresses Yet</h2>
            <p className="text-gray-500">Add your first delivery address to make checkout faster and easier.</p>
          </div>
        )}

        <AddressManager addresses={addresses} />
      </div>
    </section>
  );
}
