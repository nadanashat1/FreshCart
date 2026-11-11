import Link from "next/link";
import { FaUser } from "react-icons/fa6";
import ProfileNav from "./profile-nav";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-12">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors duration-200 hover:text-white">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">My Account</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
              <FaUser className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Account</h1>
              <p className="mt-1 text-white/80">Manage your addresses and account settings</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <ProfileNav />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
