import InfoPage from "@/components/layout/info-page";

export const metadata = { title: "Privacy Policy | FreshCart" };

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      updated="February 2026"
      introTitle="Your Privacy Matters"
      intro="This Privacy Policy describes how FreshCart collects, uses, and protects your personal information when you use our services. We are committed to ensuring that your privacy is protected."
      sections={[
        {
          title: "Information We Collect",
          items: [
            { label: "1.1 Personal Data", text: "Name, email address, phone number, and shipping address." },
            { label: "1.2 Payment Data", text: "Credit card information processed securely through our payment providers." },
            { label: "1.3 Technical Data", text: "IP address, browser type, device information, and access times." },
            { label: "1.4 Usage Data", text: "Pages viewed, products browsed, and actions taken within our platform." },
          ],
        },
        {
          title: "How We Use Your Information",
          items: [
            { label: "2.1", text: "To process and fulfill your orders." },
            { label: "2.2", text: "To send order confirmations and shipping updates." },
            { label: "2.3", text: "To provide customer support and respond to inquiries." },
            { label: "2.4", text: "To improve our products, services, and user experience." },
            { label: "2.5", text: "To send promotional communications (with your consent)." },
          ],
        },
        {
          title: "Data Protection",
          items: [
            { label: "3.1", text: "We implement industry-standard encryption (SSL/TLS) for all data transfers." },
            { label: "3.2", text: "Payment information is processed by PCI-compliant payment providers." },
            { label: "3.3", text: "We conduct regular security audits and vulnerability assessments." },
            { label: "3.4", text: "Access to personal data is restricted to authorized personnel only." },
          ],
        },
        {
          title: "Information Sharing",
          items: [
            { label: "4.1", text: "We do not sell, trade, or rent your personal information to third parties." },
            { label: "4.2", text: "We may share data with trusted service providers who assist in our operations." },
            { label: "4.3", text: "We may disclose information when required by law or to protect our rights." },
          ],
        },
        {
          title: "Your Rights",
          items: [
            { label: "5.1 Access", text: "Request a copy of your personal data." },
            { label: "5.2 Rectification", text: "Request correction of inaccurate data." },
            { label: "5.3 Erasure", text: "Request deletion of your personal data." },
            { label: "5.4 Portability", text: "Request your data in a portable format." },
            { label: "5.5 Opt-out", text: "Unsubscribe from marketing communications at any time." },
          ],
        },
        {
          title: "Cookies",
          items: [
            { label: "6.1", text: "We use cookies to enhance your browsing experience and remember preferences." },
            { label: "6.2", text: "You can control cookie settings through your browser preferences." },
            { label: "6.3", text: "Disabling cookies may affect the functionality of certain features." },
          ],
        },
        {
          title: "Data Retention",
          intro:
            "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Account data is deleted within 30 days of account closure upon request.",
        },
      ]}
      contact="For questions about this Privacy Policy or to exercise your rights, contact our Data Protection Officer at"
      contactEmail="privacy@freshcart.com"
      otherLabel="View Terms of Service"
      otherHref="/terms"
    />
  );
}
