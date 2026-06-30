import { redirect } from 'next/navigation';
import { db, quizzes, quizQuestions } from '@/db';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import QuizRunner from '@/components/QuizRunner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{
    courseId: string;
    quizId: string;
  }>;
}

export default async function QuizPage({ params }: PageProps) {
  const { courseId, quizId } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/');
  }

  // 1. Fetch quiz details
  const quizRecord = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, quizId))
    .limit(1);

  if (quizRecord.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="font-headers text-2xl font-bold text-white mb-2">Quiz Not Found</h1>
        <p className="text-muted-lavender text-sm mb-4">The quiz you are trying to access does not exist.</p>
        <Link href={`/dashboard/courses/${courseId}`} className="btn-primary flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Return to Course
        </Link>
      </div>
    );
  }

  const quiz = quizRecord[0];

  // 2. Fetch quiz questions
  const questionsList = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId));

  return (
    <QuizRunner
      courseId={courseId}
      quiz={{
        id: quiz.id,
        title: quiz.title,
      }}
      questions={questionsList}
    />
  );
}
