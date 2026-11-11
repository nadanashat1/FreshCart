import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaCartShopping, FaMagnifyingGlass, FaHeadset, FaChevronDown, FaRegUser } from "react-icons/fa6";
import MobileMenu from "./mobile-menu";
import { getSessionUser, getApiToken } from "@/lib/get-token";

const navLinks = [
  { href: "/", label: "Home", active: true },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories", dropdown: true },
  { href: "/brands", label: "Brands" },
];

const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

async function getCounts() {
  const token = await getApiToken();
  if (!token) return { cart: 0, wishlist: 0 };
  try {
    const [cartRes, wishRes] = await Promise.all([
      fetch(`${API_BASE}/cart`, { headers: { token }, cache: "no-store" }),
      fetch(`${API_BASE}/wishlist`, { headers: { token }, cache: "no-store" }),
    ]);
    const cart = cartRes.ok ? (await cartRes.json()).numOfCartItems ?? 0 : 0;
    const wishlist = wishRes.ok ? (await wishRes.json()).count ?? 0 : 0;
    return { cart, wishlist };
  } catch {
    return { cart: 0, wishlist: 0 };
  }
}

export default async function Header() {
  const user = await getSessionUser();
  const counts = user ? await getCounts() : { cart: 0, wishlist: 0 };
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-8 lg:h-[72px]">
          <Link href="/" className="shrink-0">
            <Image
              src="/freshcart-logo.svg"
              alt="FreshCart"
              width={160}
              height={31}
              priority
              className="h-6 w-auto lg:h-8"
            />
          </Link>

          <form className="hidden max-w-2xl flex-1 lg:flex" action="/products">
            <div className="relative w-full">
              <input
                type="search"
                name="keyword"
                placeholder="Search for products, brands and more..."
                className="w-full rounded-full border border-gray-200 bg-gray-50/50 px-5 py-3 pr-12 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700"
              >
                <FaMagnifyingGlass />
              </button>
            </div>
          </form>

          <nav className="hidden items-center gap-6 xl:flex">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary-600 ${l.active ? "text-primary-600" : "text-gray-700"}`}
              >
                {l.label}
                {l.dropdown && <FaChevronDown className="text-xs" />}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/contact" className="hidden items-center gap-2 xl:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <FaHeadset />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-medium text-gray-700">Support</span>
                <span className="block text-xs text-gray-400">24/7 Help</span>
              </span>
            </Link>
            <Link
              href="/wishlist"
              title="Wishlist"
              className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100"
            >
              <FaRegHeart className="text-xl text-gray-500 transition-colors group-hover:text-primary-600" />
              {counts.wishlist > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                  {counts.wishlist}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              title="Cart"
              className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100"
            >
              <FaCartShopping className="text-xl text-gray-500 transition-colors group-hover:text-primary-600" />
              {counts.cart > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                  {counts.cart}
                </span>
              )}
            </Link>
            {user ? (
              <Link
                href="/profile/addresses"
                title={user.name ?? "Account"}
                className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100"
              >
                <FaRegUser className="text-xl text-gray-500 transition-colors group-hover:text-primary-600" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="ml-2 hidden items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700 lg:flex"
              >
                <FaRegUser /> Sign In
              </Link>
            )}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
