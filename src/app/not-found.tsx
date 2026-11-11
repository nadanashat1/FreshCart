import Link from "next/link";
import {
  FaAppleWhole,
  FaArrowLeft,
  FaCarrot,
  FaCartShopping,
  FaHouse,
  FaLemon,
  FaPepperHot,
} from "react-icons/fa6";
import BackButton from "./not-found-back";

const floats = [
  { Icon: FaAppleWhole, cls: "top-[10%] left-[5%] text-primary-200 text-4xl", anim: "float 6s ease-in-out infinite" },
  { Icon: FaCarrot, cls: "top-[20%] right-[10%] text-primary-200 text-3xl", anim: "float 8s ease-in-out infinite 1s" },
  { Icon: FaLemon, cls: "bottom-[25%] left-[8%] text-primary-200 text-3xl", anim: "float 7s ease-in-out infinite 0.5s" },
  { Icon: FaPepperHot, cls: "bottom-[15%] right-[15%] text-primary-200 text-4xl", anim: "float 9s ease-in-out infinite 2s" },
  { Icon: FaAppleWhole, cls: "top-[50%] left-[15%] text-primary-100 text-2xl", anim: "float 5s ease-in-out infinite 1.5s" },
  { Icon: FaCarrot, cls: "top-[40%] right-[5%] text-primary-100 text-2xl", anim: "float 6s ease-in-out infinite 0.8s" },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafbfc] px-4 py-16">
      <style>{`@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }`}</style>
      <div className="absolute inset-0 overflow-hidden">
        {floats.map(({ Icon, cls, anim }, i) => (
          <div key={i} className={`absolute ${cls}`} style={{ animation: anim }}>
            <Icon />
          </div>
        ))}
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-primary-100/40 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-primary-100/30 to-transparent blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 h-52 w-64 rounded-[32px] bg-primary-100/50 blur-2xl sm:h-60 sm:w-72"></div>
            <div className="relative h-52 w-64 sm:h-60 sm:w-72">
              <div className="absolute inset-x-0 top-4 mx-auto flex h-40 w-52 items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60 sm:h-44 sm:w-60">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-transparent to-primary-100/40"></div>
                <FaCartShopping className="text-7xl text-primary-300" />
              </div>
              <div className="absolute -right-2 -top-2 sm:right-0 sm:top-0">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-white shadow-lg"></div>
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/40 sm:h-20 sm:w-20">
                    <span className="text-xl font-black tracking-tight text-white sm:text-2xl">404</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center justify-center gap-4">
                <div className="h-2.5 w-2.5 rounded-full bg-primary-400"></div>
                <div className="h-4 w-8 rounded-b-full border-b-[3px] border-primary-400"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-primary-400"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Oops! Nothing Here
          </h1>
          <p className="mx-auto max-w-md text-lg leading-relaxed text-gray-500">
            Looks like this page went out of stock! Don&apos;t worry, there&apos;s plenty more fresh content to explore.
          </p>
        </div>

        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-primary-600/25 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 sm:w-auto"
          >
            <FaHouse /> Go to Homepage
          </Link>
          <BackButton>
            <FaArrowLeft /> Go Back
          </BackButton>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-gray-400">
            Popular Destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="rounded-xl bg-primary-50 px-5 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
            >
              All Products
            </Link>
            <Link
              href="/categories"
              className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Categories
            </Link>
            <Link
              href="/brands"
              className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Brands
            </Link>
            <Link
              href="/contact"
              className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
