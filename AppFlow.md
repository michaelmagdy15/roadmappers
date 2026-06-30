# Application Flow (AppFlow) - Roadmappers

## 1. Overview
Roadmappers is optimized for seamless, intuitive transitions, particularly on touch screens (Mobile and iPad). The following diagram and sections detail the primary views and user paths based on user roles (`student`, `creator`, `admin`) utilizing Whop.com integration.

---

## 2. Onboarding & Authentication Flow

```
[ Public Landing Page ]
          │
          ├────────► [ "Sign in with Whop" Button ] ──► [ Whop OAuth Page ]
          │                                                    │
          │                                                    ▼
          │                                           [ OAuth Handshake ]
          │                                                    │
          ▼                                                    ▼
[ Auth Middleware Check ] ◄─────────────────────────── [ Save User / Session ]
          │
          ├───────────────────────────┐
          ▼ (if New Student)          ▼ (if Creator/Admin or returning Student)
[ Onboarding Survey (3 Qs) ]      [ Respective Dashboard ]
          │
          ▼
[ Course Recommendation Card ]
          │
          ▼
[ Student Dashboard ]
```

### 2.1. 3-Question Onboarding Survey
A full-screen responsive wizard displayed to students immediately after account creation:
1. **Question 1:** "What is your main learning goal?" (e.g., Software Development, Product Design, Marketing, Career Growth).
2. **Question 2:** "What is your current experience level?" (Beginner, Intermediate, Advanced).
3. **Question 3:** "How much time can you commit weekly?" (Less than 5 hours, 5-15 hours, 15+ hours).
- **Result:** Renders a clean recommendation card suggesting a specific course. Clicking "Enroll" redirects to the checkout or dashboard.

---

## 3. Student User Journey

### 3.1. Student Dashboard (Mobile & iPad Optimized)
- **Mobile layout:** Bottom tabs navigation containing: "My Courses", "Discover", "Profile".
- **Content:**
  - Enrolled courses list with circular progress bars (percentage completed).
  - Recommended courses grid based on their onboarding profile.
  - Discover courses grid: Clicking a locked course reveals the Whop checkout option.

### 3.2. Course Purchase Flow (Whop Checkout)
- User browses locked Premium courses.
- Course preview displays syllabus details and a large "Unlock via Whop" action button.
- Clicking the button redirects the user to the Whop.com checkout/product page in a new browser tab.
- Once payment is completed on Whop:
  - Whop fires the webhook.
  - The local database enrollment record updates to `active`.
  - The student's preview card updates live to show a "Start Learning" button.

### 3.3. Course Player & Checklist View
- **iPad / Desktop Layout:** Split pane screen. Left side: Interactive vertical timeline checklist of lessons and quizzes. Right side: Bunny.net video player, lesson text, and step-specific comment board.
- **Mobile Layout:** Stacked layout.
  - Video player is pinned to the top of the viewport (`sticky top-0`).
  - Vertical scrollable area below contains:
    1. Lesson Title & Description.
    2. Interactive "Mark as Completed" button (which updates the progress timeline).
    3. Tabbed pane for: "Lessons List" (opens drawer/overlay), "Lesson Notes", and "Q&A Discussion".

### 3.4. Quiz Screen
- Clean card-based viewport containing one question at a time.
- Touch-friendly radio buttons for options.
- Clicking "Submit" presents a modal showing score, passing grade status (>85%), and option to retry.

---

## 4. Creator User Journey

### 4.1. Creator Dashboard
- Displays key statistics: Total Course Enrollments, Active Students, Monthly Earnings.
- Course Management grid listing courses created. Clicking a course opens the **Course Builder**.

### 4.2. Course Builder (Roadmap Creator)
- A form-based tool to outline the learning path.
- **Steps Panel:** Add, delete, or drag-to-reorder steps/nodes.
- **Step Edit Modal:** Set Title, Description, Bunny.net Stream Video URL, and attach downloadable files.
- **Quiz Panel:** Create quizzes by adding multiple-choice questions and marking the correct answer.

---

## 5. Admin User Journey

### 5.1. Talent Roster View (`/admin/talent`)
- Lists top-scoring students (>85% average quiz scores).
- Shows student name, email, courses completed, average score, and a button to view their CV.

### 5.2. Payouts Table (`/admin/finance`)
- Tabulates sales per course (populated by Whop webhook purchase receipts), calculates the mentor's revenue share (e.g., 70/30 split), and displays a toggle to mark payouts as "Paid".
