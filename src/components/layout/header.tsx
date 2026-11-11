import Image from "next/image";
import Link from "next/link";
import { FaMagnifyingGlass, FaHeadset, FaChevronDown, FaRegUser } from "react-icons/fa6";
import MobileMenu from "./mobile-menu";
import NavActions from "./nav-actions";
import { getSessionUser, getApiToken } from "@/lib/get-token";

const categoryLinks = [
  { id: "6439d58a0049ad0b52b9003f", label: "Electronics" },
  { id: "6439d5b90049ad0b52b90048", label: "Women's Fashion" },
  { id: "6439d2d167d9aa4ca970649f", label: "Men's Fashion" },
  { id: "6439d40367d9aa4ca97064a8", label: "Beauty & Health" },
];

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
            {navLinks.map((l) =>
              l.dropdown ? (
                <div key={l.label} className="group relative">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
                  >
                    {l.label}
                    <FaChevronDown className="text-[10px] transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute left-0 top-full pt-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[200px] rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                      <Link
                        href="/categories"
                        className="block px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
                      >
                        All Categories
                      </Link>
                      {categoryLinks.map((c) => (
                        <Link
                          key={c.id}
                          href={`/products?category=${c.id}`}
                          className="block px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary-600 ${l.active ? "text-primary-600" : "text-gray-700"}`}
                >
                  {l.label}
                </Link>
              )
            )}
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
            <NavActions isAuth={!!user} cartCount={counts.cart} wishlistCount={counts.wishlist} />
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
