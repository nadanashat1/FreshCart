"use client";

import { useState } from "react";
import { FaCreditCard, FaMoneyBillWave, FaLock, FaLocationDot } from "react-icons/fa6";
import { placeOrder } from "./actions";

type CartItem = {
  _id: string;
  count: number;
  price: number;
  product: { _id: string; title: string; imageCover: string };
};
type Address = { _id: string; name: string; details: string; phone: string; city: string };

const EGYPT_PHONE = /^01[0125][0-9]{8}$/;

export default function CheckoutForm({
  items,
  total,
  addresses,
  liveEnabled,
}: {
  items: CartItem[];
  total: number;
  addresses: Address[];
  liveEnabled: boolean;
}) {
  const [addressId, setAddressId] = useState<string | null>(addresses[0]?._id ?? null);
  const [useNewAddress, setUseNewAddress] = useState(addresses.length === 0);
  const [newAddr, setNewAddr] = useState({ city: "", details: "", phone: "" });
  const [fieldErrors, setFieldErrors] = useState<{ city?: string; details?: string; phone?: string }>({});
  const [method, setMethod] = useState<"cash" | "card">("cash");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = liveEnabled && !busy && (useNewAddress || !!addressId);

  async function submit() {
    if (busy || !liveEnabled) return;

    let shippingAddress: { details: string; phone: string; city: string } | null = null;

    if (useNewAddress) {
      const errs: typeof fieldErrors = {};
      if (!newAddr.city.trim()) errs.city = "City is required";
      if (!newAddr.details.trim()) errs.details = "Street address is required";
      if (!newAddr.phone.trim()) errs.phone = "Phone number is required";
      else if (!EGYPT_PHONE.test(newAddr.phone.trim()))
        errs.phone = "Please enter a valid Egyptian phone number";
      setFieldErrors(errs);
      if (Object.keys(errs).length > 0) return;
      shippingAddress = {
        city: newAddr.city.trim(),
        details: newAddr.details.trim(),
        phone: newAddr.phone.trim(),
      };
    } else {
      const addr = addresses.find((a) => a._id === addressId);
      if (!addr) return;
      shippingAddress = { details: addr.details, phone: addr.phone, city: addr.city };
    }

    setBusy(true);
    setError(null);
    const result = await placeOrder({ shippingAddress, method });
    if (result.ok) {
      window.location.href = result.redirect;
      return;
    }
    setError(result.error);
    setBusy(false);
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-gray-900">
            <FaLocationDot className="text-primary-600" /> Shipping Address
          </h2>
          <p className="mb-4 text-sm text-gray-500">Where should we deliver your order?</p>

          {addresses.length > 0 && (
            <>
              <p className="mb-2 text-sm font-semibold text-gray-700">Saved Addresses</p>
              <div className="space-y-3">
                {addresses.map((a) => (
                  <label
                    key={a._id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:border-primary-300 ${
                      !useNewAddress && addressId === a._id ? "border-primary-500 bg-primary-50/50" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={!useNewAddress && addressId === a._id}
                      onChange={() => {
                        setAddressId(a._id);
                        setUseNewAddress(false);
                      }}
                      className="mt-1 accent-primary-600"
                    />
                    <span>
                      <span className="font-semibold text-gray-900">{a.name}</span>
                      <span className="block text-sm text-gray-600">{a.details}, {a.city}</span>
                      <span className="block text-sm text-gray-500">{a.phone}</span>
                    </span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setUseNewAddress((v) => !v)}
                className={`mt-3 w-full rounded-lg border-2 border-dashed p-3 text-left text-sm font-medium transition ${
                  useNewAddress
                    ? "border-primary-400 bg-primary-50/50 text-primary-700"
                    : "border-gray-300 text-gray-600 hover:border-primary-300 hover:text-primary-600"
                }`}
              >
                Use a different address
                <span className="block text-xs font-normal text-gray-500">
                  Enter a new shipping address manually
                </span>
              </button>
            </>
          )}

          {(useNewAddress || addresses.length === 0) && (
            <div className={addresses.length > 0 ? "mt-4" : ""}>
              {addresses.length === 0 && (
                <p className="mb-3 text-sm text-gray-500">
                  No saved addresses yet - enter your shipping address below.
                </p>
              )}
              <p className="mb-3 text-xs text-gray-400">
                Please ensure your address is accurate for smooth delivery
              </p>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="City *"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))}
                    className={inputClass}
                  />
                  {fieldErrors.city && <p className="mt-1 text-xs text-red-600">{fieldErrors.city}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Street Address *"
                    value={newAddr.details}
                    onChange={(e) => setNewAddr((a) => ({ ...a, details: e.target.value }))}
                    className={inputClass}
                  />
                  {fieldErrors.details && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.details}</p>
                  )}
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr((a) => ({ ...a, phone: e.target.value }))}
                    className={inputClass}
                  />
                  {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
            <FaCreditCard className="text-primary-600" /> Payment Method
          </h2>
          <div className="space-y-3">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition hover:border-primary-300 ${
                method === "cash" ? "border-primary-500 bg-primary-50/50" : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={method === "cash"}
                onChange={() => setMethod("cash")}
                className="accent-primary-600"
              />
              <FaMoneyBillWave className="text-primary-600" />
              <span>
                <span className="block font-medium text-gray-900">Cash on Delivery</span>
                <span className="block text-xs text-gray-500">
                  Pay when your order arrives at your doorstep
                </span>
              </span>
            </label>
            <label
              className={`flex items-center gap-3 rounded-lg border p-4 ${
                liveEnabled ? "cursor-pointer transition hover:border-primary-300" : "cursor-not-allowed opacity-60"
              } ${method === "card" && liveEnabled ? "border-primary-500 bg-primary-50/50" : "border-gray-200"}`}
              title={liveEnabled ? undefined : "Online payment is not available in this build"}
            >
              <input
                type="radio"
                name="payment"
                disabled={!liveEnabled}
                checked={method === "card"}
                onChange={() => setMethod("card")}
                className="accent-primary-600"
              />
              <FaCreditCard />
              <span className="font-medium text-gray-900">Pay Online</span>
              {!liveEnabled && <span className="ml-auto text-xs text-gray-400">Not available in this build</span>}
            </label>
            <p className="text-xs text-gray-400">
              Your payment info is protected with 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h2>
          <div className="mb-4 space-y-3">
            {items.map((it) => (
              <div key={it._id} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.product.imageCover} alt={it.product.title} className="h-12 w-12 rounded-lg object-contain" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{it.product.title}</p>
                  <p className="text-xs text-gray-500">Qty {it.count}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">{(it.price * it.count).toLocaleString()} EGP</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{total.toLocaleString()} EGP</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-primary-600">FREE</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
              <span>Total</span>
              <span className="text-primary-600">{total.toLocaleString()} EGP</span>
            </div>
          </div>
          <button
            onClick={submit}
            disabled={!canSubmit}
            title={
              liveEnabled
                ? useNewAddress || addressId
                  ? "Place this order"
                  : "Select a shipping address first"
                : "Ordering is intentionally disabled in this build - no live orders are placed"
            }
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-medium text-white transition ${
              canSubmit ? "bg-gray-900 hover:bg-gray-800" : "cursor-not-allowed bg-gray-900 opacity-60"
            }`}
          >
            <FaLock /> {busy ? "Placing Order..." : "Place Order"}
          </button>
          {error && <p className="mt-3 text-center text-xs text-red-600">{error}</p>}
          {!liveEnabled && (
            <p className="mt-3 text-center text-xs text-amber-600">
              Ordering is disabled in this build: this review page never submits a live order or payment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
