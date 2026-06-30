'use server';

import { db, onboardingProfiles, courses, users } from '@/db';
import { eq, like, or } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';

export async function submitOnboardingAction(formData: {
  goal: string;
  experienceLevel: string;
  timeCommitment: string;
}) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('You must be logged in to submit the onboarding survey.');
  }

  const { goal, experienceLevel, timeCommitment } = formData;

  try {
    // 1. Search for a matching course in the database based on the chosen goal
    const matchedCourses = await db
      .select()
      .from(courses)
      .where(
        or(
          like(courses.title, `%${goal}%`),
          like(courses.description, `%${goal}%`)
        )
      )
      .limit(1);

    let recommendedCourseId = null;

    if (matchedCourses.length > 0) {
      recommendedCourseId = matchedCourses[0].id;
    } else {
      // Fallback: Recommend the first available published course
      const firstCourse = await db
        .select()
        .from(courses)
        .where(eq(courses.published, 1))
        .limit(1);
      
      if (firstCourse.length > 0) {
        recommendedCourseId = firstCourse[0].id;
      }
    }

    // 2. Insert or update the onboarding profile
    const existingProfile = await db
      .select()
      .from(onboardingProfiles)
      .where(eq(onboardingProfiles.userId, user.id))
      .limit(1);

    if (existingProfile.length === 0) {
      await db.insert(onboardingProfiles).values({
        id: crypto.randomUUID(),
        userId: user.id,
        goal,
        experienceLevel,
        timeCommitment,
        recommendedCourseId,
        createdAt: Date.now(),
      });
    } else {
      await db
        .update(onboardingProfiles)
        .set({
          goal,
          experienceLevel,
          timeCommitment,
          recommendedCourseId,
        })
        .where(eq(onboardingProfiles.userId, user.id));
    }

    return {
      success: true,
      recommendedCourseId,
    };
  } catch (error) {
    console.error('Failed to submit onboarding profile:', error);
    return {
      success: false,
      error: 'An internal server error occurred while saving your profile.',
    };
  }
}
