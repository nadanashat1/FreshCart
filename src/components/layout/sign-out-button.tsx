"use client";

import { signOut } from "next-auth/react";
import { FaArrowRightFromBracket } from "react-icons/fa6";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 hover:text-primary-600"
    >
      <FaArrowRightFromBracket /> Sign Out
    </button>
  );
}
