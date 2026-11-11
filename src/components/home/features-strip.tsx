import { FaTruckFast, FaShieldHalved, FaArrowRotateLeft, FaHeadset } from "react-icons/fa6";

const features = [
  { icon: FaTruckFast, title: "Free Shipping", text: "On orders over 500 EGP", wrap: "bg-blue-50 text-blue-500" },
  { icon: FaShieldHalved, title: "Secure Payment", text: "100% secure transactions", wrap: "bg-emerald-50 text-emerald-500" },
  { icon: FaArrowRotateLeft, title: "Easy Returns", text: "14-day return policy", wrap: "bg-orange-50 text-orange-500" },
  { icon: FaHeadset, title: "24/7 Support", text: "Dedicated support team", wrap: "bg-purple-50 text-purple-500" },
];

export default function FeaturesStrip() {
  return (
    <section className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${f.wrap}`}>
                <f.icon className="text-xl" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">{f.title}</h3>
                <p className="text-xs text-gray-500">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
