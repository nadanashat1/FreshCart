"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FaLock, FaEye, FaEyeSlash, FaGoogle,
  FaTruck, FaShieldHalved, FaClock,
} from "react-icons/fa6";

export default function LinkForm({ email, name }: { email: string; name: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    let res: Response | null = null;
    try {
      res = await fetch("/api/auth/link-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
    } catch {
      res = null;
    }
    setLoading(false);
    setPassword("");
    if (res?.ok) {
      router.push("/");
      router.refresh();
    } else if (res?.status === 401) {
      setError("Incorrect password for this account. Please try again.");
    } else {
      setError("We could not complete the link right now. Please try again.");
    }
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="space-y-6 text-center">
              <Image
                src="/auth-side.png"
                alt="fresh vegetables and fruits shopping cart illustration"
                width={600}
                height={384}
                className="h-96 w-full rounded-2xl object-cover shadow-lg"
              />
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  FreshCart - Your One-Stop Shop for Fresh Products
                </h2>
                <p className="text-lg text-gray-600">
                  Join thousands of happy customers who trust FreshCart for their daily grocery needs
                </p>
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center"><FaTruck className="mr-2 text-primary-600" />Free Delivery</div>
                  <div className="flex items-center"><FaShieldHalved className="mr-2 text-primary-600" />Secure Payment</div>
                  <div className="flex items-center"><FaClock className="mr-2 text-primary-600" />24/7 Support</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="rounded-2xl bg-white p-8 shadow-xl lg:p-12">
              <div className="mb-8 text-center">
                <div className="mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-600">
                    Fresh<span className="text-gray-800">Cart</span>
                  </span>
                </div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                  <FaGoogle className="text-xl text-red-500" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-800">Link Your Account</h1>
                <p className="text-gray-600">
                  {name ? `Welcome, ${name}! ` : ""}The email{" "}
                  <span className="font-medium text-gray-800">{email}</span>{" "}
                  already has a FreshCart account protected by a password. Enter
                  that account&apos;s password once to link it to your social
                  sign-in. We never store this password.
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label htmlFor="link-password" className="mb-2 block text-sm font-medium text-gray-700">
                    Account Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="link-password"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="Enter the account password"
                      className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-12 outline-none transition focus:border-primary-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary-600 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
                >
                  {loading ? "Linking..." : "Link Account & Continue"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Not your account?{" "}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="font-medium text-primary-600 transition hover:text-primary-700"
                >
                  Sign out and use a different one
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
