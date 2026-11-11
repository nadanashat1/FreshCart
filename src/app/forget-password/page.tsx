import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/get-token";
import ForgotForm from "./forgot-form";

export const metadata = { title: "Forgot Password | FreshCart" };

export default async function ForgetPasswordPage() {
  const user = await getSessionUser();
  if (user) redirect("/");
  return <ForgotForm />;
}
