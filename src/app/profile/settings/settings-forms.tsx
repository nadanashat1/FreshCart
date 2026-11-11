"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaFloppyDisk, FaLock, FaUser } from "react-icons/fa6";
import { changePassword, updateProfile } from "./actions";

const inputCls =
  "w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";
const pwCls =
  "w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";

export default function SettingsForms({
  initialName,
  initialEmail,
  userId,
  role,
}: {
  initialName: string;
  initialEmail: string;
  userId: string;
  role: string;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState({ name: initialName, email: initialEmail, phone: "" });
  const [pBusy, setPBusy] = useState(false);
  const [pMsg, setPMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [pw, setPw] = useState({ currentPassword: "", password: "", rePassword: "" });
  const [show, setShow] = useState({ cur: false, next: false, conf: false });
  const [wBusy, setWBusy] = useState(false);
  const [wMsg, setWMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onProfile(e: React.FormEvent) {
    e.preventDefault();
    setPMsg(null);
    setPBusy(true);
    const res = await updateProfile(profile);
    setPBusy(false);
    if (res.needAuth) {
      router.push("/login");
      return;
    }
    setPMsg(res.ok ? { ok: true, text: "Profile updated." } : { ok: false, text: res.error ?? "Failed." });
  }

  async function onPassword(e: React.FormEvent) {
    e.preventDefault();
    setWMsg(null);
    setWBusy(true);
    const res = await changePassword(pw);
    setWBusy(false);
    if (res.needAuth) {
      router.push("/login");
      return;
    }
    if (res.ok) setPw({ currentPassword: "", password: "", rePassword: "" });
    setWMsg(res.ok ? { ok: true, text: "Password changed. You may be asked to sign in again." } : { ok: false, text: res.error ?? "Failed." });
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
              <FaUser className="text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Profile Information</h3>
              <p className="text-sm text-gray-500">Update your personal details</p>
            </div>
          </div>
          <form className="space-y-5" onSubmit={onProfile}>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
              <input
                placeholder="Enter your name"
                className={inputCls}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
              <input
                placeholder="Enter your email"
                type="email"
                className={inputCls}
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                placeholder="01xxxxxxxxx"
                className={inputCls}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            {pMsg && (
              <p className={`text-sm ${pMsg.ok ? "text-green-600" : "text-red-600"}`}>{pMsg.text}</p>
            )}
            <div className="pt-4">
              <button
                type="submit"
                disabled={pBusy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition-colors hover:bg-primary-700 disabled:opacity-50"
              >
                <FaFloppyDisk /> {pBusy ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-gray-50 p-6 sm:p-8">
          <h3 className="mb-4 font-bold text-gray-900">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">User ID</span>
              <span className="font-mono text-gray-700">{userId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Role</span>
              <span className="rounded-lg bg-primary-100 px-3 py-1 font-medium capitalize text-primary-700">
                {role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <FaLock className="text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </div>
          <form className="space-y-5" onSubmit={onPassword}>
            {(
              [
                ["cur", "Current Password", "Enter your current password", "currentPassword"],
                ["next", "New Password", "Enter your new password", "password"],
                ["conf", "Confirm New Password", "Confirm your new password", "rePassword"],
              ] as const
            ).map(([key, label, placeholder, field]) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
                <div className="relative">
                  <input
                    type={show[key] ? "text" : "password"}
                    placeholder={placeholder}
                    className={pwCls}
                    value={pw[field]}
                    onChange={(e) => setPw({ ...pw, [field]: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, [key]: !show[key] })}
                    aria-label={`Show ${label}`}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {show[key] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {key === "next" && (
                  <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                )}
              </div>
            ))}
            {wMsg && (
              <p className={`text-sm ${wMsg.ok ? "text-green-600" : "text-red-600"}`}>{wMsg.text}</p>
            )}
            <div className="pt-4">
              <button
                type="submit"
                disabled={wBusy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition-colors hover:bg-primary-700 disabled:opacity-50"
              >
                <FaLock /> {wBusy ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
