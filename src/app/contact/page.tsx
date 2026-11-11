import Link from "next/link";
import {
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaClock,
  FaHeadset,
  FaPaperPlane,
  FaCircleQuestion,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";

const inputCls =
  "w-full cursor-not-allowed rounded-xl border border-gray-200 px-4 py-3 opacity-60 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";
const labelCls = "mb-2 block text-sm font-medium text-gray-700";

const infoCards = [
  { icon: FaPhone, title: "Phone", sub: "Mon-Fri from 8am to 6pm", value: "+1 (800) 123-4567", href: "tel:+18001234567" },
  { icon: FaEnvelope, title: "Email", sub: "We'll respond within 24 hours", value: "support@freshcart.com", href: "mailto:support@freshcart.com" },
  { icon: FaLocationDot, title: "Office", sub: "", value: "123 Commerce Street\nNew York, NY 10001\nUnited States", href: "" },
  { icon: FaClock, title: "Business Hours", sub: "", value: "Monday - Friday: 8am - 6pm\nSaturday: 9am - 4pm\nSunday: Closed", href: "" },
];

const socials = [
  { icon: FaFacebookF, label: "Facebook" },
  { icon: FaTwitter, label: "Twitter" },
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaLinkedinIn, label: "LinkedIn" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-linear-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">Contact Us</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
              <FaHeadset className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h1>
              <p className="mt-1 text-white/80">We&apos;d love to hear from you. Get in touch with our team.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            {infoCards.map(({ icon: Icon, title, sub, value, href }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                    <Icon className="text-lg text-primary-600" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">{title}</h3>
                    {sub && <p className="mb-2 text-sm text-gray-500">{sub}</p>}
                    {href ? (
                      <a href={href} className="font-medium text-primary-600 hover:underline">
                        {value}
                      </a>
                    ) : (
                      <p className="whitespace-pre-line text-sm text-gray-500">{value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Follow Us</h3>
              <div className="flex items-center gap-3">
                {socials.map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-primary-600 hover:text-white"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                  <FaHeadset className="text-lg text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Send us a Message</h2>
                  <p className="text-sm text-gray-500">Fill out the form and we&apos;ll get back to you</p>
                </div>
              </div>
              <form className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelCls}>
                      Full Name
                    </label>
                    <input disabled type="text" id="name" placeholder="John Doe" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelCls}>
                      Email Address
                    </label>
                    <input disabled type="email" id="email" placeholder="john@example.com" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className={labelCls}>
                    Subject
                  </label>
                  <select disabled id="subject" className={`${inputCls} bg-white`}>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="shipping">Shipping Question</option>
                    <option value="returns">Returns &amp; Refunds</option>
                    <option value="product">Product Information</option>
                    <option value="feedback">Feedback &amp; Suggestions</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className={labelCls}>
                    Message
                  </label>
                  <textarea
                    disabled
                    id="message"
                    rows={5}
                    placeholder="How can we help you?"
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <button
                  type="button"
                  disabled
                  title="The contact form has no backend in this build yet"
                  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 font-semibold text-white opacity-60 shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700 md:w-auto"
                >
                  <FaPaperPlane /> Send Message
                </button>
                <p className="text-xs text-gray-400">The contact form isn&apos;t wired to a backend in this build yet.</p>
              </form>
            </div>

            <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <FaCircleQuestion className="text-lg text-primary-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">Looking for quick answers?</h3>
                  <p className="mb-3 text-sm text-gray-600">
                    Check out our Help Center for frequently asked questions about orders, shipping, returns, and more.
                  </p>
                  <Link
                    href="/help"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
                  >
                    Visit Help Center →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
