'use server';

import { db, quizQuestions, quizAttempts, talentRoster, quizzes } from '@/db';
import { eq, and, avg } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';

export async function submitQuizAnswersAction(
  quizId: string,
  userAnswers: { [questionId: string]: number }
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  try {
    // 1. Fetch all questions for this quiz
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));

    if (questions.length === 0) {
      return { success: false, error: 'Quiz contains no questions.' };
    }

    // 2. Grade answers
    let correctCount = 0;
    questions.forEach((q) => {
      const selectedIndex = userAnswers[q.id];
      if (selectedIndex !== undefined && selectedIndex === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);

    // 3. Log attempt
    await db.insert(quizAttempts).values({
      id: crypto.randomUUID(),
      userId: user.id,
      quizId,
      score,
      completedAt: Date.now(),
    });

    // 4. Calculate cumulative average score across all attempts for this user
    const userAttempts = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, user.id));

    const totalScore = userAttempts.reduce((acc, attempt) => acc + attempt.score, 0);
    const averageScore = Math.round(totalScore / userAttempts.length);

    // 5. Evaluate Talent Roster eligibility (>85%)
    if (averageScore >= 85) {
      const existingRoster = await db
        .select()
        .from(talentRoster)
        .where(eq(talentRoster.userId, user.id))
        .limit(1);

      if (existingRoster.length === 0) {
        await db.insert(talentRoster).values({
          id: crypto.randomUUID(),
          userId: user.id,
          averageScore,
          addedAt: Date.now(),
        });
      } else {
        await db
          .update(talentRoster)
          .set({
            averageScore,
            addedAt: Date.now(),
          })
          .where(eq(talentRoster.userId, user.id));
      }
    }

    return { 
      success: true, 
      score, 
      correctCount, 
      totalCount: questions.length 
    };
  } catch (error) {
    console.error('Quiz submission grading error:', error);
    return { success: false, error: 'Failed to submit and grade quiz.' };
  }
}
