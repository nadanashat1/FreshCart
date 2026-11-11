import { redirect } from "next/navigation";
import { getLinkState, getSessionUser } from "@/lib/get-token";
import LoginForm from "./login-form";

export const metadata = { title: "Sign In | FreshCart" };

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    const link = await getLinkState();
    redirect(link?.pendingLink ? "/link-account" : "/");
  }
  return <LoginForm />;
}
