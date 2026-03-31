# NavzaBD Admin Panel Guide

> Complete reference for setting up, configuring, and operating the NavzaBD admin panel.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Login & Navigation](#login--navigation)
- [Dashboard Overview](#dashboard-overview)
- [Product Management](#product-management)
- [Brand Management](#brand-management)
- [Category Management](#category-management)
- [Orders & Invoices](#orders--invoices)
- [Account Management](#account-management)
- [Running Locally](#running-locally)
- [Quick Start Checklist](#quick-start-checklist)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vite + React + TypeScript** | Fast development builds and type-safe components |
| **Tailwind CSS v4** | Modern, responsive UI styling |
| **React Router v7** | SPA routing (`/login`, `/dashboard/...`) |
| **Sonner** | Toast notifications for success and error feedback |
| **jsPDF** | Client-side PDF invoice generation |
| **Axios** | HTTP client for all backend API calls |

---

## Login & Navigation

### Logging In

1. Start the admin panel (`npm run dev`) and open `http://localhost:5173` in your browser.
2. On the **Login Screen**, enter:
   - **Email** — must belong to a user with `role: "admin"`
   - **Password** — the password stored in the backend database
3. On successful login:
   - A `token` and `user` object are received from the backend
   - Both are saved to `localStorage` as `admin_token` and `admin_user`
   - The app automatically redirects to `/dashboard`

### Sidebar Navigation

| Route | Description |
|-------|-------------|
| **Dashboard** | Overall sales, orders, and user stats with charts |
| **Account** | Current admin's profile and address management |
| **Orders** | View and manage all orders; update fulfillment status |
| **Product** | Full product CRUD with image upload support |
| **Brand** | Brand list with add, edit, and delete + image upload |
| **Categories** | Category list with add, edit, and delete + image upload |
| **Invoices** | Invoice table generated from order data; download as PDF |
| **Banner** | Banner list and management (UI extendable as needed) |

> On mobile, the sidebar collapses into a hamburger menu accessible from the header. All data tables support horizontal scrolling for responsive layouts.

---

## Dashboard Overview

**Route:** `/dashboard`

The dashboard fetches data from `GET /api/stats` and displays:

- Total Sales / Revenue
- Total Orders
- Total Products
- Total Users

A pie or donut chart provides a visual distribution analysis of the above metrics.

---

## Product Management

### Viewing Products

**Route:** `/dashboard/product`

Products are displayed in a table with the following columns: **Name**, **Category**, **Brand**, **Price**, and **Stock**. Data is fetched from:

```
GET /api/products?page=1&limit=500&sortOrder=desc
```

Category and brand columns display populated names (not raw IDs).

---

### Adding a New Product

1. Go to **Products** in the sidebar.
2. Fill in the **Add New Product** form:

| Field | Required | Notes |
|-------|----------|-------|
| Name | Yes | — |
| Price | Yes | — |
| Stock | Yes | — |
| Discount % | No | Must be between 0 and 80 |
| Category | Yes | Select from existing categories |
| Brand | Yes | Select from existing brands |
| Description | Yes | — |
| Image | Yes | File input; preview is shown before submission |

3. On submit:
   - Client-side validation runs — missing required fields trigger a `toast.error`
   - A `FormData` payload is sent to `POST /api/products` containing: `name`, `description`, `price`, `stock`, `discountPercentage`, `categoryId`, `brandId`, `image` (file)
   - The backend processes the image upload via **Multer** and stores it on **Cloudinary**
   - On success: `toast.success("Product created.")` and the product list refreshes

---

### Editing and Deleting Products

**Edit:**
- Click **Edit** in the Actions column of the product table
- A modal opens with the current product data pre-filled
- Update any fields; optionally upload a new image
- Submits to `PUT /api/products/:id` (FormData or JSON)

**Delete:**
- Click **Delete** → confirm in the browser dialog
- Calls `DELETE /api/products/:id`
- On success: Sonner toast and list refreshes

---

## Brand Management

**Route:** `/dashboard/brand`

### Viewing Brands

All brands are shown in a card or table layout with **Name**, **Description**, and **Image**. Fetched from `GET /api/brands`.

---

### Adding a New Brand

1. Navigate to **Brands** in the sidebar.
2. Fill in the **Add New Brand** form:

| Field | Required | Notes |
|-------|----------|-------|
| Name | Yes | — |
| Description | No | Short description of the brand |
| Image | No | File input with preview |

3. On submit:
   - A `FormData` payload (`name`, `description?`, `image` file) is sent to `POST /api/brands` with the admin token
   - The backend uploads the image to Cloudinary under the `navzabd/brands` folder
   - On success: Sonner success toast and the brand list refreshes

---

### Editing and Deleting Brands

**Edit:** Actions → Edit → update name, description, or image → `PUT /api/brands/:id`

**Delete:** Confirm deletion → `DELETE /api/brands/:id`

---

## Category Management

**Route:** `/dashboard/categories`

### Viewing Categories

Displayed in a table with columns: **Name**, **Category Type**, **Description**, **Image**. Fetched from `GET /api/categories`.

---

### Adding a New Category

1. Navigate to **Categories** in the sidebar.
2. Fill in the **Add New Category** form:

| Field | Required | Notes |
|-------|----------|-------|
| Name | Yes | — |
| Category Type | Yes | One of: `Featured`, `Hot Categories`, `Top Categories` |
| Description | No | — |
| Image | No | File input with preview |

3. On submit:
   - A `FormData` payload is sent to `POST /api/categories`
   - Image is uploaded to Cloudinary under `navzabd/categories`
   - On success: Sonner toast and list refreshes

---

### Editing and Deleting Categories

**Edit:** Edit modal → update name, description, categoryType, or image → `PUT /api/categories/:id`

**Delete:** Confirm deletion → `DELETE /api/categories/:id`

---

## Orders & Invoices

### Orders Management

**Route:** `/dashboard/order`

Data is fetched from:
- `GET /api/orders` — returns all orders when the requester is admin
- `GET /api/stats` — returns summary statistics

The orders table displays: **Order ID**, **Customer**, **Items Summary**, **Amount**, **Payment Status**, and **Fulfillment Status**.

**Updating Fulfillment Status:**

Select a new status from the dropdown in any order row:

| Status | Meaning |
|--------|---------|
| `pending` | Order received, not yet processed |
| `processing` | Order is being prepared |
| `shipped` | Order has been dispatched |
| `delivered` | Order successfully delivered |

Selecting a status triggers `PUT /api/orders/:id/fulfillment`. On success, a Sonner toast appears and the data refreshes.

---

### Invoice Section

**Route:** `/dashboard/invoices`

Data source: `GET /api/orders`

The invoice table shows:

| Column | Description |
|--------|-------------|
| Order ID | Shortened order identifier |
| Customer Name | Name from the order record |
| Date | `createdAt` timestamp |
| Total Amount | Order total |
| Payment Status | `PAID` or `PENDING` |

Each row has a **Download** button that generates a PDF invoice client-side using **jsPDF**:

- **Header:** NavzaBD Invoice
- **Fields:** Order ID, Customer, Date
- **Items Table:** Product Name, Quantity, Line Total
- **Footer:** Grand total and payment status

After download, a `"Invoice downloaded."` Sonner toast confirms the action.

> All tables use `overflow-x-auto` for responsive horizontal scrolling on mobile devices.

---

## Account Management

**Route:** `/dashboard/account`

API endpoints used:
- `GET /api/auth/profile` — fetch current admin profile
- `PUT /api/users/:id` — update profile fields
- Address CRUD routes — manage shipping addresses

**Features:**

- View and update profile: Name, Email, Avatar URL
- Manage saved addresses: Add, Edit, Delete (fields: `street`, `city`, `country`, `postalCode`, `isDefault`)
- All actions are confirmed with Sonner toasts

---

## Running Locally

**Project root:** `/home/ra-one/website/Complete NavzaBD Baby Shop`

### Step 1 — Start the Backend

```bash
cd "server"
npm install
npm run dev
```

Create `server/.env` with the following variables:

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

### Step 2 — Start the Admin Panel

```bash
cd "admin"
npm install
npm run dev
```

Create `admin/.env`:

```env
VITE_API_URL=http://localhost:8000
```

This tells the Axios client to route all `/api/...` calls to the backend server.

---

## Quick Start Checklist

Before you begin managing the store, complete the following steps in order:

- [ ] Configure `server/.env` with your MongoDB, Stripe, and Cloudinary credentials
- [ ] Run `npm run dev` in the `server` directory
- [ ] Set `VITE_API_URL` in `admin/.env`
- [ ] Run `npm run dev` in the `admin` directory
- [ ] Create at least one user with `role: "admin"` in MongoDB
- [ ] Log in at `http://localhost:5173/login`
- [ ] Create **Categories** first, then **Brands**, then **Products**
- [ ] Monitor orders and download PDF invoices from the Invoices section
