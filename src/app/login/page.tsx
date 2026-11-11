import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/get-token";
import LoginForm from "./login-form";

export const metadata = { title: "Sign In | FreshCart" };

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/");
  return <LoginForm />;
}
