import { redirect } from "next/navigation";
import { getApiToken } from "@/lib/get-token";
import AddressManager from "./address-manager";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

export default async function AddressesPage() {
  const token = await getApiToken();
  if (!token) redirect("/login");

  const res = await fetch(`${API_BASE}/addresses`, { headers: { token }, cache: "no-store" });
  const addresses = res.ok ? (await res.json()).data ?? [] : [];

  return <AddressManager addresses={addresses} />;
}
