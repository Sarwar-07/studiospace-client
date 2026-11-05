# StudioSpace | Creative Workspace Marketplace (Client)

A modern full-stack creative workspace marketplace frontend built with **Next.js (App Router)**, **Tailwind CSS**, and **Firebase Authentication**. StudioSpace bridges photo directors, podcast hosts, sound designers, and visual creators with rentable studios, sound booths, and production stages.

---

## Live Links & Repositories

- **Live Client Application:** [studiospace-client.vercel.app](https://studiospace-client.vercel.app) *(Update with your production Vercel URL)*
- **Server API Repository:** [https://github.com/Sarwar-07/studiospace-server](https://github.com/Sarwar-07/studiospace-server)
- **Client Repository:** [https://github.com/Sarwar-07/studiospace-client](https://github.com/Sarwar-07/studiospace-client)

---

## Core Features & Challenge Solutions

1. **Secure Session Shielding (JWT & HTTPOnly Cookies):**
   - Seamlessly integrates Firebase Auth on the client with Express session tokens passed via secure `credentials: 'include'` cookies.
   - Guarded private routes for Studio creation, booking management, listings control, and user wishlists.

2. **Automated Double-Booking Prevention UI:**
   - Dedicated interactive date and time range slot selector.
   - Real-time client-side duration and cost calculations (hourly rate × reserved hours + security deposit).
   - Catches server `409 Conflict` collision responses and warns users immediately if an overlapping schedule already exists on that date.

3. **Dashboard Analytics & Aggregations:**
   - Visual KPI overview consuming backend MongoDB `$group` and `$lookup` aggregations.
   - Real-time tracking of created listings, active bookings, saved spaces, and total production expenditure.

4. **Client-Side PDF Invoicing:**
   - Instant vector PDF receipt and invoice generation via `jspdf` and `jspdf-autotable`.
   - Includes booking reference ID, creator credentials, schedule timestamps, and financial itemization.

5. **Dynamic Search, Filtering & Multi-Theme UI:**
   - Real-time search by space name and city location.
   - Discipline filtering (Photo Studios, Recording Booths, Film Stages, Podcast Suites, Art Lofts) with client-side sorting by rate and rating.
   - Light and dark theme toggle powered by `next-themes` with hydration mismatch guards.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS, Lucide React icons
- **Authentication:** Firebase Auth (Email/Password & Google Sign-In)
- **State & Alerts:** React Context API, Sonner Toast Notifications
- **Sliders & Carousels:** Swiper.js
- **Document Generation:** jsPDF & jspdf-autotable
- **Theme:** next-themes

---

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Sarwar-07/studiospace-client.git](https://github.com/Sarwar-07/studiospace-client.git)
   cd studiospace-client