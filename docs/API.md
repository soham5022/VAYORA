# VAYORA REST API Documentation

**Product:** VAYORA — Travel beyond the ordinary.  
**Academic Title:** Travel and Tourism Management System  
**Version:** 2.0.0 Production Architecture  
**Base URL:** `http://localhost:5000/api` or `https://your-domain.com/api`

---

## 1. Authentication & User Management (`/api/auth`, `/api/users`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register customer account with email verification dispatch |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT token |
| `GET` | `/api/auth/verify-email/:token` | Public | Verify user email address |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset token |
| `POST` | `/api/auth/reset-password/:token` | Public | Reset password using valid token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| `PUT` | `/api/auth/profile` | Authenticated | Update user name, phone, preferences, avatar |
| `PUT` | `/api/auth/password` | Authenticated | Change current password |
| `GET` | `/api/users` | Admin | List all registered users |
| `PUT` | `/api/users/:id/role` | Admin | Change user role (`CUSTOMER`, `VENDOR`, `ADMIN`) |
| `DELETE`| `/api/users/:id` | Admin | Delete user account |

---

## 2. Catalog & Discovery (`/api/destinations`, `/api/packages`, `/api/hotels`, `/api/activities`)

| Method | Endpoint | Access | Query Parameters | Description |
|---|---|---|---|---|
| `GET` | `/api/destinations` | Public | `search`, `category`, `sort`, `featured` | Filter & retrieve destinations |
| `GET` | `/api/destinations/:id` | Public | - | Destination detail with linked hotels & packages |
| `GET` | `/api/packages` | Public | `search`, `destination`, `duration`, `maxPrice`, `sort` | Filter & retrieve holiday packages |
| `GET` | `/api/packages/:id` | Public | - | Package detail with day-by-day itinerary |
| `GET` | `/api/hotels` | Public | `search`, `amenity`, `maxPrice`, `sort` | Filter & retrieve boutique hotels |
| `GET` | `/api/hotels/:id` | Public | - | Hotel detail with room tiers & nightly rates |
| `GET` | `/api/activities` | Public | `search`, `category`, `sort` | Filter & retrieve curated experiences |
| `GET` | `/api/activities/:id` | Public | - | Activity detail with duration & inclusions |

---

## 3. Booking Engine & Pricing (`/api/bookings`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | Authenticated | Create booking with server-side price calculation, 5% GST, 2.5% fee, coupon validation |
| `GET` | `/api/bookings/my` | Authenticated | List all bookings of authenticated user |
| `GET` | `/api/bookings/:id` | Authenticated | Single booking details |
| `GET` | `/api/bookings/:id/invoice`| Authenticated | Structured official tax invoice & voucher data |
| `PUT` | `/api/bookings/:id/cancel` | Authenticated | Cancel booking with policy-driven automated refund |

---

## 4. Payment Gateway Integration (`/api/payments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/payments/create-order` | Authenticated | Initialize Razorpay payment order (`amount`, `currency`) |
| `POST` | `/api/payments/verify` | Authenticated | Verify HMAC SHA-256 signature and mark booking paid |
| `POST` | `/api/payments/webhook` | Public | Handle payment gateway webhook callbacks |

---

## 5. Coupon System (`/api/coupons`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/coupons/validate` | Public/Auth | Validate promo code against order total |
| `GET` | `/api/coupons` | Admin | List all created coupons |
| `POST` | `/api/coupons` | Admin | Create new coupon with percentage or fixed discount |
| `PUT` | `/api/coupons/:id` | Admin | Update coupon validity or limits |
| `DELETE`| `/api/coupons/:id` | Admin | Delete coupon |

---

## 6. Smart Trip Planner (`/api/trips`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/trips` | Authenticated | List saved personalized itineraries |
| `POST` | `/api/trips` | Authenticated | Save custom generated itinerary to MongoDB |
| `GET` | `/api/trips/:id` | Authenticated | Retrieve specific saved trip |
| `DELETE`| `/api/trips/:id` | Authenticated | Delete saved trip |

---

## 7. Partner / Vendor Portal (`/api/vendors`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/vendors/register` | Authenticated | Apply/Register as travel supplier |
| `GET` | `/api/vendors/dashboard` | Vendor/Admin | View vendor earnings, active listings, partner rating |
| `PUT` | `/api/vendors/:id/status`| Admin | Moderate vendor approval status |

---

## 8. Editorial & Knowledge Base (`/api/blog`, `/api/faqs`, `/api/contact`, `/api/settings`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/blog` | Public | List travel stories and guides |
| `GET` | `/api/blog/:slug` | Public | Read full article by slug or ID |
| `POST` | `/api/blog` | Admin | Author new travel story |
| `GET` | `/api/faqs` | Public | Search categorized FAQs |
| `POST` | `/api/contact` | Public | Submit travel inquiry |
| `GET` | `/api/contact` | Admin | View customer inquiries |
| `GET` | `/api/settings` | Public | View platform settings |
| `PUT` | `/api/settings` | Admin | Update platform settings |
| `GET` | `/api/health` | Public | Service health probe |
