import { redirect } from 'next/navigation';
import { db, courses, lessons, quizzes, discussions, lessonProgress, enrollments, users } from '@/db';
import { eq, and, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import CourseWorkspace from '@/components/CourseWorkspace';
import Link from 'next/link';
import { Lock, ArrowLeft, RefreshCw } from 'lucide-react';
import crypto from 'crypto';

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;
  const id = courseId;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/');
  }

  // 1. Fetch course details
  const courseRecord = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id))
    .limit(1);

  if (courseRecord.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="font-headers text-2xl font-bold text-white mb-2">Course Not Found</h1>
        <p className="text-muted-lavender text-sm mb-4">The course you are trying to access does not exist.</p>
        <Link href="/dashboard" className="btn-primary flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const course = courseRecord[0];

  // 2. Check access permissions
  // Bypass access check for mentors and admins
  const hasManagementRole = currentUser.role === 'mentor' || currentUser.role === 'admin';
  let hasAccess = hasManagementRole;

  let enrollmentRecord = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, currentUser.id),
        eq(enrollments.courseId, id),
        eq(enrollments.status, 'active')
      )
    )
    .limit(1);

  if (enrollmentRecord.length > 0) {
    hasAccess = true;
  } else if (course.price === 0 && !hasManagementRole) {
    // Automatically enroll user in free course
    await db.insert(enrollments).values({
      id: crypto.randomUUID(),
      userId: currentUser.id,
      courseId: id,
      whopMembershipId: `free_${currentUser.id}_${id}`,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    hasAccess = true;
  }

  // 3. Render Lock Checkout Screen if premium and not enrolled
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4 py-8">
        <div className="w-full max-w-md glass-card p-6 md:p-8 flex flex-col items-center text-center gap-6 shadow-[0_0_50px_rgba(139,92,246,0.1)] border-white/5 bg-[#0f172a]/20">
          <div className="h-14 w-14 rounded-full bg-neon-violet/10 border border-neon-violet/20 flex items-center justify-center text-neon-violet">
            <Lock className="h-6 w-6" />
          </div>

          <div>
            <h1 className="font-headers text-xl md:text-2xl font-bold tracking-tight text-white mb-1">
              Locked Premium Course
            </h1>
            <p className="text-xs text-muted-lavender">
              Enroll via Whop.com to instantly unlock step checklists, video streams, quizzes, and job placement eligibility.
            </p>
          </div>

          <div className="w-full bg-white/2.5 border border-white/5 rounded-2xl p-4 text-left">
            <span className="text-[10px] uppercase font-bold text-neon-cyan">Roadmappers Access Pass</span>
            <h3 className="font-headers text-base font-bold text-white mt-0.5 leading-snug">{course.title}</h3>
            <div className="flex justify-between items-baseline mt-4 border-t border-white/5 pt-3">
              <span className="text-xs text-muted-lavender">One-time payment</span>
              <span className="font-headers text-xl font-bold text-white">{course.price} EGP</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full mt-2">
            <a 
              href={`https://whop.com/checkout/${course.whopProductId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-whop h-12 flex items-center justify-center gap-2 cursor-pointer"
            >
              Unlock via Whop.com
            </a>
            
            <a
              href={`/dashboard/courses/${id}`}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-muted-lavender hover:text-white transition-all cursor-pointer py-2"
            >
              <RefreshCw className="h-4 w-4" /> Check access status
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 4. Fetch timeline lessons, quizzes, discussions, and student progress
  const courseLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, id))
    .orderBy(lessons.sortOrder);

  const courseQuizzes = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.courseId, id));

  const courseDiscussions = await db
    .select({
      id: discussions.id,
      userId: discussions.userId,
      userName: users.name,
      comment: discussions.comment,
      createdAt: discussions.createdAt,
    })
    .from(discussions)
    .innerJoin(users, eq(discussions.userId, users.id))
    .where(eq(discussions.courseId, id))
    .orderBy(desc(discussions.createdAt));

  const progressRecords = await db
    .select()
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.userId, currentUser.id),
        eq(lessonProgress.completed, 1)
      )
    );

  const completedLessonIds = progressRecords.map(pr => pr.lessonId);

  return (
    <CourseWorkspace
      course={{
        id: course.id,
        title: course.title,
        description: course.description,
        whopProductId: course.whopProductId
      }}
      lessons={courseLessons}
      initialCompletedLessonIds={completedLessonIds}
      quizzes={courseQuizzes}
      initialDiscussions={courseDiscussions}
      currentUser={{
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role
      }}
    />
  );
}
