# Technical Specification (TechSpec) - Roadmappers

## 1. System Architecture
Roadmappers is built as a unified full-stack application using **Next.js (App Router)**. Authentication and payment fulfillment are outsourced to **Whop.com**, which interacts with the server via OAuth callbacks and Webhooks.

```
┌─────────────────────────┐               ┌─────────────────────────┐
│       Whop.com          ├──────────────►│    Next.js Webhook      │
│  (Payments & Checkout)  │   Webhooks    │   (/api/webhook/whop)   │
└───────────┬─────────────┘               └────────────┬────────────┘
            │                                          │
            │ OAuth 2.1                                │ Updates Access
            ▼                                          ▼
┌─────────────────────────┐               ┌─────────────────────────┐
│     Next.js Client      ├──────────────►│  Local SQLite Database  │
│  (Next.js App Router)   │  Drizzle ORM  │      (dev.db file)      │
└─────────────────────────┘               └─────────────────────────┘
```

---

## 2. Technology Choices & Rationale
- **Framework:** Next.js 14+ (App Router). Serves both the interactive student workspace and backend API Route Handlers.
- **Database:** **SQLite** (local file-based db). Lightweight, zero-configuration, and runs directly inside the server environment.
- **ORM:** **Drizzle ORM** for type-safe database queries.
- **Authentication:** **Whop OAuth 2.1**. Users log in using their Whop account. The application manages access via local session cookies mapped to the Whop user ID.
- **Fulfillment:** **Whop Webhooks**. When a user purchases a course pass on Whop, Whop fires a POST request to `/api/webhook/whop` to instantly unlock access.
- **Styling:** **Tailwind CSS v4** + **Shadcn UI** for mobile/iPad responsive layouts.
- **Video Infrastructure:** Bunny.net Stream (for adaptive HLS playback) or integrated responsive HTML5 video with custom touch controls.

---

## 3. Responsive & Mobile-First Design
- **Responsive Breakpoints:** Strict adherence to Tailwind mobile-first design (`sm:`, `md:`, `lg:`). Default styling is optimized for mobile touch targets, scaling up for iPad (portrait & landscape) and desktop.
- **Touch Targets:** Interactive elements (buttons, checkboxes, nodes) have a minimum dimension of `48px x 48px` to facilitate thumb/finger tapping.
- **Layouts:** Use of flexbox grids that wrap automatically on narrower displays. The course video player is responsive (fixed aspect ratio `aspect-video`), expanding to fill the screen width on mobile devices.
- **Navigation:** Bottom navigation bar or hamburger side-drawer on mobile/iPad; full sidebar layout on desktop.

---

## 4. Key Endpoints & Route Handlers

### 4.1. Authentication (OAuth 2.1)
- **Login Endpoint (`/api/auth/whop/login`):** Redirects the user to Whop's OAuth authorization page.
- **Callback Endpoint (`/api/auth/whop/callback`):** 
  - Receives the authorization code from Whop.
  - Exchanges it for an access token via POST request to Whop.
  - Fetches the user profile from Whop (`https://api.whop.com/v1/me`).
  - Creates or updates the user in the SQLite `users` table.
  - Signs the user in using a local cookie-based session token.

### 4.2. Webhook Endpoint (`/api/webhook/whop`)
- Listens to POST requests from Whop.
- **Validation:** Verifies the `X-Whop-Signature` header against the local `WHOP_WEBHOOK_SECRET` to ensure authenticity.
- **Events handled:**
  - `membership.activated` / `membership.went_active`: Decodes the user's Whop ID and the product ID purchased. Inserts/updates an `enrollments` record setting status to `active`.
  - `membership.deactivated` / `membership.went_inactive`: Updates the student's `enrollments` status to `inactive` (suspending access).

### 4.3. Quizzes & Placement (Server Actions)
- `submitQuizAnswers(quizId, answers)`: Grades the quiz, stores the score, and checks if the student's average score exceeds **85%**. If so, adds the student to the `talent_roster` table.

---

## 5. Security & Verification
- **Webhook Security:** Webhooks use HMAC-SHA256 signature verification.
- **Session Verification:** Checked in `middleware.ts` for protected routes (`/dashboard`, `/creator`).
- **Data Access:** Next.js Server Actions verify that the user's logged-in session ID has permission to access or edit the requested resource (e.g. students cannot edit courses).
