# VAYORA — Travel & Tourism Management System
> *"Travel beyond the ordinary."*

**Academic Project Title:** Travel and Tourism Management System  
**Architecture:** Full-Stack MERN (React.js, Node.js, Express.js, MongoDB)  
**Authentication:** JSON Web Tokens (JWT) & bcryptjs  
**Styling & UI:** Tailwind CSS, Framer Motion, Lucide React  

---

## 1. Project Overview

**VAYORA** is an end-to-end, production-grade travel and tourism management web application designed for both discerning travelers and tourism operators. It enables travelers to discover global and Indian destinations, explore curated travel packages, inspect luxury hotel accommodations, book experiences, build custom day-by-day itineraries with a rule-based trip planner, make real bookings with an academic-safe demo payment gateway, and manage their trips through a comprehensive user dashboard.

For administrators, VAYORA offers an integrated **Admin Portal** providing operational analytics, revenue metrics, and full CRUD (Create, Read, Update, Delete) management across destinations, packages, hotels, activities, bookings, user roles, and reviews.

---

## 2. Key Features

### 🌟 Public Travel Discovery
- **Hero & Curated Discovery:** Real-time search by location, travel dates, and traveler count with curated destinations and packages.
- **Destinations Portal (`/destinations`, `/destinations/:id`):** 16+ Indian and international destinations (Goa, Kashmir, Kerala, Ladakh, Jaipur, Udaipur, Manali, Rishikesh, Bali, Maldives, Paris, Switzerland, Dubai, Japan, etc.) with category filtering, budget ranges, and ratings.
- **Travel Packages (`/packages`, `/packages/:id`):** Multi-day tour packages complete with day-by-day itineraries, inclusions, exclusions, and booking options.
- **Hotels & Resorts (`/hotels`, `/hotels/:id`):** Luxury accommodations with room selection, check-in/out date calculations, and amenity highlights.
- **Activities & Experiences (`/activities`):** Adventure, culture, nature, romantic, and sightseeing excursions with price per participant.
- **Rule-Based Trip Planner (`/trip-planner`):** Dynamic multi-day itinerary generator based on selected destination, duration, budget, and travel interests with direct MongoDB persistence into user dashboards.

### 🔐 Authentication & Role-Based Access Control
- **JWT Authentication:** Secure stateless session handling via HTTP headers (`Bearer <token>`).
- **Password Security:** Salted hashing with `bcryptjs` (passwords are never stored in plaintext).
- **Roles:** Strict segregation between standard travelers (`USER`) and administrators (`ADMIN`).
- **Quick-Fill Demo Access:** Convenient 1-click credential autofill buttons on the login page for effortless evaluation.

### 💳 Real Booking System & Payment Simulator
- **Dynamic Price Calculations:** Calculations are performed in real-time based on travelers, nights, room types, and activity costs.
- **Safe Academic Payment Flow:** Simulated gateway supporting **UPI / QR**, **Credit / Debit Cards**, and **Net Banking** with animated transaction processing and zero real financial risk.
- **Persistent Booking Lifecycle:** Each booking generates a unique tracking code (e.g., `VAY-886092649`) and payment ID (`PAY-DEMO-XXXXXXX`) stored in MongoDB.
- **Instant Printable Invoice (`/booking/confirmation/:id`):** Features celebratory animations, complete traveler breakdown, and a browser-printable invoice view.
- **Self-Service Cancellation:** Travelers can cancel their bookings directly from their dashboard, triggering real-time database status updates to `Cancelled` and `Refunded`.

### 🧭 User Dashboard (`/dashboard`)
- **Overview:** Active travel stats, upcoming trip alerts, recent booking history, and quick navigation.
- **My Bookings (`/dashboard/bookings`):** Tabbed views for upcoming, completed, and cancelled reservations with cancellation controls.
- **Custom Trips (`/dashboard/trips`):** View saved custom itineraries generated from the Trip Planner.
- **Wishlist (`/dashboard/wishlist`):** MongoDB-synchronized bookmarking for destinations, packages, hotels, and activities.
- **My Reviews (`/dashboard/reviews`):** Verified ratings and reviews submitted by the traveler.
- **Profile & Settings (`/dashboard/profile`):** Update personal details, contact info, travel preferences, and password.

