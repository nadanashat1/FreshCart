import InfoPage from "@/components/layout/info-page";

export const metadata = { title: "Terms of Service | FreshCart" };

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms of Service"
      updated="February 2026"
      introTitle="Important Notice"
      intro="By accessing and using FreshCart, you accept and agree to be bound by the terms and provisions of this agreement. Please read these terms carefully before using our services."
      sections={[
        {
          title: "Acceptance of Terms",
          items: [
            { label: "1.1", text: "By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms." },
            { label: "1.2", text: "If you do not agree to these Terms, you must not access or use the Service." },
            { label: "1.3", text: "We reserve the right to modify these Terms at any time, and such modifications shall be effective immediately upon posting." },
          ],
        },
        {
          title: "User Eligibility",
          items: [
            { label: "2.1", text: "The Service is intended for users who are at least eighteen (18) years of age." },
            { label: "2.2", text: "By using the Service, you represent and warrant that you are of legal age to form a binding contract." },
            { label: "2.3", text: "If you are accessing the Service on behalf of a legal entity, you represent that you have the authority to bind such entity." },
          ],
        },
        {
          title: "Account Registration",
          items: [
            { label: "3.1", text: "You may be required to create an account to access certain features of the Service." },
            { label: "3.2", text: "You agree to provide accurate, current, and complete information during registration." },
            { label: "3.3", text: "You are solely responsible for maintaining the confidentiality of your account credentials." },
            { label: "3.4", text: "You agree to notify us immediately of any unauthorized use of your account." },
          ],
        },
        {
          title: "Orders and Payments",
          items: [
            { label: "4.1", text: "All orders placed through the Service are subject to acceptance and availability." },
            { label: "4.2", text: "Prices are subject to change without notice prior to order confirmation." },
            { label: "4.3", text: "Payment must be made in full at the time of purchase through approved payment methods." },
            { label: "4.4", text: "We reserve the right to refuse or cancel any order at our sole discretion." },
          ],
        },
        {
          title: "Shipping and Delivery",
          items: [
            { label: "5.1", text: "Shipping times are estimates only and are not guaranteed." },
            { label: "5.2", text: "Risk of loss and title for items purchased pass to you upon delivery to the carrier." },
            { label: "5.3", text: "We are not responsible for delays caused by carriers, customs, or other factors beyond our control." },
          ],
        },
        {
          title: "Returns and Refunds",
          items: [
            { label: "6.1", text: "Our return policy allows returns within 14 days of delivery for most items." },
            { label: "6.2", text: "Products must be unused and in original packaging." },
            { label: "6.3", text: "Refunds will be processed within 5-7 business days after receiving the returned item." },
          ],
        },
        {
          title: "Limitation of Liability",
          intro:
            "To the maximum extent permitted by applicable law, FreshCart shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.",
        },
      ]}
      contact="If you have any questions about these Terms, please contact us at"
      contactEmail="support@freshcart.com"
      otherLabel="View Privacy Policy"
      otherHref="/privacy"
    />
  );
}
