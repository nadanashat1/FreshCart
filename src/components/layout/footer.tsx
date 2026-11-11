import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaTruckFast, FaArrowRotateLeft, FaShieldHalved, FaHeadset } from "react-icons/fa6";

const socialIcons = [
  { name: "Facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
  { name: "Twitter", path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" },
  { name: "Instagram", path: "M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5zm-4 12.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5zm5.3-7.8a.9.9 0 1 1 .9-.9.9.9 0 0 1-.9.9z" },
  { name: "Youtube", path: "M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8zM10 15V9l5.2 3z" },
];

const columns: { title: string; links: { label: string; href: string | null }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Brands", href: "/brands" },
      { label: "Electronics", href: "/products?category=6439d2d167d9aa4ca970649f" },
      { label: "Men's Fashion", href: "/products?category=6439d5b90049ad0b52b90048" },
      { label: "Women's Fashion", href: "/products?category=6439d58a0049ad0b52b9003f" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Account", href: "/profile/addresses" },
      { label: "Order History", href: "/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Shopping Cart", href: "/cart" },
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/register" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Help Center", href: "/help" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const perks = [
  { icon: FaTruckFast, title: "Free Shipping", text: "On orders over 500 EGP" },
  { icon: FaArrowRotateLeft, title: "Easy Returns", text: "14-day return policy" },
  { icon: FaShieldHalved, title: "Secure Payment", text: "100% secure checkout" },
  { icon: FaHeadset, title: "24/7 Support", text: "Contact us anytime" },
];

export default function Footer() {
  return (
    <footer>
      <div className="border-y border-primary-100 bg-primary-50">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-xl text-primary-600">
                <p.icon />
              </span>
              <span>
                <span className="block text-sm font-semibold text-gray-900">{p.title}</span>
                <span className="block text-xs text-gray-500">{p.text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 text-gray-300">
        <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-6">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block rounded-lg bg-white px-4 py-2">
              <Image src="/freshcart-logo.svg" alt="FreshCart" width={160} height={31} className="h-8 w-auto" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              FreshCart is your one-stop destination for quality products. From
              fashion to electronics, we bring you the best brands at
              competitive prices with a seamless shopping experience.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Phone className="size-4 text-brand" /> +1 (800) 123-4567
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-brand" /> support@freshcart.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-brand" /> 123 Commerce Street, New York, NY 10001
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              {socialIcons.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="rounded-full bg-gray-800 p-2 text-gray-300 hover:bg-brand hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <Link href={l.href} className="text-gray-400 hover:text-green-400">
                        {l.label}
                      </Link>
                    ) : (
                      <span className="cursor-default text-gray-600" title="Coming soon">
                        {l.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800">
          <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-gray-500 sm:flex-row">
            <p>© {new Date().getFullYear()} FreshCart. All rights reserved.</p>
            <div className="flex gap-2">
              {["Visa", "Mastercard", "PayPal"].map((p) => (
                <span key={p} className="rounded bg-gray-800 px-2.5 py-1 font-medium text-gray-300">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