### 🛡️ Admin Portal (`/admin`)
- **Operational Analytics:** Metric cards for Total Revenue, Total Bookings, Users, Destinations, Hotels, and monthly revenue trends.
- **Destinations CRUD:** Add, edit, or delete destinations with image arrays, attractions, and pricing.
- **Packages CRUD:** Manage tour packages, itineraries, inclusions, and capacities.
- **Hotels & Accommodations CRUD:** Manage properties, room categories, pricing, and amenities.
- **Activities CRUD:** Add and edit outdoor activities, durations, and pricing.
- **Booking Management:** View all user reservations, update booking status (`Confirmed`, `Pending`, `Completed`, `Cancelled`), or issue refunds.
- **User Management:** Monitor registered travelers, toggle roles between `USER` and `ADMIN`.
- **Review Moderation:** Moderate user reviews and maintain community guidelines.

---

## 3. Technology Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v3 (Custom color tokens: Deep Navy, Ocean Teal, Warm Sunset, Charcoal)
- **Icons:** Lucide React
- **Animations:** Framer Motion & Canvas-Confetti
- **HTTP Client:** Axios (Configured with authorization request interceptors)

### Backend
- **Runtime:** Node.js (v20+ / v24+)
- **Framework:** Express.js (RESTful architecture)
- **Database ORM:** Mongoose (Schema validation, indexes, and virtuals)
- **Security:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`

### Database
- **Primary:** MongoDB (Local or Atlas via `MONGODB_URI`)
- **Zero-Config In-Memory Engine:** Built-in automatic fallback to `mongodb-memory-server` if no local MongoDB instance is running, ensuring the project starts immediately on any machine!

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (React.js)                     │
│  Tailwind CSS  │  Framer Motion  │  Lucide  │  React Router │
└──────────────────────────────┬──────────────────────────────┘
                               │
                      Axios HTTP Requests
                   (Bearer JWT Authorization)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js REST API                      │
│   Middleware: JWT Auth Guard, Role Guard, Input Validation  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                       Mongoose Models
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Database Layer                    │
│   Users │ Destinations │ Packages │ Hotels │ Activities     │
│   Bookings │ Reviews │ Wishlist │ Trips │ Itineraries       │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Folder Structure

```
VAYORA/
├── package.json               # Root scripts (unified start, install, seed, test)
├── README.md                  # Project documentation
│
├── client/                    # React + Vite Frontend
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js     # VAYORA brand design tokens
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx           # App entry point
│       ├── App.jsx            # Route definitions & guards
│       ├── index.css          # Tailwind base & custom styles
│       ├── api/
│       │   └── client.js      # Axios instance with auth interceptors
│       ├── context/
│       │   ├── AuthContext.jsx       # User session & 1-click login
│       │   ├── WishlistContext.jsx   # Live database wishlist sync
│       │   └── ToastContext.jsx      # Non-blocking notification toasts
│       ├── components/
│       │   ├── Navbar.jsx            # Responsive navigation & role menus
│       │   ├── Footer.jsx            # Brand footer
│       │   ├── ProtectedRoute.jsx    # User & Admin route guards
│       │   ├── DestinationCard.jsx
│       │   ├── PackageCard.jsx
│       │   ├── HotelCard.jsx
│       │   ├── ActivityCard.jsx
│       │   ├── BookingModal.jsx      # 2-step dynamic calculation & demo payment gateway
│       │   └── ReviewModal.jsx       # Star rating and review submission
│       ├── layouts/
│       │   ├── DashboardLayout.jsx   # User dashboard navigation wrapper
│       │   └── AdminLayout.jsx       # Admin portal sidebar wrapper
│       ├── pages/
│       │   ├── Home.jsx              # Hero, search, popular highlights
│       │   ├── Destinations.jsx      # Search, filter & cards
│       │   ├── DestinationDetail.jsx # Detailed view with linked packages & hotels
│       │   ├── Packages.jsx          # Tour package catalogue
│       │   ├── PackageDetail.jsx     # Itinerary & instant booking
│       │   ├── Hotels.jsx            # Hotel directory
│       │   ├── HotelDetail.jsx       # Room selector & reservations
│       │   ├── Activities.jsx        # Experiences & adventures
│       │   ├── TripPlanner.jsx       # Rule-based custom itinerary generator
│       │   ├── Login.jsx             # Sign-in with quick-fill demo buttons
│       │   ├── Register.jsx          # New user registration
│       │   ├── ForgotPassword.jsx    # Reset password simulation
│       │   ├── BookingConfirmation.jsx # Printable receipt & invoice
│       │   ├── dashboard/            # User Dashboard pages
│       │   │   ├── DashboardOverview.jsx
│       │   │   ├── MyBookings.jsx
│       │   │   ├── MyTrips.jsx
│       │   │   ├── WishlistPage.jsx
│       │   │   ├── MyReviews.jsx
│       │   │   └── Profile.jsx
│       │   └── admin/                # Admin Portal pages
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminDestinations.jsx
│       │       ├── AdminPackages.jsx
│       │       ├── AdminHotels.jsx
│       │       ├── AdminActivities.jsx
│       │       ├── AdminBookings.jsx
│       │       ├── AdminUsers.jsx
│       │       └── AdminReviews.jsx
│       └── utils/
│           └── formatters.js         # Currency (INR) and date formatters
│
└── server/                    # Node.js + Express Backend
    ├── server.js              # Express app bootstrap & route registration
    ├── test-flows.js          # Automated end-to-end test suite
    ├── config/
    │   └── db.js              # MongoDB connection & auto-memory fallback
    ├── data/
    │   └── seedData.js        # Realistic seed dataset (16 dests, 21 pkgs, 16 hotels, 22 acts)
    ├── scripts/
    │   └── seed.js            # Standalone database population script
    ├── models/
    │   ├── User.js
    │   ├── Destination.js
    │   ├── Package.js
    │   ├── Hotel.js
    │   ├── Activity.js
    │   ├── Booking.js
    │   ├── Review.js
    │   ├── Wishlist.js
    │   └── Trip.js
    ├── middleware/
    │   ├── auth.js            # JWT verification & admin guard
    │   └── errorHandler.js    # Centralized HTTP error handler
    ├── controllers/
    │   ├── authController.js
    │   ├── destinationController.js
    │   ├── packageController.js
    │   ├── hotelController.js
    │   ├── activityController.js
    │   ├── bookingController.js
    │   ├── reviewController.js
    │   ├── wishlistController.js
    │   ├── tripController.js
    │   └── adminController.js
    └── routes/
        ├── authRoutes.js
        ├── destinationRoutes.js
        ├── packageRoutes.js
        ├── hotelRoutes.js
        ├── activityRoutes.js
        ├── bookingRoutes.js
        ├── reviewRoutes.js
        ├── wishlistRoutes.js
        ├── tripRoutes.js
        └── adminRoutes.js
