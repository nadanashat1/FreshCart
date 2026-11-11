"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  FaRegUser,
  FaBoxOpen,
  FaRegHeart,
  FaRegAddressBook,
  FaGear,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import { Fa7CircleUser, Fa7User, Fa7BoxOpen, Fa7Heart, Fa7AddressBook, Fa7Gear, Fa7SignOut } from "@/components/icons/fa7";

const itemCls =
  "flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600";
const iconCls = "w-4 text-gray-400";

export default function AccountMenu({ name, email }: { name?: string | null; email?: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div
      ref={ref}
      className="group relative hidden lg:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="Account"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-2.5 transition-colors hover:bg-gray-100"
      >
        <Fa7CircleUser className="text-xl text-gray-600 transition-colors group-hover:text-primary-600" />
      </button>
      <div
        className={`absolute right-0 top-full mt-2 w-64 rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-200 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
              <Fa7User className="text-primary-600" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">{name}</p>
              <p className="truncate text-xs text-gray-400">{email}</p>
            </div>
          </div>
        </div>
        <div className="py-2">
          <Link href="/profile" className={itemCls} onClick={() => setOpen(false)}>
            <Fa7User className={iconCls} /> My Profile
          </Link>
          <Link href="/orders" className={itemCls} onClick={() => setOpen(false)}>
            <Fa7BoxOpen className={iconCls} /> My Orders
          </Link>
          <Link href="/wishlist" className={itemCls} onClick={() => setOpen(false)}>
            <Fa7Heart className={iconCls} /> My Wishlist
          </Link>
          <Link href="/profile/addresses" className={itemCls} onClick={() => setOpen(false)}>
            <Fa7AddressBook className={iconCls} /> Addresses
          </Link>
          <Link href="/profile/settings" className={itemCls} onClick={() => setOpen(false)}>
            <Fa7Gear className={iconCls} /> Settings
          </Link>
        </div>
        <div className="border-t border-gray-100 py-2">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
          >
            <Fa7SignOut /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
