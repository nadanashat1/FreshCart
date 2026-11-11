import { redirect } from "next/navigation";

// The Route API builds the Stripe success URL as {origin}/allorders (the
// instructor demo's route name). This app serves order history at /orders,
// so send returning shoppers there.
export default function AllOrdersPage() {
  redirect("/orders");
}
