"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Menu, X, Search } from "lucide-react";
import { FaRegUser, FaArrowRightFromBracket } from "react-icons/fa6";
import { useGuestCartCount, useGuestWishlistCount } from "@/components/guest/use-guest-store";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
];

const accountLinks = [
  { href: "/profile", label: "My Profile" },
  { href: "/orders", label: "My Orders" },
  { href: "/wishlist", label: "My Wishlist" },
  { href: "/profile/addresses", label: "Addresses" },
];

export default function MobileMenu({
  isAuth = false,
  userName,
  cartCount = 0,
  wishlistCount = 0,
}: {
  isAuth?: boolean;
  userName?: string | null;
  cartCount?: number;
  wishlistCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const guestCart = useGuestCartCount();
  const guestWishlist = useGuestWishlistCount();
  const cart = isAuth ? cartCount : guestCart ?? 0;
  const wishlist = isAuth ? wishlistCount : guestWishlist ?? 0;

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
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-green-50 hover:text-brand-dark"
            >
              Wishlist
              {wishlist > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                  {wishlist}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-green-50 hover:text-brand-dark"
            >
              Cart
              {cart > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[11px] font-bold text-white">
                  {cart}
                </span>
              )}
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 hover:bg-green-50 hover:text-brand-dark"
            >
              Support
            </Link>
          </nav>
          {isAuth ? (
            <div className="mt-3 border-t border-gray-100 pt-3">
              <p className="mb-2 flex items-center gap-2 px-3 text-sm font-semibold text-gray-900">
                <FaRegUser className="text-brand" /> {userName ?? "My Account"}
              </p>
              <nav className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                {accountLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 hover:bg-green-50 hover:text-brand-dark"
                  >
                    {l.label}
                  </Link>
                ))}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-red-500 hover:bg-red-50"
                >
                  <FaArrowRightFromBracket /> Sign Out
                </button>
              </nav>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-brand px-5 py-2.5 text-center font-semibold text-white"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
