import Link from "next/link";
import { FaFileLines } from "react-icons/fa6";

export type InfoSection = {
  title: string;
  intro?: string;
  items?: { label: string; text: string }[];
};

export default function InfoPage({
  title,
  updated,
  introTitle,
  intro,
  sections,
  contact,
  contactEmail,
  otherLabel,
  otherHref,
}: {
  title: string;
  updated: string;
  introTitle: string;
  intro: string;
  sections: InfoSection[];
  contact?: string;
  contactEmail?: string;
  otherLabel: string;
  otherHref: string;
}) {
  return (
    <section className="py-10">
      <div className="container mx-auto max-w-3xl px-4">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-primary-600">Home</Link>
          <span>/</span>
          <span className="font-medium text-gray-900">{title}</span>
        </nav>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
            <FaFileLines className="text-xl text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">Last updated: {updated}</p>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-primary-100 bg-primary-50 p-6">
          <h2 className="mb-2 font-bold text-gray-900">{introTitle}</h2>
          <p className="text-sm leading-relaxed text-gray-600">{intro}</p>
        </div>

        <div className="space-y-8">
          {sections.map((s, idx) => (
            <div key={s.title} className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                <FaFileLines className="text-sm text-primary-600" /> {idx + 1}. {s.title}
              </h2>
              {s.intro && <p className="text-sm leading-relaxed text-gray-600">{s.intro}</p>}
              {s.items && (
                <ul className="space-y-2">
                  {s.items.map((it) => (
                    <li key={it.label} className="text-sm leading-relaxed text-gray-600">
                      <span className="font-medium text-gray-800">{it.label}: </span>
                      {it.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {contact && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-gray-900">Contact Us</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              {contact}{" "}
              <a href={`mailto:${contactEmail}`} className="font-medium text-primary-600 hover:text-primary-700">
                {contactEmail}
              </a>
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-gray-600 transition hover:text-primary-600">
            Back to Home
          </Link>
          <Link href={otherHref} className="text-sm font-medium text-primary-600 transition hover:text-primary-700">
            {otherLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
