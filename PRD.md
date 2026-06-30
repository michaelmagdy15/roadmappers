# Product Requirement Document (PRD) - Roadmappers

## 1. Overview
Roadmappers is an educational platform designed to connect mentors who create and upload courses with students looking for structured learning paths. The platform uses a 3-question diagnostic onboarding survey to guide students to the best courses, hosts high-performance video lectures, tests understanding through quizzes, and matches top-performing students (>85%) with job placements.

Roadmappers integrates directly with **Whop.com** to handle all authentication (via Whop OAuth) and automated product delivery (via Whop Webhooks). When a student buys a course or subscription on Whop.com, their access is instantly provisioned in Roadmappers.

---

## 2. Core Goals & Value Proposition
- **For Mentors:** Easily upload course content (lectures, quizzes) and earn a revenue split. Product catalog configuration, checkouts, and invoicing are handled securely by Whop.com.
- **For Students:** Log in instantly via Whop OAuth, find the right learning path via a quick diagnostic survey, watch secure high-quality video streams, complete quizzes, and unlock career placements by scoring >85%.
- **For Admins:** Manage the top-tier "Talent Roster" for job placements, and handle mentor splits offline using Whop sale reports.

---

## 3. User Personas
1. **Student:** Log in via Whop, takes quizzes, tracks progress, and aims for job placement.
2. **Mentor:** Uploads courses and quizzes to Roadmappers; manages pricing on Whop.
3. **Admin:** Manually shares talent roster candidates with recruiters, and processes mentor payouts based on Whop revenue.

---

## 4. Key Features (MVP Scope)

### 4.1. Authentication (Whop OAuth)
- User sign up and login via "Sign in with Whop".
- Automatic user profile creation upon first successful OAuth handshake.

### 4.2. Onboarding & Diagnostic Survey
- A 3-question diagnostic survey upon first login to determine the student's background, goals, and skill level.
- Recommends the best course matching their profile.

### 4.3. Course Catalog & Video Lectures
- Browsable catalog of available courses.
- Course Details Page: Syllabus, lectures list, and course description.
- **Video Player:** Pinned aspect-video player with Bunny.net Stream HLS adaptive playback and domain locking.

### 4.4. Quiz Engine & Talent List (Job Placement Gate)
- Course quizzes with grading logic.
- Students scoring **>85%** are automatically added to the **Talent Roster** database table.
- Admins can view the Talent Roster and manually share student CVs/profiles with partner recruiters.

### 4.5. Automated Access Control (Whop Webhooks)
- Purchases and subscriptions are processed directly on Whop.com.
- A secure webhook endpoint (`/api/webhook/whop`) listens to Whop events:
  - `membership.activated` -> Automatically creates or unlocks the student's course enrollment in the local SQLite database.
  - `membership.deactivated` -> Automatically locks/deactivates the student's enrollment if they refund or cancel their subscription.

### 4.6. Mentor Payout Reporting
- Admin can review sales logs and calculate mentor splits offline using transaction logs synced via Whop webhook payloads.

---

## 5. Technology Stack & Hosting
- **Frontend:** Next.js (App Router) + React.
- **Styling & UI:** Tailwind CSS v4 + Shadcn UI, fully responsive for Mobile and iPad (touch-first, adaptable layouts).
- **Database & ORM:** Local SQLite (using Drizzle ORM) for zero-setup, file-based persistence.
- **Authentication:** Whop OAuth 2.1 integration.
- **Video Infrastructure:** Bunny.net Stream (for adaptive HLS playback) or HTML5 aspect-video player with custom touch controls.
- **Fulfillment / Payments:** Whop.com webhooks and membership checks.

---

## 6. Out of Scope for MVP
- Custom manual receipt upload forms and admin approval panels (replaced by automated Whop integration).
- Automated career matching algorithms or recruiter portals.
- In-app automated payout distribution to mentors.
