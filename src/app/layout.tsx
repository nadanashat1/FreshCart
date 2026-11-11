import type { Metadata } from "next";
import { Exo } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layout/topbar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import GuestMerge from "@/components/guest/guest-merge";
import { getSessionUser } from "@/lib/get-token";

const exo = Exo({
  variable: "--font-exo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreshCart - E-Commerce",
  description: "FreshCart is your one-stop destination for quality products.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  return (
    <html lang="en">
      <body
        className={`${exo.variable} antialiased`}
      >
        <TopBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <GuestMerge isAuth={!!user} />
      </body>
    </html>
  );
}
