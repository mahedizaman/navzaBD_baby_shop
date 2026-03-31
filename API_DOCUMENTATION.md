# NavzaBD Backend API Documentation

**Base URL:** `http://localhost:8000`

This document provides a comprehensive reference for all available API endpoints in the NavzaBD backend, organized by resource category.

---

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Products](#products)
- [Categories](#categories)
- [Brands](#brands)
- [Orders](#orders)
- [Cart](#cart)
- [Wishlist](#wishlist)
- [Banners](#banners)
- [Payments](#payments)
- [Analytics](#analytics)
- [Stats](#stats)
- [Access Level Reference](#access-level-reference)

---

## Authentication

Base path: `/api/auth`

| Method | Endpoint | Access | Description | Request |
|--------|----------|--------|-------------|---------|
| `POST` | `/api/auth/register` | Public | Register a new user account. | **Body:** `{ name: string, email: string, password: string }` |
| `POST` | `/api/auth/login` | Public | Authenticate with email and password. Returns a JWT token. | **Body:** `{ email: string, password: string }` |
| `POST` | `/api/auth/logout` | Protected | Invalidate the current user's session (token cookie). | **Header:** `Authorization: Bearer <token>` |
| `GET` | `/api/auth/profile` | Protected | Retrieve the profile data of the currently authenticated user. | **Header:** `Authorization: Bearer <token>` |

---

## Users

Base path: `/api/users`

| Method | Endpoint | Access | Description | Request |
|--------|----------|--------|-------------|---------|
| `GET` | `/api/users` | Admin only | Retrieve a list of all users (passwords excluded). | **Header:** `Authorization: Bearer <admin-token>` |
| `POST` | `/api/users` | Admin only | Create a new user account (typically used from the back-office). | **Body:** `{ name, email, password, role?, addresses? }` |
| `GET` | `/api/users/:id` | Protected | Retrieve details of a specific user by ID (password excluded). | **Header:** `Authorization: Bearer <token>` · **Params:** `id` |
| `PUT` | `/api/users/:id` | Protected | Update user profile. Regular users can update their own profile; admins can update any user. | **Header:** `Authorization: Bearer <token>` · **Body:** `{ name?, email?, role? (admin only), avatar?, address? }` |
| `DELETE` | `/api/users/:id` | Admin only | Permanently delete a user by ID. | **Header:** `Authorization: Bearer <admin-token>` · **Params:** `id` |
| `POST` | `/api/users/:id/addresses` | Protected | Add a new shipping address to the user's profile. | **Header:** `Authorization: Bearer <token>` · **Params:** `id` · **Body:** `{ street, city, country, postalCode, isDefault? }` |
| `PUT` | `/api/users/:id/addresses/:addressId` | Protected | Update a specific address (own address or any address if admin). | **Header:** `Authorization: Bearer <token>` · **Params:** `id, addressId` · **Body:** `{ street, city, country, postalCode, isDefault? }` |
| `DELETE` | `/api/users/:id/addresses/:addressId` | Protected | Remove a specific address from the user's profile. | **Header:** `Authorization: Bearer <token>` · **Params:** `id, addressId` |

---

## Products

Base path: `/api/products`

| Method | Endpoint | Access | Description | Request |
|--------|----------|--------|-------------|---------|
| `GET` | `/api/products` | Public | Retrieve all products. Supports pagination, filtering, sorting, and search via query parameters. | **Query:** `page?`, `limit?`, `sortOrder? (asc/desc)`, `category?`, `brand?`, `priceMin?`, `priceMax?`, `search?` |
| `POST` | `/api/products` | Admin only | Create a new product. Accepts a single object, an array (bulk), or `multipart/form-data` with an image file. | **Header:** `Authorization: Bearer <admin-token>` · **Body (JSON):** `{ name, description, price, discountPercentage?, stock?, categoryId, brandId, image }` or array · **FormData:** `name`, `description`, `price`, `discountPercentage?`, `stock?`, `categoryId`, `brandId`, `image` (file) |
| `GET` | `/api/products/:id` | Public | Retrieve a single product by ID with populated category and brand. | **Params:** `id` |
| `PUT` | `/api/products/:id` | Admin only | Update an existing product. Accepts JSON or `multipart/form-data`; supports image replacement. | **Header:** `Authorization: Bearer <admin-token>` · **Body:** `{ name?, description?, price?, discountPercentage?, stock?, categoryId?, brandId?, image? }` |
| `DELETE` | `/api/products/:id` | Admin only | Permanently delete a product by ID. | **Header:** `Authorization: Bearer <admin-token>` · **Params:** `id` |
| `POST` | `/api/products/:id/rate` | Protected | Submit or update a rating and optional comment for a product. | **Header:** `Authorization: Bearer <token>` · **Params:** `id` · **Body:** `{ rating: number (1–5), comment?: string }` |

---

## Categories

Base path: `/api/categories`

| Method | Endpoint | Access | Description | Request |
|--------|----------|--------|-------------|---------|
| `GET` | `/api/categories` | Public | Retrieve all categories (image URLs are automatically normalized). | — |
| `POST` | `/api/categories` | Admin only | Create a new category. Accepts a single object, an array (bulk), or `multipart/form-data` with an image. | **Header:** `Authorization: Bearer <admin-token>` · **Body (JSON):** `{ name, description?, image?, categoryType }` or array · **FormData:** `name`, `description?`, `categoryType`, `image` (file) |
| `GET` | `/api/categories/:id` | Protected | Retrieve details of a specific category by ID. | **Header:** `Authorization: Bearer <token>` · **Params:** `id` |
| `PUT` | `/api/categories/:id` | Admin only | Update a category. Accepts JSON or `multipart/form-data` with a new image file. | **Header:** `Authorization: Bearer <admin-token>` · **Body:** `{ name?, description?, categoryType?, image? / imgUrl? / imageUrl? }` or FormData with `image` (file) |
| `DELETE` | `/api/categories/:id` | Admin only | Permanently delete a category by ID. | **Header:** `Authorization: Bearer <admin-token>` · **Params:** `id` |

---

## Brands

Base path: `/api/brands`

| Method | Endpoint | Access | Description | Request |
|--------|----------|--------|-------------|---------|
| `GET` | `/api/brands` | Public | Retrieve a list of all brands. | — |
| `POST` | `/api/brands` | Admin only | Create a new brand. Accepts a single object, an array (bulk), or `multipart/form-data` with an image. | **Header:** `Authorization: Bearer <admin-token>` · **Body (JSON):** `{ name, description?, title?, image? }` or array · **FormData:** `name`, `description?`, `title?`, `image` (file) |
| `GET` | `/api/brands/:id` | Public | Retrieve details of a specific brand by ID. | **Params:** `id` |
| `PUT` | `/api/brands/:id` | Admin only | Update a brand. Optionally upload a new image. | **Header:** `Authorization: Bearer <admin-token>` · **Body:** `{ name?, description?, title?, image? }` or FormData with `image` (file) |
| `DELETE` | `/api/brands/:id` | Admin only | Permanently delete a brand by ID. | **Header:** `Authorization: Bearer <admin-token>` · **Params:** `id` |

---

## Orders

Base path: `/api/orders`

| Method | Endpoint | Access | Description | Request |
|--------|----------|--------|-------------|---------|
| `GET` | `/api/orders/admin` | Admin only | Retrieve all orders with user details populated (for dashboard/management use). | **Header:** `Authorization: Bearer <admin-token>` |
| `GET` | `/api/orders` | Protected | Retrieve orders for the authenticated user. Admins receive all orders. | **Header:** `Authorization: Bearer <token>` |
| `POST` | `/api/orders` | Protected | Create a new order from the cart. Decrements product stock accordingly. | **Header:** `Authorization: Bearer <token>` · **Body:** `{ orderItems?: [{ productId, name, price, quantity, image? }], shippingAddress: { street, city, country, postalCode }, paymentMethod? }` |
| `GET` | `/api/orders/:id` | Protected | Retrieve a specific order by ID with user details populated. | **Header:** `Authorization: Bearer <token>` · **Params:** `id` |
| `DELETE` | `/api/orders/:id` | Protected | Delete a specific order (subject to permission logic). | **Header:** `Authorization: Bearer <token>` · **Params:** `id` |
| `PUT` | `/api/orders/:id/status` | Protected | Update the primary order status (`pending`, `paid`, `completed`, `cancelled`, etc.). | **Header:** `Authorization: Bearer <token>` · **Body:** `{ status: string }` |
| `PUT` | `/api/orders/:id/fulfillment` | Admin only | Update the fulfillment status of an order (`pending`, `processing`, `shipped`, `delivered`). | **Header:** `Authorization: Bearer <admin-token>` · **Body:** `{ fulfillmentStatus?: string, status?: string }` |
| `PUT` | `/api/orders/:id/webhook-status` | Public (no auth) | Update order status from a webhook source (e.g., Stripe). No authentication required. | **Body:** `{ status: "pending" \| "processing" \| "shipped" \| "delivered" \| "cancelled" }` |

---

## Cart

Base path: `/api/cart`

| Method | Endpoint | Access | Description | Request |
|--------|----------|--------|-------------|---------|
| `GET` | `/api/cart` | Protected | Retrieve the current user's cart including items and total price. | **Header:** `Authorization: Bearer <token>` |
| `POST` | `/api/cart` | Protected | Add a new product to the cart or update its quantity if already present. | **Header:** `Authorization: Bearer <token>` · **Body:** `{ productId: string, quantity: number }` |
| `PUT` | `/api/cart/update` | Protected | Update the quantity of a specific product in the cart. | **Header:** `Authorization: Bearer <token>` · **Body:** `{ productId: string, quantity: number }` |
| `DELETE` | `/api/cart/:productId` | Protected | Remove a specific product from the cart. | **Header:** `Authorization: Bearer <token>` · **Params:** `productId` |
| `DELETE` | `/api/cart` | Protected | Clear the entire cart. | **Header:** `Authorization: Bearer <token>` |

---

## Wishlist

Base path: `/api/wishlist`

| Method | Endpoint | Access | Description | Request |
|--------|----------|--------|-------------|---------|
| `GET` | `/api/wishlist` | Protected | Retrieve the current user's wishlist (document and product IDs). | **Header:** `Authorization: Bearer <token>` |
| `POST` | `/api/wishlist/add` | Protected | Add a product to the wishlist. | **Header:** `Authorization: Bearer <token>` · **Body:** `{ productId: string }` |
| `DELETE` | `/api/wishlist/remove` | Protected | Remove a specific product from the wishlist. | **Header:** `Authorization: Bearer <token>` · **Body:** `{ productId: string }` |
| `POST` | `/api/wishlist/products` | Protected | Retrieve full product objects for a given list of product IDs. | **Header:** `Authorization: Bearer <token>` · **Body:** `{ productIds: string[] }` |
| `DELETE` | `/api/wishlist/clear` | Protected | Remove all products from the wishlist. | **Header:** `Authorization: Bearer <token>` |

---

## Banners

Base path: `/api/banners`

| Method | Endpoint | Access | Description | Request |
|--------|----------|--------|-------------|---------|
| `GET` | `/api/banners` | Public | Retrieve all banners (homepage and promotional). | — |
| `POST` | `/api/banners` | Admin only | Create a new banner. | **Header:** `Authorization: Bearer <admin-token>` · **Body:** `{ name, title, startFrom, image, bannerType, isActive? }` |
| `GET` | `/api/banners/:id` | Protected | Retrieve details of a specific banner by ID. | **Header:** `Authorization: Bearer <token>` · **Params:** `id` |
| `PUT` | `/api/banners/:id` | Admin only | Update a banner's name, title, image, type, or active status. | **Header:** `Authorization: Bearer <admin-token>` · **Body:** `{ name?, title?, startFrom?, image?, bannerType?, isActive? }` |
| `DELETE` | `/api/banners/:id` | Admin only | Permanently delete a banner by ID. | **Header:** `Authorization: Bearer <admin-token>` · **Params:** `id` |

---

## Payments

Base path: `/api/payments` and `/api/payment`

> **Note:** `/api/payments/...` and `/api/payment/...` are separate namespaces. The former handles Payment Intent flow; the latter handles Checkout Session flow.

| Method | Endpoint | Access | Description | Request |
|--------|----------|--------|-------------|---------|
| `POST` | `/api/payments/create-intent` | Protected | Create a Stripe Payment Intent for a specific order (card payment flow). | **Header:** `Authorization: Bearer <token>` · **Body:** `{ orderId: string, amount: number, currency?: "usd" }` |
| `POST` | `/api/payment/initiate` | Protected | Create a Stripe Checkout Session from cart/order data. Returns a redirect URL for the frontend. | **Header:** `Authorization: Bearer <token>` · **Body:** `{ amount, items[], shippingAddress }` |
| `GET` | `/api/payment/verify` | Public | Verify whether a Checkout Session was completed (used as the return URL handler). | **Query:** `session_id` (Stripe parameter) |
| `POST` | `/api/payments/webhook` | Public (Stripe) | Stripe webhook endpoint. Receives events and updates order/payment status accordingly. | **Header:** Stripe signature · **Body:** Raw Stripe event payload |

---

## Analytics

Base path: `/api/analytics`

All Analytics endpoints are restricted to **Admin only** and return aggregated data for dashboard graphs and summary cards.

| Method | Endpoint | Access | Description | Request |
|--------|----------|--------|-------------|---------|
| `GET` | `/api/analytics/overview` | Admin only | Returns a high-level overview: total users, products, orders, and revenue. | **Header:** `Authorization: Bearer <admin-token>` |
| `GET` | `/api/analytics/products` | Admin only | Returns product analytics including top-selling and low-stock items. | **Header:** `Authorization: Bearer <admin-token>` |
| `GET` | `/api/analytics/sales` | Admin only | Returns daily and monthly sales data including revenue and order counts. | **Header:** `Authorization: Bearer <admin-token>` |
| `GET` | `/api/analytics/inventory-alerts` | Admin only | Returns a list of low-stock and out-of-stock products. | **Header:** `Authorization: Bearer <admin-token>` |

---

## Stats

Base path: `/api/stats`

| Method | Endpoint | Access | Description | Request |
|--------|----------|--------|-------------|---------|
| `GET` | `/api/stats` | Admin only | Returns a dashboard summary including total users, products, orders, and revenue. | **Header:** `Authorization: Bearer <admin-token>` |

---

## Access Level Reference

| Level | Description |
|-------|-------------|
| **Public** | No authentication required. Includes registration, login, product/brand/category/banner GET endpoints, and some webhook/verify endpoints. |
| **Protected** | Requires a valid JWT token via `Authorization: Bearer <token>`. Applies to `/api/orders`, `/api/cart`, `/api/wishlist`, `/api/auth/profile`, and similar user-specific routes. |
| **Admin only** | Requires both `protect` and `admin` middleware. Applies to `/api/users` (GET/POST/DELETE), `/api/products` (POST/PUT/DELETE), `/api/brands` (POST/PUT/DELETE), `/api/categories` (POST/PUT/DELETE), `/api/analytics/*`, `/api/stats`, `/api/orders/admin`, and related routes. |
