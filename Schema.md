# Database Schema (Schema) - Roadmappers

## 1. Overview
Roadmappers utilizes a local file-based **SQLite** database managed via **Drizzle ORM**. This schema represents the SQL tables, fields, and relationships optimized for Whop OAuth login and automated Webhook fulfillment.

---

## 2. Table Definitions

### 2.1. `users`
Stores user profile information, keyed by their Whop identity.
- `id` (TEXT, Primary Key) - Unique uuid string.
- `whop_user_id` (TEXT, Unique, Indexed) - User identity string provided by Whop API.
- `email` (TEXT, Unique, Indexed) - User's email from Whop.
- `name` (TEXT) - Full name from Whop.
- `role` (TEXT) - Access level: `student`, `mentor`, `admin`.
- `created_at` (INTEGER) - Epoch timestamp in milliseconds.

### 2.2. `sessions`
Used for database-backed local session validation.
- `id` (TEXT, Primary Key) - Secure random session token.
- `user_id` (TEXT, Foreign Key -> `users.id` ON DELETE CASCADE) - User associated with session.
- `expires_at` (INTEGER) - Expiration timestamp.

### 2.3. `onboarding_profiles`
Persists answers from the student onboarding diagnostic survey.
- `id` (TEXT, Primary Key)
- `user_id` (TEXT, Foreign Key -> `users.id` ON DELETE CASCADE)
- `goal` (TEXT) - e.g., 'Software Dev', 'Design', 'Marketing'.
- `experience_level` (TEXT) - e.g., 'Beginner', 'Intermediate', 'Advanced'.
- `time_commitment` (TEXT) - e.g., '<5 hours', '5-15 hours', '15+ hours'.
- `recommended_course_id` (TEXT, Optional) - Suggested course ID.
- `created_at` (INTEGER)

### 2.4. `courses`
Stores course information uploaded by mentors.
- `id` (TEXT, Primary Key)
- `whop_product_id` (TEXT, Unique, Indexed) - Corresponding Product ID on Whop.com.
- `title` (TEXT)
- `description` (TEXT)
- `price` (REAL) - Price in EGP (for local reference, Whop handles actual checkout pricing).
- `creator_id` (TEXT, Foreign Key -> `users.id` ON DELETE RESTRICT) - Mentor ID.
- `published` (INTEGER) - Boolean flag (0 = Draft, 1 = Published).
- `created_at` (INTEGER)

### 2.5. `lessons`
Individual steps/nodes in a course roadmap timeline.
- `id` (TEXT, Primary Key)
- `course_id` (TEXT, Foreign Key -> `courses.id` ON DELETE CASCADE)
- `title` (TEXT)
- `description` (TEXT)
- `video_url` (TEXT, Optional) - Bunny.net Stream video URL or local file path.
- `content` (TEXT, Optional) - Detailed lesson notes or markdown description.
- `sort_order` (INTEGER) - Position index in the sequential timeline.
- `created_at` (INTEGER)

### 2.6. `quizzes`
Evaluation gates associated with a course or specific lesson.
- `id` (TEXT, Primary Key)
- `course_id` (TEXT, Foreign Key -> `courses.id` ON DELETE CASCADE)
- `lesson_id` (TEXT, Optional, Foreign Key -> `lessons.id` ON DELETE CASCADE)
- `title` (TEXT)
- `created_at` (INTEGER)

### 2.7. `quiz_questions`
Individual multiple-choice questions belonging to a quiz.
- `id` (TEXT, Primary Key)
- `quiz_id` (TEXT, Foreign Key -> `quizzes.id` ON DELETE CASCADE)
- `question_text` (TEXT)
- `options` (TEXT) - JSON string array representing option selections.
- `correct_option_index` (INTEGER) - Zero-based index of the correct option.

### 2.8. `quiz_attempts`
Records students' quiz scores to verify job placement eligibility.
- `id` (TEXT, Primary Key)
- `user_id` (TEXT, Foreign Key -> `users.id` ON DELETE CASCADE)
- `quiz_id` (TEXT, Foreign Key -> `quizzes.id` ON DELETE CASCADE)
- `score` (REAL) - Grade percentage (0.00 to 100.00).
- `completed_at` (INTEGER)

### 2.9. `enrollments`
Tracks course access status synchronized via Whop webhooks.
- `id` (TEXT, Primary Key)
- `user_id` (TEXT, Foreign Key -> `users.id` ON DELETE CASCADE)
- `course_id` (TEXT, Foreign Key -> `courses.id` ON DELETE RESTRICT)
- `whop_membership_id` (TEXT, Unique, Indexed) - Membership ID passed by Whop.
- `status` (TEXT) - Access state: `active`, `inactive`.
- `created_at` (INTEGER)
- `updated_at` (INTEGER)

### 2.10. `lesson_progress`
Logs completed steps in the roadmap checklist per student.
- `id` (TEXT, Primary Key)
- `user_id` (TEXT, Foreign Key -> `users.id` ON DELETE CASCADE)
- `lesson_id` (TEXT, Foreign Key -> `lessons.id` ON DELETE CASCADE)
- `completed` (INTEGER) - Boolean (0 = Incomplete, 1 = Completed).
- `completed_at` (INTEGER)

### 2.11. `discussions`
Timeline or lesson-specific comment threads.
- `id` (TEXT, Primary Key)
- `user_id` (TEXT, Foreign Key -> `users.id` ON DELETE CASCADE)
- `course_id` (TEXT, Foreign Key -> `courses.id` ON DELETE CASCADE)
- `lesson_id` (TEXT, Optional, Foreign Key -> `lessons.id` ON DELETE CASCADE)
- `comment` (TEXT) - Comment string.
- `created_at` (INTEGER)

### 2.12. `talent_roster`
List of high-performing students who meet the job placement threshold (>85%).
- `id` (TEXT, Primary Key)
- `user_id` (TEXT, Unique, Foreign Key -> `users.id` ON DELETE CASCADE)
- `average_score` (REAL) - Cumulative quiz average score.
- `cv_url` (TEXT, Optional) - Local storage path of the student's uploaded CV/Resume.
- `added_at` (INTEGER)

---

## 3. Index Plan
- `users(whop_user_id)` - Instant OAuth profile mapping.
- `courses(whop_product_id)` - Direct lookup of course associated with webhook purchases.
- `enrollments(whop_membership_id)` - Fast access toggling during activation/deactivation.
- `lesson_progress(user_id, lesson_id)` - Accelerates loading student checklists.
