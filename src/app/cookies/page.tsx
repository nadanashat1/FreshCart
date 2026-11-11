import InfoPage from "@/components/layout/info-page";

export const metadata = { title: "Cookie Policy | FreshCart" };

export default function CookiesPage() {
  return (
    <InfoPage
      title="Cookie Policy"
      updated="February 2026"
      introTitle="How We Use Cookies"
      intro="This Cookie Policy explains what cookies are, how FreshCart uses them, and how you can control them."
      sections={[
        {
          title: "What Are Cookies",
          intro:
            "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and understand how you use it.",
        },
        {
          title: "Cookies We Use",
          items: [
            { label: "2.1 Essential Cookies", text: "Required for sign-in sessions, your cart, and secure checkout." },
            { label: "2.2 Preference Cookies", text: "Remember choices such as language and display settings." },
            { label: "2.3 Analytics Cookies", text: "Help us understand which pages and products are popular so we can improve the store." },
          ],
        },
        {
          title: "Managing Cookies",
          items: [
            { label: "3.1", text: "You can control or delete cookies through your browser settings at any time." },
            { label: "3.2", text: "Disabling essential cookies may prevent sign-in, cart, and checkout from working." },
          ],
        },
      ]}
      contact="Questions about this Cookie Policy? Contact us at"
      contactEmail="support@freshcart.com"
      otherLabel="View Privacy Policy"
      otherHref="/privacy"
    />
  );
}
