import Link from "next/link";
import { FaPhone, FaEnvelope, FaLocationDot, FaClock } from "react-icons/fa6";

const cards = [
  { icon: FaPhone, title: "Phone", sub: "Mon-Fri from 8am to 6pm", value: "+1 (800) 123-4567" },
  { icon: FaEnvelope, title: "Email", sub: "We'll respond within 24 hours", value: "support@freshcart.com" },
  { icon: FaLocationDot, title: "Office", sub: "", value: "123 Commerce Street\nNew York, NY 10001\nUnited States" },
  { icon: FaClock, title: "Business Hours", sub: "", value: "Monday - Friday: 8am - 6pm\nSaturday: 9am - 4pm\nSunday: Closed" },
];

export default function ContactPage() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-primary-600">Home</Link>
          <span>/</span>
          <span className="font-medium text-gray-900">Contact Us</span>
        </nav>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-1 text-gray-500">We&apos;d love to hear from you. Get in touch with our team.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map(({ icon: Icon, title, sub, value }) => (
              <div key={title} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <Icon className="text-primary-600" />
                </div>
                <h2 className="font-semibold text-gray-900">{title}</h2>
                {sub && <p className="text-xs text-gray-400">{sub}</p>}
                <p className="mt-1 whitespace-pre-line text-sm text-gray-600">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Send us a Message</h2>
            <p className="mb-5 text-sm text-gray-500">Fill out the form and we&apos;ll get back to you</p>
            <form className="space-y-4">
              <input
                disabled
                placeholder="John Doe"
                aria-label="Full Name"
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 px-4 py-2.5 text-sm opacity-60"
              />
              <input
                disabled
                placeholder="john@example.com"
                aria-label="Email Address"
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 px-4 py-2.5 text-sm opacity-60"
              />
              <select
                disabled
                aria-label="Subject"
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-500 opacity-60"
              >
                <option>General Information</option>
                <option>Feedback &amp; Suggestions</option>
                <option>Other</option>
              </select>
              <textarea
                disabled
                placeholder="How can we help you?"
                aria-label="Message"
                rows={4}
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 px-4 py-2.5 text-sm opacity-60"
              />
              <button
                type="button"
                disabled
                title="The contact form has no backend in this build yet"
                className="w-full cursor-not-allowed rounded-xl bg-primary-600 py-3 font-semibold text-white opacity-60"
              >
                Send Message
              </button>
              <p className="text-center text-xs text-gray-400">
                The contact form isn&apos;t wired to a backend in this build yet.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
