import { redirect } from "next/navigation";
import { getLinkState } from "@/lib/get-token";
import LinkForm from "./link-form";

export const metadata = { title: "Link Your Account | FreshCart" };

export default async function LinkAccountPage() {
  const link = await getLinkState();
  if (!link) redirect("/login");
  if (!link.pendingLink) redirect("/");
  return <LinkForm email={link.email} name={link.name ?? ""} />;
}
