# FreshCart - Route Academy Final Project

E-commerce front end matching the course demo (freshcart-route.vercel.app),
built with Next.js App Router + TypeScript + Tailwind CSS v4 + shadcn/ui.
Data and mutations use the live Route API v1 (https://ecommerce.routemisr.com/api/v1).

## Setup
```bash
npm ci
cp .env.local.example .env.local   # set NEXTAUTH_SECRET (any random string) and NEXTAUTH_URL
npm run dev                        # http://localhost:3000
npm run build && npm start         # production
```

## Stack
Next.js 15.5.29, React 19.3.1, Tailwind CSS v4, shadcn/ui, next-auth 4.24.15
(credentials provider), swiper, react-icons.

## What's implemented
Unless noted otherwise, features run against the live Route API and were
live-tested. Items marked (fixture-verified) were tested only against an
isolated mock - simulated, not live-verified.
- Home: hero carousel, features strip, categories, promos, featured products,
  newsletter, footer. Pixel-checked against the demo at desktop and 390px.
- Auth: register, login, sign out (next-auth credentials; Route API token lives
  only in the encrypted httpOnly session cookie, decoded server-side only).
- Products: listing with working title search, API-side filters
  (?category=, ?brand=, ?subcategory=), details page with gallery, quantity,
  reviews tab (read-only), Shipping & Returns tab (demo-verbatim copy).
- Cart: full CRUD (add, update count, remove, clear), order summary with real
  API totals, free-shipping banner.
- Wishlist: add/remove, In Cart status detection, mobile card layout.
- Categories/brands: listing pages, category details with subcategory grid,
  all linking to real filtered product listings.
- Account: /profile/addresses (real add/remove), /orders (read-only list;
  empty state live-verified, populated rendering fixture-verified).
- Forget password: 3-step flow (email -> code -> new password) calling the
  real API endpoints; full happy-path UI fixture-verified only - real code
  receipt is untested (test mailbox is non-deliverable).
- Header: session-aware, real cart/wishlist count badges.
- Checkout: full instructor flow implemented - address selection, Cash on
  Delivery (POST /orders/{cartId}) and Credit/Debit Card (POST
  /orders/checkout-session/{cartId}, Stripe hosted redirect). Submission is
  gated server-side and OFF by default (see below).
- Contact: demo-verbatim page; the form is intentionally unwired (no backend).

## Known divergences from the demo (each deliberate)
- Working product search (the demo silently ignores keywords). Approved.
- Category details show only subcategories that actually belong to the
  category: the API's category-scoped endpoint ignores its filter and returns
  a mislabeled global list (which the demo displays). Categories whose
  subcategories sit on the API's broken second page show an
  unavailable/incomplete-data state with a working products fallback.
- Discounted products: the store API prices cart lines at the pre-discount
  base price (observed on multiple discounted products; docs are silent). The
  UI keeps the demo's catalog price display but adds a visible hedged note
  ("cart may charge the pre-discount price") on cards, details, wishlist and
  cart lines; details-page totals compute the price actually charged for the
  discounted products we tested.
- /register exists here while the demo's own register route 404s.

## Live order gate
Order submission is implemented but disabled by default. The server action
returns before any network call unless the server environment sets:
```
ALLOW_LIVE_ORDER_SUBMISSION=true
```
With the gate off, the UI shows Place Order and the card option disabled, and
no order-creation or payment-session request (POST) is ever sent - reading
order history (GET) still works. WARNING: enabling the gate
places REAL orders in the shared Route course database and, for card payment,
creates a REAL Stripe checkout session. The Route API has no sandbox/test mode.

## Intentionally not implemented / disabled (honest, not fake)
- Contact form submit (no backend endpoint exists).
- Buy Now, Compare, promo codes, social login buttons.
- Reset-password happy path is wired but not end-to-end verified (needs a
  mailbox that can receive the API's reset code).

## Testing
Live UI flows were exercised with Playwright against the production build
(test account on a reserved, non-deliverable domain). Test scripts are
throwaway and never committed. No live orders, payments, or external emails.
Isolated fixture tests run the same build against a local mock via the
ROUTE_API_BASE env override (populated orders rendering, checkout address
selection, cash/card order submission, reset happy-path UI); these are
simulated, never live-verified.
