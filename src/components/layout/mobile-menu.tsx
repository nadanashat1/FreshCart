"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
  { href: "/support", label: "Support" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-dark"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-16 z-50 border-b border-gray-100 bg-white px-4 pb-4 shadow-lg">
          <form className="relative my-3" action="/products">
            <input
              type="search"
              name="keyword"
              placeholder="Search for products, brands and more..."
              className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-4 pr-12 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1 top-1 flex size-8 items-center justify-center rounded-full bg-brand text-white"
            >
              <Search className="size-4" />
            </button>
          </form>
          <nav className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-green-50 hover:text-brand-dark"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand px-5 py-2.5 text-center font-semibold text-white"
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
