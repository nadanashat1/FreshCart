"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getProviders, signIn } from "next-auth/react";
import {
  FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF,
  FaTruck, FaShieldHalved, FaClock,
} from "react-icons/fa6";
import { Fa7Lock, Fa7Users, Fa7Star, Fa7Google, Fa7FacebookCircle } from "@/components/icons/fa7";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [social, setSocial] = useState<{ google: boolean; facebook: boolean }>({ google: false, facebook: false });
  const searchParams = useSearchParams();

  useEffect(() => {
    getProviders().then((p) =>
      setSocial({ google: Boolean(p?.google), facebook: Boolean(p?.facebook) })
    );
  }, []);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "AccountExists") {
      setNotice("An account with this email already exists. Please sign in with your email and password.");
    } else if (err === "SocialEmailMissing") {
      setNotice("Your social account did not share an email address, so we could not sign you in. Please use email and password.");
    } else if (err && err !== "CredentialsSignin") {
      setNotice("Social sign-in could not be completed. Please try again or use email and password.");
    }
  }, [searchParams]);

  function socialSignIn(provider: "google" | "facebook") {
    setNotice(null);
    if (social[provider]) {
      signIn(provider, { callbackUrl: "/" });
    } else {
      setNotice("Social sign-in is not available in this build yet. Please use your email and password.");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Invalid email or password. Please try again.");
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
              <h1 className="mb-2 text-2xl font-bold text-gray-800">Welcome Back!</h1>
              <p className="text-gray-600">Sign in to continue your fresh shopping experience</p>
            </div>

            <div className="mb-6 space-y-3">
              <button
                type="button"
                onClick={() => socialSignIn("google")}
                className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50"
              >
                <Fa7Google className="text-lg text-red-500" />
                <span className="font-medium text-gray-700">Continue with Google</span>
              </button>
              <button
                type="button"
                onClick={() => socialSignIn("facebook")}
                className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50"
              >
                <Fa7FacebookCircle className="text-lg text-blue-600" />
                <span className="font-medium text-gray-700">Continue with Facebook</span>
              </button>
            </div>
            {notice && (
              <p className="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-center text-sm text-amber-700">{notice}</p>
            )}

            <div className="relative mb-6 flex items-center">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-4 text-sm font-medium text-gray-400">OR CONTINUE WITH EMAIL</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email" name="email" type="email" required autoComplete="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-12 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                  <Link href="/forget-password" className="cursor-pointer text-sm font-medium text-primary-600 hover:text-primary-700">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password" name="password" type={showPw ? "text" : "password"} required autoComplete="current-password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-12 pr-12 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="keep" type="checkbox" name="rememberMe"
                  className="h-4 w-4 rounded border-2 border-gray-300 text-primary-600 accent-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="keep" className="ml-3 text-sm text-gray-700">Keep me signed in</label>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full rounded-xl bg-primary-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-primary-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-8 border-t border-gray-100 pt-6 text-center">
              <p className="text-gray-600">
                New to FreshCart?{" "}
                <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700">
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center"><Fa7Lock className="mr-1" />SSL Secured</div>
              <div className="flex items-center"><Fa7Users className="mr-1" />50K+ Users</div>
              <div className="flex items-center"><Fa7Star className="mr-1" />4.9 Rating</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
