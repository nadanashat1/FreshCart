import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/get-token";
import RegisterForm from "./register-form";

export const metadata = { title: "Create Account | FreshCart" };

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect("/");
  return <RegisterForm />;
}