```

---

## 6. Demo Credentials

For quick evaluation, pre-seeded accounts are provided with convenient 1-click login buttons on `/login`:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@vayora.com` | `Admin@123` | Full Admin Portal (`/admin`), Analytics & CRUD |
| **Traveler** | `demo@vayora.com` | `Demo@123` | Bookings, Wishlist, Custom Trips, Reviews |
| **Traveler 2** | `riya.sharma@example.com` | `Travel@123` | Additional traveler account |

---

## 7. Installation & Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Option A: Unified 1-Command Startup (Recommended)

1. Clone or navigate into the repository root:
   ```bash
   cd VAYORA
   ```

2. Install all dependencies across root, server, and client:
   ```bash
   npm run install:all
   ```

3. Start both backend and frontend concurrently:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   - **Frontend App:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)

---

### Option B: Separate Terminal Startup

**Terminal 1 — Backend Server:**
```bash
cd server
npm install
npm run dev
```
*(Listening on http://localhost:5000)*

**Terminal 2 — Frontend Client:**
```bash
cd client
npm install
npm run dev
```
*(Listening on http://localhost:5173)*

---

## 8. Database Seeding

The backend includes an automatic bootstrap feature that detects an empty database and seeds it automatically upon boot.

If you ever wish to manually re-seed or reset your database, run:
```bash
npm run seed
```
*(or from within `/server`: `node scripts/seed.js`)*

### Seed Data Summary:
- **16 Destinations** (Goa, Kashmir, Kerala, Ladakh, Jaipur, Udaipur, Manali, Rishikesh, Bali, Maldives, Paris, Switzerland, Dubai, Singapore, Tokyo, Sydney)
- **21 Travel Packages** with daily itineraries, pricing, and inclusions
- **16 Luxury Hotels & Resorts** with room options and amenities
- **22 Activities** (Scuba diving, paragliding, desert safari, hot air balloon, Gondola ride, etc.)
- **Demo Bookings, Reviews, Saved Trips & Wishlist items**

---

## 9. Automated Testing & Verification

VAYORA includes an automated end-to-end integration test suite verifying all 31 critical subsystem contracts:

```bash
npm test
```
*(or from `/server`: `node test-flows.js`)*

### Test Suite Execution Output:
```text
====================================================
🚀 STARTING VAYORA END-TO-END SYSTEM VALIDATION
====================================================

--- 1. Testing Destinations API ---
✅ [PASS] Destinations endpoint returns 200
✅ [PASS] Loaded 16 destinations (Expected >= 15)
✅ [PASS] Fetched destination detail for "Maldives"

--- 2. Testing Travel Packages API ---
✅ [PASS] Packages endpoint returns 200
✅ [PASS] Loaded 21 travel packages (Expected >= 20)
✅ [PASS] Fetched package detail for "Kashmir Paradise: Srinagar, Gulmarg & Pahalgam"

--- 3. Testing Hotels API ---
✅ [PASS] Hotels endpoint returns 200
✅ [PASS] Loaded 16 hotels (Expected >= 15)
✅ [PASS] Fetched hotel detail for "The Khyber Himalayan Resort & Spa"

--- 4. Testing Activities API ---
✅ [PASS] Activities endpoint returns 200
✅ [PASS] Loaded 22 activities (Expected >= 20)

--- 5. Testing Demo User Authentication ---
✅ [PASS] Demo user login succeeded
✅ [PASS] Received JWT token for demo user
✅ [PASS] GET /auth/me returns demo traveler profile

--- 6. Testing Admin Authentication & Dashboard API ---
✅ [PASS] Admin login succeeded
✅ [PASS] Admin user has role ADMIN
✅ [PASS] Admin dashboard metrics retrieved successfully
✅ [PASS] Admin sees 3 registered users
✅ [PASS] Admin sees 16 destinations

--- 7. Testing Real Booking System & Payment Storage ---
✅ [PASS] Booking created with HTTP 201
✅ [PASS] Generated unique booking ID: VAY-922078189
✅ [PASS] Payment status marked as Paid
✅ [PASS] Total amount dynamically verified: ₹55998
✅ [PASS] Created booking is listed in user bookings

--- 8. Testing Wishlist API ---
✅ [PASS] Added destination "Maldives" to wishlist
✅ [PASS] Wishlist contains the added destination
✅ [PASS] Successfully removed destination from wishlist

--- 9. Testing Trip Planner Save & Retrieve ---
✅ [PASS] Custom trip itinerary saved to database
✅ [PASS] Custom trip shows up in /trips

--- 10. Testing Review Submission ---
✅ [PASS] Review submitted successfully

--- 11. Testing Booking Cancellation ---
✅ [PASS] Booking status transitioned to Cancelled in DB

====================================================
🎉 ALL 31/31 END-TO-END VALIDATION CHECKS PASSED!
====================================================
```

---

## 10. API Specification Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create a new traveler account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve active profile (Auth required)
- `PUT /api/auth/profile` — Update traveler details & preferences
- `PUT /api/auth/password` — Change password

### Destinations (`/api/destinations`)
- `GET /api/destinations` — Search, filter by price/category/rating
- `GET /api/destinations/:id` — Detail view with linked packages & hotels
- `POST /api/destinations` — Create destination (Admin only)
- `PUT /api/destinations/:id` — Update destination (Admin only)
- `DELETE /api/destinations/:id` — Delete destination (Admin only)

### Packages (`/api/packages`)
- `GET /api/packages` — Browse travel packages
- `GET /api/packages/:id` — Detailed package itinerary & reviews
- `POST /api/packages` — Create package (Admin only)
- `PUT /api/packages/:id` — Update package (Admin only)
- `DELETE /api/packages/:id` — Delete package (Admin only)

### Hotels (`/api/hotels`)
- `GET /api/hotels` — Search hotels & resorts
- `GET /api/hotels/:id` — View rooms, pricing & amenities
- `POST /api/hotels` — Create hotel (Admin only)
- `PUT /api/hotels/:id` — Update hotel (Admin only)
- `DELETE /api/hotels/:id` — Delete hotel (Admin only)

### Activities (`/api/activities`)
- `GET /api/activities` — Explore experiences
- `GET /api/activities/:id` — View experience details
- `POST /api/activities` — Create experience (Admin only)
- `PUT /api/activities/:id` — Update experience (Admin only)
- `DELETE /api/activities/:id` — Delete experience (Admin only)

### Bookings (`/api/bookings`)
- `POST /api/bookings` — Create verified booking with simulated payment
- `GET /api/bookings/my` — Fetch current user's reservations
- `GET /api/bookings/:id` — Fetch booking details & printable invoice
- `PUT /api/bookings/:id/cancel` — Cancel reservation with status update

### Wishlist & Trips (`/api/wishlist`, `/api/trips`)
- `GET /api/wishlist` — Get user's saved wishlist
- `POST /api/wishlist` — Save destination/hotel/package/activity
- `DELETE /api/wishlist/:id` — Remove item from wishlist
- `GET /api/trips` — Fetch saved custom itineraries
- `POST /api/trips` — Save rule-based generated trip plan
- `DELETE /api/trips/:id` — Remove saved trip

### Admin Operations (`/api/admin`)
- `GET /api/admin/dashboard` — Platform revenue and booking analytics
- `GET /api/admin/users` — List registered users
- `PUT /api/admin/users/:id/role` — Update user permissions (`USER` / `ADMIN`)
- `GET /api/admin/bookings` — Access all customer reservations
- `PUT /api/admin/bookings/:id/status` — Modify booking state
- `GET /api/admin/reviews` — Manage and moderate customer reviews
- `DELETE /api/admin/reviews/:id` — Remove review

---

## 11. Academic Evaluation Checklist

| Requirement | Implementation Status | Verification |
| :--- | :--- | :--- |
| **Real Working Full-Stack** | ✅ Complete | Node.js + Express API + React 19 Frontend + MongoDB |
| **Zero Mock / Fake Data UI** | ✅ Complete | All cards, lists, bookings, and forms talk directly to backend |
| **JWT & Password Security** | ✅ Complete | bcryptjs password hashing + stateless JWT verification |
| **Destinations & Packages** | ✅ Complete | 16+ Destinations, 21+ Packages, 16+ Hotels, 22+ Activities |
| **Dynamic Trip Planner** | ✅ Complete | Rule-based multi-day itinerary builder saving to MongoDB |
| **Dynamic Booking & Total** | ✅ Complete | Live calculation per traveler/night + demo payment simulator |
| **Printable Invoice** | ✅ Complete | Confirmation screen with clean print-friendly invoice |
| **Dashboard Management** | ✅ Complete | Tabbed user dashboard with active cancellation flow |
| **Admin Analytics & CRUD** | ✅ Complete | Dedicated Admin portal with stats, table CRUD, and role toggling |
| **Zero-Error Local Startup** | ✅ Complete | Auto-seeding + in-memory MongoDB fallback + clean build |

---

## 12. License
Academic Project developed for demonstration and educational purposes.  
**VAYORA** — *Travel beyond the ordinary.*
