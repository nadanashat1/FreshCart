"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerUser } from "./actions";
import {
  FaStar,
  FaTruckFast,
  FaShieldHalved,
  FaGoogle,
  FaFacebookF,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";

const features = [
  { icon: FaStar, title: "Premium Quality", text: "Premium quality products sourced from trusted suppliers." },
  { icon: FaTruckFast, title: "Fast Delivery", text: "Same-day delivery available in most areas." },
  { icon: FaShieldHalved, title: "Secure Shopping", text: "Your data and payments are completely secure." },
];

function passwordStrength(pw: string): { label: string; width: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length === 0) return { label: "Weak", width: "0%", color: "bg-gray-200" };
  if (score <= 1) return { label: "Weak", width: "33%", color: "bg-red-500" };
  if (score === 2) return { label: "Medium", width: "66%", color: "bg-yellow-500" };
  return { label: "Strong", width: "100%", color: "bg-primary-500" };
}

export default function RegisterPage() {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", phone: "", password: "", rePassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const strength = passwordStrength(values.password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (values.password !== values.rePassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agree) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setLoading(true);
    const res = await registerUser(values);
    if (!res.ok) {
      setLoading(false);
      setError(res.error ?? "Registration failed.");
      return;
    }
    const login = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setLoading(false);
    if (login?.ok) {
      router.push("/");
      router.refresh();
    } else {
      router.push("/login");
    }
  }

  const inputCls =
    "w-full rounded-lg border border-gray-200 px-4 py-3 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100";

  return (
    <div className="bg-white px-4 py-12 sm:py-16">
      <div className="container mx-auto grid items-center gap-12 lg:grid-cols-2">
        {/* Left: welcome panel */}
        <div className="hidden lg:block">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Welcome to <span className="text-primary-600">FreshCart</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Join thousands of happy customers who enjoy fresh groceries delivered right to their doorstep.
          </p>
          <div className="mt-8 space-y-6">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <Icon />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 max-w-md rounded-2xl bg-gray-50 p-6">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.pravatar.cc/80?img=47"
                alt="Sarah Johnson"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">Sarah Johnson</p>
                <div className="flex gap-0.5 text-sm text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm italic text-gray-600">
              &ldquo;FreshCart has transformed my shopping experience. The quality of the products is outstanding, and the
              delivery is always on time. Highly recommend!&rdquo;
            </p>
          </div>
        </div>

        {/* Right: form card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
            <p className="mt-1 text-gray-500">Start your fresh journey with us today</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <FaGoogle className="text-[#ea4335]" /> Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <FaFacebookF className="text-[#1877f2]" /> Facebook
            </button>
          </div>

          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                id="name" name="name" type="text" required autoComplete="name"
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                placeholder="Ali" className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                id="email" name="email" type="email" required autoComplete="email"
                value={values.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                placeholder="ali@example.com" className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password" name="password" type={showPw ? "text" : "password"} required autoComplete="new-password"
                  value={values.password}
                  onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                  placeholder="create a strong password" className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-1 flex-1 rounded-full bg-gray-200">
                  <div className={`h-1 rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                </div>
                <span className="text-xs text-gray-400">{strength.label}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">Must be at least 8 characters with numbers and symbols</p>
            </div>
            <div>
              <label htmlFor="rePassword" className="mb-1.5 block text-sm font-medium text-gray-700">
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <input
                id="rePassword" name="rePassword" type="password" required autoComplete="new-password"
                value={values.rePassword}
                onChange={(e) => setValues((v) => ({ ...v, rePassword: e.target.value }))}
                placeholder="confirm your password" className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone Number<span className="text-red-500">*</span>
              </label>
              <input
                id="phone" name="phone" type="tel" required autoComplete="tel"
                value={values.phone}
                onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
                placeholder="+1 234 567 8900" className={inputCls}
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-primary-600"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="font-medium text-primary-600 hover:text-primary-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
                <span className="text-red-500"> *</span>
              </span>
            </label>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
            >
              <FaUserPlus />
              {loading ? "Creating account..." : "Create My Account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
