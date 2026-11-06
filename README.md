# StudioSpace | Creative Workspace Marketplace (Client)

A modern full-stack creative workspace marketplace frontend built with **Next.js (App Router)**, **Tailwind CSS**, and **Firebase Authentication**. StudioSpace bridges photo directors, podcast hosts, sound designers, and visual creators with rentable studios, sound booths, and production stages.

---

## Live Links & Repositories

- **Live Client Application:** [https://studiospace-client-eta-six.vercel.app](https://studiospace-client-eta-six.vercel.app)
- **Live Server API:** [https://studiospace-server-livid.vercel.app](https://studiospace-server-livid.vercel.app)
- **Client Repository:** [https://github.com/Sarwar-07/studiospace-client](https://github.com/Sarwar-07/studiospace-client)
- **Server Repository:** [https://github.com/Sarwar-07/studiospace-server](https://github.com/Sarwar-07/studiospace-server)

---

## 🔑 Demo Host Credentials (Evaluator Testing)
All 12 pre-seeded studio spaces across various creative disciplines are linked to this host account:
- **Host Email:** `svenbrunner000@gmail.com`
- **Access:** Sign in with Email/Password or continue via Google OAuth / new registration.

---

## Core Features & Challenge Solutions

1. **Secure Session Shielding (JWT & HTTPOnly Cookies):**
   - Seamlessly integrates Firebase Auth on the client with Express session tokens passed via secure `credentials: 'include'` cookies or `Authorization: Bearer <token>` headers.
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
   git clone https://github.com/Sarwar-07/studiospace-client.git
   cd studiospace-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
