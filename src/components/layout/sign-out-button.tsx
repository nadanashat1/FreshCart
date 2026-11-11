"use client";

import { signOut } from "next-auth/react";
import { Fa7SignOut } from "@/components/icons/fa7";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 hover:text-primary-600"
    >
      <Fa7SignOut className="text-xs" /> Sign Out
    </button>
  );
}
