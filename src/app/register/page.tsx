"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerUser } from "./actions";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa6";

const fields = [
  { id: "name", label: "Full Name", type: "text", placeholder: "Enter your full name", icon: FaUser, autoComplete: "name" },
  { id: "email", label: "Email Address", type: "email", placeholder: "Enter your email", icon: FaEnvelope, autoComplete: "email" },
  { id: "phone", label: "Phone Number", type: "tel", placeholder: "Enter your phone number", icon: FaPhone, autoComplete: "tel" },
  { id: "password", label: "Password", type: "password", placeholder: "Create a password", icon: FaLock, autoComplete: "new-password" },
  { id: "rePassword", label: "Confirm Password", type: "password", placeholder: "Confirm your password", icon: FaLock, autoComplete: "new-password" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", phone: "", password: "", rePassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (values.password !== values.rePassword) {
      setError("Passwords do not match.");
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-xl lg:p-12">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-600">
                Fresh<span className="text-gray-800">Cart</span>
              </span>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-800">Create Your Account</h1>
            <p className="text-gray-600">Join FreshCart and start shopping fresh today</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            {fields.map(({ id, label, type, placeholder, icon: Icon, autoComplete }) => (
              <div key={id}>
                <label htmlFor={id} className="mb-2 block text-sm font-semibold text-gray-700">
                  {label}
                </label>
                <div className="relative">
                  <input
                    id={id}
                    name={id}
                    type={type === "password" && showPw ? "text" : type}
                    required
                    autoComplete={autoComplete}
                    value={values[id]}
                    onChange={(e) => setValues((v) => ({ ...v, [id]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-12 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  {type === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPw ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full rounded-xl bg-primary-600 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
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
