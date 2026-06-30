'use server';

import { db, users, enrollments, courses, sessions } from '@/db';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function developerLoginAction(role: 'student_new' | 'student_enrolled' | 'mentor' | 'admin') {
  try {
    let email = '';
    let name = '';
    let dbRole: 'student' | 'mentor' | 'admin' = 'student';

    if (role === 'student_new') {
      email = 'student.new@dev.local';
      name = 'Dev Student New';
      dbRole = 'student';
    } else if (role === 'student_enrolled') {
      email = 'student.enrolled@dev.local';
      name = 'Dev Student Enrolled';
      dbRole = 'student';
    } else if (role === 'mentor') {
      email = 'mentor@dev.local';
      name = 'Dev Mentor';
      dbRole = 'mentor';
    } else if (role === 'admin') {
      email = 'admin@dev.local';
      name = 'Dev Admin';
      dbRole = 'admin';
    }

    // 1. Create or fetch developer user
    let userRecord = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId: string;

    if (userRecord.length === 0) {
      userId = crypto.randomUUID();
      await db.insert(users).values({
        id: userId,
        whopUserId: `dev_${role}`,
        email,
        name,
        role: dbRole,
        createdAt: Date.now(),
      });
    } else {
      userId = userRecord[0].id;
      // Ensure the role is up to date in case it was toggled
      await db
        .update(users)
        .set({ role: dbRole })
        .where(eq(users.id, userId));
    }

    // 2. Handle auto-enrollment for student_enrolled
    if (role === 'student_enrolled') {
      const allCourses = await db.select().from(courses).limit(1);
      if (allCourses.length > 0) {
        const courseId = allCourses[0].id;
        const existingEnrollment = await db
          .select()
          .from(enrollments)
          .where(eq(enrollments.userId, userId))
          .limit(1);

        if (existingEnrollment.length === 0) {
          await db.insert(enrollments).values({
            id: crypto.randomUUID(),
            userId,
            courseId,
            whopMembershipId: `dev_enrollment_${courseId}`,
            status: 'active',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      }
    }

    // 3. Create Session Record
    const sessionId = crypto.randomUUID();
    await db.insert(sessions).values({
      id: sessionId,
      userId,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // 4. Set Session Cookie
    const cookieStore = await cookies();
    cookieStore.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Developer login action failure:', error);
    return { success: false, error: 'Failed to authenticate developer.' };
  }
}
