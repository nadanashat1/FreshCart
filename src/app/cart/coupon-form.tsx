"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTag, FaSpinner, FaCircleCheck } from "react-icons/fa6";
import { applyCoupon } from "./actions";

export default function CouponForm({ applied }: { applied: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justApplied, setJustApplied] = useState(false);

  async function submit() {
    const couponName = code.trim();
    if (!couponName) {
      setError("Enter a coupon code first.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await applyCoupon(couponName);
    setBusy(false);
    if (res.needAuth) {
      router.push("/login");
      return;
    }
    if (!res.ok) {
      setError(res.error ?? "Could not apply that coupon.");
      return;
    }
    setJustApplied(true);
    setOpen(false);
    setCode("");
    router.refresh();
  }

  return (
    <div className="w-full">
      {(applied || justApplied) && (
        <p className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-green-600">
          <FaCircleCheck /> Coupon applied to your cart
        </p>
      )}
      {open ? (
        <div>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="Coupon code"
              autoFocus
              className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
            >
              {busy && <FaSpinner className="animate-spin" />}
              Apply
            </button>
          </div>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
            className="mt-2 w-full text-center text-xs font-medium text-gray-400 transition hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-gray-600 transition-all hover:border-primary-400 hover:bg-primary-50/50 hover:text-primary-600"
        >
          <FaTag />
          <span className="text-sm font-medium">
            {applied ? "Apply a Different Code" : "Apply Promo Code"}
          </span>
        </button>
      )}
    </div>
  );
}
