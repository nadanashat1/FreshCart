"use client";

import Link from "next/link";
import { Fa7Heart, Fa7Cart } from "@/components/icons/fa7";
import { useGuestCartCount, useGuestWishlistCount } from "@/components/guest/use-guest-store";

// Wishlist + cart icons with badges. Signed in: counts come from the server
// header (refreshed via router.refresh after mutations). Guest: counts come
// from the local guest store and update instantly.
export default function NavActions({
  isAuth,
  cartCount,
  wishlistCount,
}: {
  isAuth: boolean;
  cartCount: number;
  wishlistCount: number;
}) {
  const guestCart = useGuestCartCount();
  const guestWishlist = useGuestWishlistCount();
  const cart = isAuth ? cartCount : guestCart;
  const wishlist = isAuth ? wishlistCount : guestWishlist;

  return (
    <>
      <Link
        href="/wishlist"
        title="Wishlist"
        className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100"
      >
        <Fa7Heart className="text-xl text-gray-600 transition-colors group-hover:text-primary-600" />
        {wishlist !== null && wishlist > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
            {wishlist}
          </span>
        )}
      </Link>
      <Link
        href="/cart"
        title="Cart"
        className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100"
      >
        <Fa7Cart className="text-xl text-gray-600 transition-colors group-hover:text-primary-600" />
        {cart !== null && cart > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[11px] font-bold text-white">
            {cart}
          </span>
        )}
      </Link>
    </>
  );
}
