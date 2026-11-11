"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrashCan, FaLocationDot, FaXmark } from "react-icons/fa6";
import { addAddress, removeAddress } from "./actions";

type Address = { _id: string; name: string; details: string; phone: string; city: string };

export default function AddressManager({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", details: "", phone: "", city: "" });

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await addAddress(form);
    setBusy(false);
    if (res.needAuth) {
      router.push("/login");
      return;
    }
    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setForm({ name: "", details: "", phone: "", city: "" });
    setShowForm(false);
    router.refresh();
  }

  async function onRemove(id: string) {
    setError(null);
    setBusy(true);
    const res = await removeAddress(id);
    setBusy(false);
    if (res.needAuth) {
      router.push("/login");
      return;
    }
    if (!res.ok) setError(res.error ?? "Something went wrong.");
    router.refresh();
  }

  return (
    <div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      {addresses.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a._id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-start justify-between">
                <span className="flex items-center gap-2 font-semibold text-gray-900">
                  <FaLocationDot className="text-primary-600" /> {a.name}
                </span>
                <button
                  onClick={() => onRemove(a._id)}
                  disabled={busy}
                  aria-label={`Remove address ${a.name}`}
                  className="p-1.5 text-gray-400 transition hover:text-red-500 disabled:opacity-50"
                >
                  <FaTrashCan />
                </button>
              </div>
              <p className="text-sm text-gray-600">{a.details}</p>
              <p className="text-sm text-gray-600">{a.city}</p>
              <p className="mt-1 text-sm text-gray-500">{a.phone}</p>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <form onSubmit={onAdd} className="max-w-lg rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">New Address</h2>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="text-gray-400 hover:text-gray-600">
              <FaXmark />
            </button>
          </div>
          <div className="space-y-3">
            <input
              required
              placeholder="Address name (e.g. Home, Work)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none"
            />
            <textarea
              required
              placeholder="Street, building, apartment..."
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none"
            />
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none"
            />
            <input
              required
              placeholder="Phone (e.g. 01012345678)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-4 w-full rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            {busy ? "Saving..." : "Save Address"}
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
        >
          <FaPlus /> {addresses.length === 0 ? "Add Your First Address" : "Add Address"}
        </button>
      )}
    </div>
  );
}
