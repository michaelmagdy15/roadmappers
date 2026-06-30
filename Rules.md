# Project Rules & Standards (Rules) - Roadmappers

## 1. Core Codebase Rules
- **Stack Constraint:** Strict prohibition on Supabase, Firebase, or external hosted backend-as-a-service frameworks. All local storage, user records, and progress must run locally through Next.js server actions, Drizzle ORM, and SQLite.
- **TypeScript:** Strict type checking. Any dynamic data structures (like quiz questions or JSON configuration fields) must have designated TypeScript interfaces.
- **Zero-Config Database:** Drizzle migrations must be automatically applicable locally without requiring manual database engines (e.g. Postgres Docker containers). The SQLite file `dev.db` is the single source of local persistence.

---

## 2. UI/UX & Responsive Rules
- **Mobile-First CSS:** Implement layout styles starting from mobile screen sizes up (`w-full` first, then `md:max-w-...`).
- **iPad Compatibility:** Test layouts in both vertical and horizontal viewports. Sidebars must collapse into drawers on screens smaller than `1024px` width.
- **Touch Target Integrity:** Every clickable element, button, link, and checkbox must have a minimum interactive padding or sizing of `48px` to prevent mis-clicks on mobile and iPad screens.
- **Layout Aspect Ratios:** Pinned elements (like the mobile video player) must lock their aspect ratios (`aspect-video`) to avoid stretching or layout shifting when the device rotates.

---

## 3. Database, Auth & Webhook Rules
- **Authentication Checks:** Middleware must intercept `/dashboard`, `/creator`, and `/admin` routes. Route Handlers and Server Actions must check local session cookies to confirm the user is logged in.
- **Webhook Security:** The `/api/webhook/whop` route must verify the webhook signature before taking any database action. A warning log should trigger for any invalid signature attempts.
- **Data Access:** No raw SQL queries are allowed. All database interactions must use Drizzle schema operations.

---

## 4. File Structure Conventions
Maintain the clean Next.js App Router structure:
- `/src/app`: Routes, pages, layouts, and API Route Handlers.
- `/src/components`: Reusable UI components (buttons, players, modals).
- `/src/db`: Drizzle configuration, schema declarations (`schema.ts`), and database connection helpers.
- `/src/lib`: Utility functions (formatting, validation, session utilities).
