"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaCity,
  FaLocationDot,
  FaPen,
  FaPhone,
  FaPlus,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import { addAddress, removeAddress, updateAddress } from "./actions";

type Address = { _id: string; name: string; details: string; phone: string; city: string };

const emptyForm = { name: "", details: "", phone: "", city: "" };

export default function AddressManager({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError(null);
  }

  function openEdit(a: Address) {
    setEditingId(a._id);
    setForm({ name: a.name, details: a.details, phone: a.phone, city: a.city });
    setShowForm(true);
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = editingId ? await updateAddress(editingId, form) : await addAddress(form);
    setBusy(false);
    if (res.needAuth) {
      router.push("/login");
      return;
    }
    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setForm(emptyForm);
    setEditingId(null);
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your saved delivery addresses</p>
        </div>
        {!showForm && (
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-primary-600/25 transition-colors hover:bg-primary-700"
          >
            <FaPlus /> Add Address
          </button>
        )}
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      {addresses.length === 0 && !showForm && (
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white px-16 py-12 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <FaLocationDot className="text-3xl text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">No Addresses Yet</h3>
          <p className="mx-auto mb-6 max-w-sm text-gray-500">
            Add your first delivery address to make checkout faster and easier.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <span>+</span> Add Your First Address
          </button>
        </div>
      )}

      {addresses.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((a) => (
            <div
              key={a._id}
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-primary-100 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-1 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                    <FaLocationDot />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 font-bold text-gray-900">{a.name}</h3>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">{a.details}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <FaPhone className="text-xs" />
                        {a.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaCity className="text-xs" />
                        {a.city}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(a)}
                    title="Edit address"
                    aria-label={`Edit address ${a.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-primary-100 hover:text-primary-600"
                  >
                    <FaPen className="text-sm" />
                  </button>
                  <button
                    onClick={() => onRemove(a._id)}
                    disabled={busy}
                    title="Delete address"
                    aria-label={`Delete address ${a.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={onSubmit} className="max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">{editingId ? "Edit Address" : "New Address"}</h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(emptyForm);
              }}
              aria-label="Close form"
              className="text-gray-400 hover:text-gray-600"
            >
              <FaXmark />
            </button>
          </div>
          <div className="space-y-3">
            <input
              required
              placeholder="Address name (e.g. Home, Work)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none"
            />
            <textarea
              required
              placeholder="Street, building, apartment..."
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none"
            />
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none"
            />
            <input
              required
              placeholder="Phone (e.g. 01012345678)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            {busy ? "Saving..." : editingId ? "Save Changes" : "Save Address"}
          </button>
        </form>
      )}
    </div>
  );
}
