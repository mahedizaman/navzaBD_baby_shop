# NavzaBD Client App Guide

> Complete reference for the NavzaBD storefront — features, payment flow, project structure, and local setup instructions.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Checkout & Payment Flow](#checkout--payment-flow)
- [Project Structure](#project-structure)
- [Running Locally](#running-locally)
- [Test Checklist](#test-checklist)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16 (App Router)** | SEO-friendly React app with SSR and file-based routing |
| **TypeScript** | Type safety and improved developer experience |
| **Tailwind CSS v4** | Modern, responsive UI styling |
| **Axios** | HTTP client for all backend API calls |
| **Stripe Checkout** | Redirect-based online payment processing |
| **Zustand** | Lightweight global state management for cart and wishlist |

---

## Core Features

### Home Page

**Route:** `/`

Displays a hero slider, promotional banners, featured products, trust badges, and testimonials. Content is dynamically rendered from backend data (categories, brands, and products).

---

### Product Listing & Filtering

**Route:** `/products`

| Feature | Details |
|---------|---------|
| Pagination | Navigate through large product sets |
| Sorting | Sort by price or `createdAt` |
| Search | Keyword search across product names and descriptions |
| Filtering | Filter by category, brand, and price range |

API call:

```
GET /api/products?page=1&limit=12&sortOrder=asc&category=...&brand=...&priceMin=...&priceMax=...&search=...
```

---

### Product Detail Page

**Route:** `/products/[id]`

Displays full product information: name, image, description, price, discount, stock availability, and ratings.

- **Add to Cart** — adds the item to the `useCartStore` Zustand store
- **Wishlist** — add or remove from wishlist (if enabled on the frontend)

---

### Cart

**Route:** `/cart`

| Feature | Details |
|---------|---------|
| Item summary | Name, image, quantity, and line total for each item |
| Quantity controls | Increment and decrement per item |
| Remove item | Remove a single item from the cart |
| Clear cart | Remove all items at once |

Cart state is managed client-side with **Zustand** (`useCartStore`) and persisted in the browser. The cart can optionally be synced with the backend via `/api/cart` routes.

Clicking **Proceed to Checkout** navigates to `/checkout`.

---

## Checkout & Payment Flow

**Route:** `/checkout`  
**Component:** `client/app/checkout/page.tsx`

### Required Fields

Before payment can be initiated, the following shipping address fields are mandatory:

| Field | Required |
|-------|----------|
| `street` | Yes |
| `city` | Yes |
| `country` | Yes |
| `postalCode` | Yes |

If any field is missing when the user clicks **Pay Now**, a `toast.error("Please fill in all shipping address fields.")` is shown and the request is not sent.

> **Note:** Phone number is not currently a required field in the checkout form. It can be added to both the frontend form and the backend request body if needed.

---

### Authentication

The checkout page reads a JWT token from `localStorage` using `getStoredAuthToken()` (keys: `token` or `navzabd_token`). If no token is found, a `toast.error` is shown and the user is prompted to log in.

The backend route `POST /api/payment/initiate` is protected and requires a valid JWT token.

> **For local testing:** You can temporarily bypass the token check by commenting out the `if (!token)` block in `checkout/page.tsx`. Do not do this in production.

---

### Payment Flow (Step by Step)

```
User fills in shipping details → clicks "Pay Now"
        ↓
handlePayNow() builds the request body:
  - amount   → cart total
  - items    → [{ productId, name, price, qty, image }]
  - shippingAddress → { street, city, country, postalCode }
        ↓
POST /api/payment/initiate  (with JWT token)
        ↓
Backend:
  1. Validates amount and stock
  2. Creates an Order document (status: pending)
  3. Creates a Stripe Checkout Session
  4. Returns { url, sessionId, orderId }
        ↓
Frontend:
  window.location.href = url  →  User lands on Stripe hosted page
        ↓
After payment:
  Success  →  /payment/success?session_id=...
  Failure  →  /payment/fail
        ↓
Optional: GET /api/payment/verify?session_id=...
  Confirms order was marked as paid
```

---

## Project Structure

```
client/
├── app/
│   ├── page.tsx                        # Home page
│   ├── products/
│   │   ├── page.tsx                    # Product listing & filtering
│   │   └── [id]/page.tsx              # Single product detail
│   ├── cart/
│   │   └── page.tsx                   # Cart page
│   ├── checkout/
│   │   └── page.tsx                   # Checkout form + Pay Now logic
│   └── payment/
│       ├── success/page.tsx           # Payment success page
│       └── fail/page.tsx              # Payment failure / cancel page
├── services/                          # API client functions
│   ├── products.ts
│   ├── categories.ts
│   ├── brands.ts
│   └── payments.ts
└── store/
    ├── useCartStore.ts                # Zustand cart state
    └── useWishlistStore.ts            # Zustand wishlist state
```

---

## Running Locally

**Project root:** `/home/ra-one/website/Complete NavzaBD Baby Shop`

### Step 1 — Start the Backend

```bash
cd "server"
npm install
npm run dev
```

Create `server/.env`:

```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_CURRENCY=usd

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ADMIN_URL=http://localhost:5173
CLIENT_URL=http://localhost:3000
PRODUCTION_SERVER_URL=
```

---

### Step 2 — Start the Client App

```bash
cd "client"
npm install
npm run dev
```

The app runs at `http://localhost:3000` by default.

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This allows the Axios service layer to route all API calls to the correct backend URL.

---

## Test Checklist

Use this checklist to verify the app is working correctly after setup:

- [ ] Backend is running on port `8000` and client on port `3000`
- [ ] Home page loads products and banners without errors
- [ ] Products can be added to the cart from the listing or detail page
- [ ] `/cart` shows correct quantities and total price
- [ ] Clicking **Pay Now** on `/checkout` without filling in shipping fields shows a validation error
- [ ] Filling in valid shipping details and clicking **Pay Now** redirects to Stripe Checkout
- [ ] Using a Stripe test card completes the payment and lands on `/payment/success`
- [ ] The order appears in the admin panel with `paid` status
