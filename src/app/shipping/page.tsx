import InfoPage from "@/components/layout/info-page";

export const metadata = { title: "Shipping Information | FreshCart" };

export default function ShippingPage() {
  return (
    <InfoPage
      title="Shipping Information"
      updated="February 2026"
      introTitle="Delivery You Can Count On"
      intro="Everything you need to know about how and when your FreshCart order arrives."
      sections={[
        {
          title: "Shipping Options",
          items: [
            { label: "1.1 Standard Delivery", text: "3-5 business days." },
            { label: "1.2 Express Delivery", text: "1-2 business days, available at checkout." },
            { label: "1.3 Free Shipping", text: "On all orders over 500 EGP." },
          ],
        },
        {
          title: "Order Processing",
          items: [
            { label: "2.1", text: "Orders are processed within 24 hours on business days." },
            { label: "2.2", text: "You receive a confirmation as soon as your order is placed." },
            { label: "2.3", text: "Delivery times are estimates and may vary by location and carrier." },
          ],
        },
        {
          title: "Tracking Your Order",
          items: [
            { label: "3.1", text: "Track your order any time from the Track Order page." },
            { label: "3.2", text: "Order status is also visible on your Orders page." },
          ],
        },
      ]}
      contact="Questions about shipping? Contact us at"
      contactEmail="support@freshcart.com"
      otherLabel="View Returns & Refunds"
      otherHref="/returns"
    />
  );
}
