"use client";

import { useState } from "react";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaLocationDot,
  FaPhone,
  FaCity,
  FaBookmark,
  FaCheck,
  FaShieldHalved,
  FaTruckFast,
  FaCircleInfo,
  FaBagShopping,
  FaHouse,
  FaArrowRotateLeft,
  FaPlus,
} from "react-icons/fa6";
import { Fa7Box, Fa7Shield, Fa7Truck, Fa7Bag, Fa7CreditCard, Fa7MoneyBill, Fa7LocationDot, Fa7Phone, Fa7City, Fa7Bookmark, Fa7Check, Fa7CircleInfo, Fa7House, Fa7Plus, Fa7Receipt, Fa7ArrowLeft } from "@/components/icons/fa7";
import { placeOrder } from "./actions";

type CartItem = {
  _id: string;
  count: number;
  price: number;
  product: { _id: string; title: string; imageCover: string };
};
type Address = { _id: string; name: string; details: string; phone: string; city: string };

const EGYPT_PHONE = /^01[0125][0-9]{8}$/;

const fieldCls =
  "w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 pl-14 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100";

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
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [newAddr, setNewAddr] = useState({ city: "", details: "", phone: "" });
  const [fieldErrors, setFieldErrors] = useState<{ city?: string; details?: string; phone?: string }>({});
  const [method, setMethod] = useState<"cash" | "card">("cash");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = liveEnabled && !busy;
  const shippingFee = total >= 500 ? 0 : 50;

  async function submit() {
    if (busy || !liveEnabled) return;

    const errs: typeof fieldErrors = {};
    if (!newAddr.city.trim()) errs.city = "City is required";
    if (!newAddr.details.trim()) errs.details = "Street address is required";
    if (!newAddr.phone.trim()) errs.phone = "Phone number is required";
    else if (!EGYPT_PHONE.test(newAddr.phone.trim()))
      errs.phone = "Please enter a valid Egyptian phone number";
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const shippingAddress = {
      city: newAddr.city.trim(),
      details: newAddr.details.trim(),
      phone: newAddr.phone.trim(),
    };

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


  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Fa7House /> Shipping Address
            </h2>
            <p className="mt-1 text-sm text-primary-100">Where should we deliver your order?</p>
          </div>
          <div className="space-y-5 p-6">
            {addresses.length > 0 && (
              <div className="border-b border-gray-100 pb-5">
                <div className="mb-3 flex items-center gap-2">
                  <Fa7Bookmark className="text-primary-600" />
                  <span className="font-semibold text-gray-800">Saved Addresses</span>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-600">
                    Select a saved address or enter a new one below
                  </p>
                  {addresses.map((a) => {
                    const selected = !useNewAddress && addressId === a._id;
                    return (
                      <button
                        type="button"
                        key={a._id}
                        onClick={() => {
                          setAddressId(a._id);
                          setUseNewAddress(false);
                          setNewAddr({ city: a.city, details: a.details, phone: a.phone });
                          setFieldErrors({});
                        }}
                        className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                          selected
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-primary-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                              selected ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {selected ? <Fa7Check /> : <Fa7LocationDot />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`font-semibold ${selected ? "text-primary-700" : "text-gray-900"}`}>{a.name}</p>
                            <p className="mt-0.5 text-sm text-gray-600">
                              {a.details}
                            </p>
                            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Fa7Phone /> {a.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Fa7City /> {a.city}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setUseNewAddress(true);
                      setNewAddr({ city: "", details: "", phone: "" });
                      setFieldErrors({});
                    }}
                    className={`w-full rounded-xl border-2 border-dashed p-4 text-left transition-all duration-200 ${
                      useNewAddress
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-primary-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          useNewAddress ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Fa7Plus />
                      </div>
                      <div>
                        <p className={`font-semibold ${useNewAddress ? "text-primary-700" : "text-gray-900"}`}>
                          Use a different address
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">Enter a new shipping address manually</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {true && (
              <>
                <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Fa7CircleInfo className="text-sm text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Delivery Information</p>
                    <p className="mt-0.5 text-xs text-blue-600">
                      {useNewAddress || addresses.length === 0
                        ? "Please ensure your address is accurate for smooth delivery"
                        : "Using your saved address. You can edit the details below if needed."}
                    </p>
                  </div>
                </div>
                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-semibold text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-gray-100">
                      <Fa7City className="text-gray-500" />
                    </div>
                    <input
                      id="city"
                      type="text"
                      placeholder="e.g. Cairo, Alexandria, Giza"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))}
                      className={fieldCls}
                    />
                  </div>
                  {fieldErrors.city && <p className="mt-1 text-xs text-red-600">{fieldErrors.city}</p>}
                </div>
                <div>
                  <label htmlFor="details" className="mb-2 block text-sm font-semibold text-gray-700">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                      <Fa7LocationDot className="text-gray-500" />
                    </div>
                    <textarea
                      id="details"
                      rows={3}
                      placeholder="Street name, building number, floor, apartment..."
                      value={newAddr.details}
                      onChange={(e) => setNewAddr((a) => ({ ...a, details: e.target.value }))}
                      className={`${fieldCls} resize-none`}
                    />
                  </div>
                  {fieldErrors.details && <p className="mt-1 text-xs text-red-600">{fieldErrors.details}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-gray-100">
                      <Fa7Phone className="text-gray-500" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr((a) => ({ ...a, phone: e.target.value }))}
                      className={fieldCls}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      Egyptian numbers only
                    </span>
                  </div>
                  {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Fa7CreditCard /> Payment Method
            </h2>
            <p className="mt-1 text-sm text-primary-100">Choose how you&apos;d like to pay</p>
          </div>
          <div className="space-y-4 p-6">
            <button
              type="button"
              onClick={() => setMethod("cash")}
              className={`group flex w-full items-center gap-4 rounded-xl border-2 p-5 transition-all ${
                method === "cash"
                  ? "border-primary-500 bg-gradient-to-r from-primary-50 to-emerald-50 shadow-sm"
                  : "border-gray-200 hover:border-primary-200 hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all ${
                  method === "cash"
                    ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                    : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                }`}
              >
                <Fa7MoneyBill className="text-2xl" />
              </div>
              <div className="flex-1 text-left">
                <h3 className={`font-bold ${method === "cash" ? "text-primary-700" : "text-gray-900"}`}>
                  Cash on Delivery
                </h3>
                <p className="mt-0.5 text-sm text-gray-500">Pay when your order arrives at your doorstep</p>
              </div>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                  method === "cash" ? "bg-primary-600 text-white" : "border-2 border-gray-200"
                }`}
              >
                {method === "cash" && <Fa7Check className="text-xs" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => liveEnabled && setMethod("card")}
              disabled={!liveEnabled}
              title={liveEnabled ? undefined : "Online payment is not available in this build"}
              className={`group flex w-full items-center gap-4 rounded-xl border-2 p-5 transition-all ${
                !liveEnabled ? "cursor-not-allowed opacity-60" : ""
              } ${
                method === "card" && liveEnabled
                  ? "border-primary-500 bg-gradient-to-r from-primary-50 to-emerald-50 shadow-sm"
                  : "border-gray-200 hover:border-primary-200 hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all ${
                  method === "card" && liveEnabled
                    ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                    : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                }`}
              >
                <Fa7CreditCard className="text-2xl" />
              </div>
              <div className="flex-1 text-left">
                <h3 className={`font-bold ${method === "card" && liveEnabled ? "text-primary-700" : "text-gray-900"}`}>
                  Pay Online
                </h3>
                <p className="mt-0.5 text-sm text-gray-500">Secure payment with Credit/Debit Card via Stripe</p>
                {!liveEnabled && <p className="mt-1 text-xs text-gray-400">Not available in this build</p>}
              </div>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                  method === "card" && liveEnabled ? "bg-primary-600 text-white" : "border-2 border-gray-200"
                }`}
              >
                {method === "card" && liveEnabled && <Fa7Check className="text-xs" />}
              </div>
            </button>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                <FaShieldHalved className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Secure &amp; Encrypted</p>
                <p className="mt-0.5 text-xs text-green-600">
                  Your payment info is protected with 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Fa7Bag /> Order Summary
            </h2>
            <p className="mt-1 text-sm text-primary-100">{items.length} {items.length === 1 ? "item" : "items"}</p>
          </div>
          <div className="p-5">
            <div className="mb-5 max-h-56 space-y-3 overflow-y-auto pr-1">
              {items.map((it) => (
                <div
                  key={it._id}
                  className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                >
                  <div className="h-14 w-14 shrink-0 rounded-lg border border-gray-100 bg-white p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.product.imageCover}
                      alt={it.product.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{it.product.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {it.count} × {it.price} EGP
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-gray-900">
                    {(it.price * it.count).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <hr className="my-4 border-gray-100" />
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{total.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  <FaTruckFast /> Shipping
                </span>
                {shippingFee === 0 ? (
                  <span className="font-semibold text-green-600">FREE</span>
                ) : (
                  <span className="font-medium">{shippingFee} EGP</span>
                )}
              </div>
              <hr className="border-gray-100" />
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary-600">{(total + shippingFee).toLocaleString()}</span>
                  <span className="ml-1 text-sm text-gray-500">EGP</span>
                </div>
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
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 py-4 font-bold text-white shadow-lg shadow-primary-600/20 transition-all hover:from-primary-700 hover:to-primary-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Fa7Box /> {busy ? "Placing Order..." : "Place Order"}
            </button>
            {error && <p className="mt-3 text-center text-xs text-red-600">{error}</p>}
            {!liveEnabled && (
              <p className="mt-3 text-center text-xs text-amber-600">
                Ordering is disabled in this build: this review page never submits a live order or payment.
              </p>
            )}
            <div className="mt-4 flex items-center justify-center gap-4 border-t border-gray-100 py-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Fa7Shield className="text-green-500" /> <span>Secure</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Fa7Truck className="text-blue-600" /> <span>Fast Delivery</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Fa7Box className="text-orange-500" /> <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
