import InfoPage from "@/components/layout/info-page";

export const metadata = { title: "Returns & Refunds | FreshCart" };

export default function ReturnsPage() {
  return (
    <InfoPage
      title="Returns & Refunds"
      updated="February 2026"
      introTitle="Shop with Confidence"
      intro="Our return policy is designed to be simple and fair. If something is not right, we will make it right."
      sections={[
        {
          title: "Return Policy",
          items: [
            { label: "1.1", text: "Returns are accepted within 14 days of delivery for most items." },
            { label: "1.2", text: "Products must be unused and in their original packaging." },
            { label: "1.3", text: "Return shipping is free for defective or incorrect items." },
          ],
        },
        {
          title: "Refund Process",
          items: [
            { label: "2.1", text: "Refunds are processed within 5-7 business days after we receive the returned item." },
            { label: "2.2", text: "Refunds go back to the original payment method." },
            { label: "2.3", text: "You can choose an exchange instead of a refund." },
          ],
        },
        {
          title: "How to Start a Return",
          items: [
            { label: "3.1", text: "Contact our support team with your order number." },
            { label: "3.2", text: "We will arrange pickup or provide return instructions." },
            { label: "3.3", text: "You will receive a confirmation once your refund is issued." },
          ],
        },
      ]}
      contact="Need help with a return? Contact us at"
      contactEmail="support@freshcart.com"
      otherLabel="View Shipping Information"
      otherHref="/shipping"
    />
  );
}
