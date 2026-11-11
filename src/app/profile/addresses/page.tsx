import { redirect } from "next/navigation";
import { getApiToken, getLinkState } from "@/lib/get-token";
import AddressManager from "./address-manager";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

export default async function AddressesPage() {
  const token = await getApiToken();
  if (!token) {
    const link = await getLinkState();
    redirect(link?.pendingLink ? "/link-account" : "/login");
  }

  const res = await fetch(`${API_BASE}/addresses`, { headers: { token }, cache: "no-store" });
  const addresses = res.ok ? (await res.json()).data ?? [] : [];

  return <AddressManager addresses={addresses} />;
}
