'use server';

import { db, lessonProgress, discussions, enrollments, users } from '@/db';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

// Action to check/uncheck a lesson in the checklist
export async function toggleLessonProgressAction(lessonId: string, completed: boolean) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  try {
    const existingProgress = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, user.id),
          eq(lessonProgress.lessonId, lessonId)
        )
      )
      .limit(1);

    if (existingProgress.length === 0) {
      if (completed) {
        await db.insert(lessonProgress).values({
          id: crypto.randomUUID(),
          userId: user.id,
          lessonId,
          completed: 1,
          completedAt: Date.now(),
        });
      }
    } else {
      await db
        .update(lessonProgress)
        .set({
          completed: completed ? 1 : 0,
          completedAt: Date.now(),
        })
        .where(
          and(
            eq(lessonProgress.userId, user.id),
            eq(lessonProgress.lessonId, lessonId)
          )
        );
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to toggle lesson progress:', error);
    return { success: false, error: 'Database update failed.' };
  }
}

// Action to post a comment/question in the step Q&A discussion
export async function postDiscussionCommentAction(formData: {
  courseId: string;
  lessonId?: string;
  comment: string;
}) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { courseId, lessonId, comment } = formData;

  if (!comment.trim()) {
    return { success: false, error: 'Comment content cannot be empty.' };
  }

  try {
    const commentId = crypto.randomUUID();
    await db.insert(discussions).values({
      id: commentId,
      userId: user.id,
      courseId,
      lessonId: lessonId || null,
      comment: comment.trim(),
      createdAt: Date.now(),
    });

    revalidatePath(`/dashboard/courses/${courseId}`);

    return { 
      success: true, 
      comment: {
        id: commentId,
        userId: user.id,
        userName: user.name,
        comment: comment.trim(),
        createdAt: Date.now()
      }
    };
  } catch (error) {
    console.error('Failed to post discussion comment:', error);
    return { success: false, error: 'Database insert failed.' };
  }
}
