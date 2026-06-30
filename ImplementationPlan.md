# Implementation Plan - Roadmappers

## 1. Overview
This step-by-step roadmap guides the construction of the Roadmappers MVP with integrated **Whop.com** authentication and payment fulfillment. The development is divided into 4 sequential milestones.

---

## 2. Milestones & Task Breakdown

### Milestone 1: Database & Auth Setup (Est. Cost: 15,000 EGP)
Set up the workspace, local database, schema definition, and Whop OAuth login flow.
- [ ] **Task 1.1:** Initialize Next.js project using Tailwind CSS v4 in the workspace root.
- [ ] **Task 1.2:** Install Drizzle ORM, Drizzle Kit, and SQLite packages (`better-sqlite3` or similar Node-native driver).
- [ ] **Task 1.3:** Create Drizzle schema definitions matching `Schema.md` and run the initial migration to generate `dev.db`.
- [ ] **Task 1.4:** Register an application in the Whop Developer Dashboard and set up local environment variables (`WHOP_CLIENT_ID`, `WHOP_CLIENT_SECRET`, `WHOP_REDIRECT_URI`).
- [ ] **Task 1.5:** Implement Next.js API Route Handlers for Whop OAuth: `/api/auth/whop/login` and `/api/auth/whop/callback`.
- [ ] **Task 1.6:** Code Next.js Middleware to verify local session cookies mapped to the logged-in Whop user.

### Milestone 2: Course Catalog & Video Player (Est. Cost: 20,000 EGP)
Develop the core dashboard layout, the 3-question diagnostic survey, the course details screen, and the HLS video player.
- [ ] **Task 2.1:** Design a mobile-first navigation structure (bottom navigation bar on mobile/iPad; persistent sidebar on desktop).
- [ ] **Task 2.2:** Build the 3-question onboarding diagnostic survey screen using a responsive wizard with touch-optimized radio selectors.
- [ ] **Task 2.3:** Implement course details layout featuring vertical responsive timeline nodes for roadmap steps.
- [ ] **Task 2.4:** Build the media player component supporting responsive layouts (aspect-video ratio) with clean touch overlays.
- [ ] **Task 2.5:** Program the step completion checklist action, connecting it to the database to persist progress dynamically.

### Milestone 3: Quiz Engine & Talent List (Est. Cost: 12,000 EGP)
Create the quiz framework, verification threshold calculations, and the admin job placement roster.
- [ ] **Task 3.1:** Implement the quiz questionnaire UI, displaying a clean mobile-friendly single-question-at-a-time slide view.
- [ ] **Task 3.2:** Write the Server Action to process answers, calculate final scores, and log results in the `quiz_attempts` table.
- [ ] **Task 3.3:** Code the automatic trigger that logs students scoring >85% into the `talent_roster` table.
- [ ] **Task 3.4:** Create the Admin Talent Roster page, enabling admins to view scores and manage recruitment prospects.

### Milestone 4: Whop Webhooks & Launch (Est. Cost: 8,000 EGP)
Build the automated Whop fulfillment endpoint, mentor splits, and execute final responsive layout testing.
- [ ] **Task 4.1:** Build the Whop webhook API Route Handler at `/api/webhook/whop` to receive POST requests.
- [ ] **Task 4.2:** Implement HMAC-SHA256 signature verification validating the incoming `X-Whop-Signature` header.
- [ ] **Task 4.3:** Program the database fulfillment log for `membership.activated` (unlock access) and `membership.deactivated` (lock access).
- [ ] **Task 4.4:** Construct the Admin financial sheet displaying course sales based on webhook logs, calculating mentor splits offline.
- [ ] **Task 4.5:** Perform full device emulation testing (iPhone, iPad Portrait, iPad Landscape) to verify layout compliance and touch target integrity.
