"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaShieldHalved, FaEye, FaEyeSlash, FaCircleCheck, FaKey, FaArrowLeft } from "react-icons/fa6";
import { requestResetCode, verifyResetCode, resetPassword } from "./actions";

type Step = "email" | "code" | "password" | "done";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await requestResetCode(email);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? "Could not send the reset code.");
      return;
    }
    setStep("code");
  }

  async function onCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await verifyResetCode(code.trim());
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? "Invalid or expired code.");
      return;
    }
    setStep("password");
  }

  async function onPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await resetPassword({ email, newPassword: password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? "Could not reset the password.");
      return;
    }
    setStep("done");
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl lg:p-10">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-600">
                Fresh<span className="text-gray-800">Cart</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {step === "done" ? "Password Updated" : "Forgot Password?"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {step === "email" && "No worries, we'll send you a reset code"}
              {step === "code" && `Enter the 6-digit code sent to ${email}`}
              {step === "password" && "Choose a new password for your account"}
              {step === "done" && "Your password has been reset successfully"}
            </p>
          </div>

          {step !== "done" && (
            <div className="mb-8 flex items-center justify-center gap-0">
              {(["email", "code", "password"] as const).map((s, i) => {
                const activeIdx = step === "email" ? 0 : step === "code" ? 1 : 2;
                const Icon = i === 0 ? FaEnvelope : i === 1 ? FaKey : FaLock;
                const active = i === activeIdx;
                const doneStep = i < activeIdx;
                return (
                  <div key={s} className="flex items-center">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                        active
                          ? "bg-primary-600 text-white ring-4 ring-primary-100"
                          : doneStep
                            ? "bg-primary-100 text-primary-600"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon />
                    </div>
                    {i < 2 && <div className="h-px w-10 bg-gray-200 sm:w-16"></div>}
                  </div>
                );
              })}
            </div>
          )}

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
          )}

          {step === "email" && (
            <form onSubmit={onEmail} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary-600 py-3.5 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={onCode} className="space-y-5">
              <div>
                <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Reset Code
                </label>
                <div className="relative">
                  <FaShieldHalved className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="code"
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="Enter the 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 text-center text-lg tracking-[0.3em] focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary-600 py-3.5 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("email"); setError(null); }}
                className="w-full text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Resend code
              </button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={onPassword} className="space-y-5">
              {[
                { id: "password", label: "New Password", value: password, set: setPassword, placeholder: "Create a new password" },
                { id: "confirm", label: "Confirm Password", value: confirm, set: setConfirm, placeholder: "Confirm your new password" },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="mb-1.5 block text-sm font-medium text-gray-700">
                    {f.label}
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id={f.id}
                      type={showPw ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder={f.placeholder}
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-11 text-sm focus:border-primary-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      aria-label="Toggle password visibility"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPw ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary-600 py-3.5 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="text-center">
              <FaCircleCheck className="mx-auto mb-4 text-5xl text-primary-600" />
              <button
                onClick={() => router.push("/login")}
                className="w-full rounded-xl bg-primary-600 py-3.5 font-semibold text-white transition hover:bg-primary-700"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {step !== "done" && (
            <>
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  <FaArrowLeft className="text-xs" /> Back to Sign In
                </Link>
              </div>
              <div className="mt-6 border-t border-gray-100 pt-6">
                <p className="text-center text-sm text-gray-500">
                  Remember your password?{" "}
                  <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
