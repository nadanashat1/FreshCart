import { redirect } from "next/navigation";
import { getApiToken, getSessionUser } from "@/lib/get-token";
import SettingsForms from "./settings-forms";

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

export default async function SettingsPage() {
  const token = await getApiToken();
  if (!token) redirect("/login");
  const user = await getSessionUser();

  let userId = "";
  let role = "user";
  try {
    const res = await fetch(`${API_BASE}/auth/verifyToken`, {
      headers: { token },
      cache: "no-store",
    });
    if (res.ok) {
      const body = await res.json();
      userId = body?.decoded?.id ?? "";
      role = body?.decoded?.role ?? "user";
    }
  } catch {
    // account info panel degrades gracefully
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Update your profile information and change your password</p>
      </div>
      <SettingsForms
        initialName={user?.name ?? ""}
        initialEmail={user?.email ?? ""}
        userId={userId}
        role={role}
      />
    </div>
  );
}
