import Link from "next/link";
import { FaUserPlus } from "react-icons/fa6";
import { Fa7Truck, Fa7Gift, Fa7Phone, Fa7Envelope, Fa7User } from "@/components/icons/fa7";
import { getSessionUser } from "@/lib/get-token";
import SignOutButton from "./sign-out-button";

export default async function TopBar() {
  const user = await getSessionUser();
  return (
    <div className="hidden border-b border-gray-100 text-sm lg:block">
      <div className="container mx-auto px-4">
        <div className="flex h-10 items-center justify-between">
          <div className="flex items-center gap-6 text-gray-600">
            <span className="flex items-center gap-2">
              <Fa7Truck className="text-xs text-green-600" />
              Free Shipping on Orders 500 EGP
            </span>
            <span className="flex items-center gap-2">
              <Fa7Gift className="text-xs text-green-600" />
              New Arrivals Daily
            </span>
          </div>
          <div className="flex items-center gap-6 text-gray-600">
            <a href="tel:+18001234567" className="flex items-center gap-2 hover:text-primary-600">
              <Fa7Phone className="text-xs text-gray-600" /> +1 (800) 123-4567
            </a>
            <a href="mailto:support@freshcart.com" className="flex items-center gap-2 hover:text-primary-600">
              <Fa7Envelope className="text-xs text-gray-600" /> support@freshcart.com
            </a>
            <span className="h-4 w-px bg-gray-200" />
            {user ? (
              <>
                <span className="flex items-center gap-2 text-gray-700">
                  <Fa7User className="text-xs text-gray-700" /> {user.name}
                </span>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-2 hover:text-primary-600">
                  <Fa7User className="text-xs" /> Sign In
                </Link>
                <Link href="/register" className="flex items-center gap-2 hover:text-primary-600">
                  <FaUserPlus /> Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
