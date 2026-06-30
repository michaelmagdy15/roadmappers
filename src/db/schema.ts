import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  whopUserId: text('whop_user_id').unique().notNull(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().$type<'student' | 'mentor' | 'admin'>(),
  createdAt: integer('created_at').notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expiresAt: integer('expires_at').notNull(),
});

export const onboardingProfiles = sqliteTable('onboarding_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  goal: text('goal').notNull(),
  experienceLevel: text('experience_level').notNull(),
  timeCommitment: text('time_commitment').notNull(),
  recommendedCourseId: text('recommended_course_id'),
  createdAt: integer('created_at').notNull(),
});

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  whopProductId: text('whop_product_id').unique().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  creatorId: text('creator_id').references(() => users.id, { onDelete: 'restrict' }).notNull(),
  published: integer('published').notNull(), // 0 or 1
  createdAt: integer('created_at').notNull(),
});

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  videoUrl: text('video_url'),
  content: text('content'),
  sortOrder: integer('sort_order').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const quizzes = sqliteTable('quizzes', {
  id: text('id').primaryKey(),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  lessonId: text('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const quizQuestions = sqliteTable('quiz_questions', {
  id: text('id').primaryKey(),
  quizId: text('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }).notNull(),
  questionText: text('question_text').notNull(),
  options: text('options').notNull(), // JSON array
  correctOptionIndex: integer('correct_option_index').notNull(),
});

export const quizAttempts = sqliteTable('quiz_attempts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  quizId: text('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }).notNull(),
  score: real('score').notNull(),
  completedAt: integer('completed_at').notNull(),
});

export const enrollments = sqliteTable('enrollments', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'restrict' }).notNull(),
  whopMembershipId: text('whop_membership_id').unique().notNull(),
  status: text('status').notNull().$type<'active' | 'inactive'>(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const lessonProgress = sqliteTable('lesson_progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  lessonId: text('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  completed: integer('completed').notNull(), // 0 or 1
  completedAt: integer('completed_at').notNull(),
});

export const discussions = sqliteTable('discussions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  lessonId: text('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
  comment: text('comment').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const talentRoster = sqliteTable('talent_roster', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  averageScore: real('average_score').notNull(),
  cvUrl: text('cv_url'),
  addedAt: integer('added_at').notNull(),
});
