import InfoPage from "@/components/layout/info-page";

export const metadata = { title: "Help Center | FreshCart" };

export default function HelpPage() {
  return (
    <InfoPage
      title="Help Center"
      updated="February 2026"
      introTitle="How Can We Help?"
      intro="Answers to the most common questions about shopping, orders, payment, and delivery on FreshCart."
      sections={[
        {
          title: "Orders",
          items: [
            { label: "How do I place an order?", text: "Add items to your cart, go to checkout, enter your shipping address, choose a payment method, and place your order." },
            { label: "Where is my order?", text: "Check the Orders page for live status, or use Track Order." },
            { label: "Can I cancel an order?", text: "Contact support as soon as possible; orders that have not shipped can usually be cancelled." },
          ],
        },
        {
          title: "Payment",
          items: [
            { label: "Which payment methods are accepted?", text: "Cash on delivery and online card payment." },
            { label: "Is online payment secure?", text: "Yes. Payments are processed over 256-bit SSL encryption by a PCI-compliant provider." },
          ],
        },
        {
          title: "Account",
          items: [
            { label: "How do I reset my password?", text: "Use the Forgot Password link on the sign-in page." },
            { label: "How do I manage my addresses?", text: "From My Addresses in your account, or directly at checkout." },
          ],
        },
        {
          title: "Delivery & Returns",
          items: [
            { label: "How long does delivery take?", text: "Standard delivery takes 3-5 business days; express takes 1-2." },
            { label: "How do returns work?", text: "Returns are accepted within 14 days; see Returns & Refunds for details." },
          ],
        },
      ]}
      contact="Still stuck? Our team replies fast -"
      contactEmail="support@freshcart.com"
      otherLabel="Contact Us"
      otherHref="/contact"
    />
  );
}
