"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaShieldHalved, FaEye, FaEyeSlash, FaCircleCheck, FaKey, FaArrowLeft, FaCheck } from "react-icons/fa6";
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

  const activeIdx = step === "email" ? 0 : step === "code" ? 1 : 2;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="space-y-6 text-center">
            <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-green-50 to-emerald-50 shadow-lg">
              <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-primary-100/50"></div>
              <div className="absolute bottom-12 right-10 h-32 w-32 rounded-full bg-green-100/50"></div>
              <div className="absolute right-20 top-20 h-16 w-16 rounded-full bg-emerald-100/50"></div>
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="flex h-28 w-28 rotate-3 items-center justify-center rounded-3xl bg-white shadow-xl transition-transform duration-300 hover:rotate-0">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-100">
                    <FaLock className="text-3xl text-primary-600" />
                  </div>
                </div>
                <div className="absolute -left-16 top-4 flex h-14 w-14 -rotate-12 items-center justify-center rounded-xl bg-white shadow-lg">
                  <FaEnvelope className="text-xl text-primary-500" />
                </div>
                <div className="absolute -right-16 top-8 flex h-14 w-14 rotate-12 items-center justify-center rounded-xl bg-white shadow-lg">
                  <FaShieldHalved className="text-xl text-primary-500" />
                </div>
                <div className="flex gap-3">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-primary-400"></div>
                  <div className="h-3 w-3 animate-pulse rounded-full bg-primary-500 [animation-delay:150ms]"></div>
                  <div className="h-3 w-3 animate-pulse rounded-full bg-primary-600 [animation-delay:300ms]"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">Reset Your Password</h2>
              <p className="text-lg text-gray-600">
                Don&apos;t worry, it happens to the best of us. We&apos;ll help you get back into your account in no time.
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center"><FaEnvelope className="mr-2 text-primary-600" />Email Verification</div>
                <div className="flex items-center"><FaShieldHalved className="mr-2 text-primary-600" />Secure Reset</div>
                <div className="flex items-center"><FaLock className="mr-2 text-primary-600" />Encrypted</div>
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
              <h1 className="mb-2 text-2xl font-bold text-gray-800">
                {step === "done" ? "Password Updated" : "Forgot Password?"}
              </h1>
              <p className="text-gray-600">
                {step === "email" && "No worries, we'll send you a reset code"}
                {step === "code" && `Enter the 6-digit code sent to ${email}`}
                {step === "password" && "Choose a new password for your account"}
                {step === "done" && "Your password has been reset successfully"}
              </p>
            </div>

            {step !== "done" && (
              <div className="mb-8 flex items-center justify-center">
                {(["email", "code", "password"] as const).map((s, i) => {
                  const Icon = i === 0 ? FaEnvelope : i === 1 ? FaKey : FaLock;
                  const active = i === activeIdx;
                  const doneStep = i < activeIdx;
                  return (
                    <div key={s} className="flex items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                          active
                            ? "bg-primary-600 text-white ring-4 ring-primary-100"
                            : doneStep
                              ? "bg-primary-100 text-primary-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {doneStep ? <FaCheck /> : <Icon />}
                      </div>
                      {i < 2 && (
                        <div className={`mx-2 h-0.5 w-16 transition-all duration-300 ${doneStep ? "bg-primary-600" : "bg-gray-200"}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600">{error}</p>
            )}

            {step === "email" && (
              <form onSubmit={onEmail} className="space-y-6">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-12 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-primary-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            )}

            {step === "code" && (
              <form onSubmit={onCode} className="space-y-6">
                <div>
                  <label htmlFor="code" className="mb-2 block text-sm font-semibold text-gray-700">
                    Reset Code
                  </label>
                  <div className="relative">
                    <input
                      id="code"
                      type="text"
                      required
                      inputMode="numeric"
                      placeholder="Enter the 6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-12 text-center text-lg tracking-[0.3em] transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                    <FaShieldHalved className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-primary-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setStep("email"); setError(null); }}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                  >
                    Resend code
                  </button>
                </div>
              </form>
            )}

            {step === "password" && (
              <form onSubmit={onPassword} className="space-y-6">
                {[
                  { id: "password", label: "New Password", value: password, set: setPassword, placeholder: "Create a new password" },
                  { id: "confirm", label: "Confirm Password", value: confirm, set: setConfirm, placeholder: "Confirm your new password" },
                ].map((f) => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="mb-2 block text-sm font-semibold text-gray-700">
                      {f.label}
                    </label>
                    <div className="relative">
                      <input
                        id={f.id}
                        type={showPw ? "text" : "password"}
                        required
                        minLength={6}
                        placeholder={f.placeholder}
                        value={f.value}
                        onChange={(e) => f.set(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-12 pr-12 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                      />
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
                  className="w-full rounded-xl bg-primary-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-primary-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="w-full rounded-xl bg-primary-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-primary-700 hover:shadow-xl"
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
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                  >
                    <FaArrowLeft className="text-xs" /> Back to Sign In
                  </Link>
                </div>
                <div className="mt-8 border-t border-gray-100 pt-6 text-center">
                  <p className="text-gray-600">
                    Remember your password?{" "}
                    <Link href="/login" className="font-semibold text-primary-600 transition-colors hover:text-primary-700">
                      Sign In
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
