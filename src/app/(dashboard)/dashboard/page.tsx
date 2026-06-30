import { redirect } from 'next/navigation';
import { db, enrollments, courses, onboardingProfiles, lessons, lessonProgress } from '@/db';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { BookOpen, Compass, ArrowRight, Play, Award } from 'lucide-react';

export default async function StudentDashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/');
  }

  // 1. Fetch onboarding profile to check recommendation
  const onboarding = await db
    .select()
    .from(onboardingProfiles)
    .where(eq(onboardingProfiles.userId, currentUser.id))
    .limit(1);

  // If student has not completed onboarding, redirect to onboarding survey
  if (onboarding.length === 0 && currentUser.role === 'student') {
    redirect('/onboarding');
  }

  const userProfile = onboarding[0];

  // 2. Fetch student's active enrollments
  const studentEnrollments = await db
    .select({
      id: enrollments.id,
      courseId: enrollments.courseId,
      title: courses.title,
      description: courses.description,
      whopProductId: courses.whopProductId,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(
      and(
        eq(enrollments.userId, currentUser.id),
        eq(enrollments.status, 'active')
      )
    );

  // 3. For each active enrollment, fetch total lessons and completed lessons count
  const enrolledCoursesWithProgress = await Promise.all(
    studentEnrollments.map(async (enrollment) => {
      const courseLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, enrollment.courseId));

      const lessonIds = courseLessons.map(l => l.id);

      let completedCount = 0;
      if (lessonIds.length > 0) {
        const completedRecords = await db
          .select()
          .from(lessonProgress)
          .where(
            and(
              eq(lessonProgress.userId, currentUser.id),
              eq(lessonProgress.completed, 1)
            )
          );

        // Filter progress records that belong to this course
        completedCount = completedRecords.filter(r => lessonIds.includes(r.lessonId)).length;
      }

      const progressPercent = courseLessons.length > 0 
        ? Math.round((completedCount / courseLessons.length) * 100) 
        : 0;

      return {
        ...enrollment,
        totalLessons: courseLessons.length,
        completedLessons: completedCount,
        progressPercent
      };
    })
  );

  // 4. Fetch recommended course info if not already enrolled
  let recommendedCourse = null;
  if (userProfile && userProfile.recommendedCourseId) {
    const isEnrolledInRecommended = studentEnrollments.some(e => e.courseId === userProfile.recommendedCourseId);
    if (!isEnrolledInRecommended) {
      const recommendedRecord = await db
        .select()
        .from(courses)
        .where(eq(courses.id, userProfile.recommendedCourseId))
        .limit(1);
      
      if (recommendedRecord.length > 0) {
        recommendedCourse = recommendedRecord[0];
      }
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Greetings Banner */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-neon-cyan">
          Dashboard Welcome
        </span>
        <h1 className="font-headers text-2xl md:text-3xl font-bold text-white mt-1">
          Welcome back, {currentUser.name}
        </h1>
        <p className="text-sm text-muted-lavender mt-1">
          {currentUser.role === 'admin' 
            ? 'Access the recruitment roster and splits tables using the sidebar options.'
            : 'Track your current lesson timelines and quizzes to qualify for career recruitment.'
          }
        </p>
      </div>

      {/* RECOMMENDED COURSE BANNER */}
      {recommendedCourse && (
        <div className="glass-card p-6 border-neon-violet/20 bg-gradient-to-r from-neon-violet/10 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_30px_rgba(139,92,246,0.05)]">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-neon-violet/15 border border-neon-violet/25 flex items-center justify-center text-neon-violet shrink-0">
              <Compass className="h-5 w-5 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-neon-violet">
                Suggested Learning Path
              </span>
              <h3 className="font-headers text-base font-bold text-white mt-0.5">{recommendedCourse.title}</h3>
              <p className="text-xs text-muted-lavender mt-1 max-w-xl">
                This course matches your onboarding goal of <strong>{userProfile.goal}</strong>. Unlock access via Whop to start learning.
              </p>
            </div>
          </div>
          <Link 
            href={`/dashboard/courses/${recommendedCourse.id}`}
            className="btn-primary py-2.5 px-5 text-xs flex items-center gap-1.5 shrink-0 self-start md:self-auto cursor-pointer"
          >
            Review Course
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* ACTIVE COURSES LIST */}
      <div>
        <h2 className="font-headers text-lg font-bold text-white mb-4">My Roadmap Courses</h2>
        
        {enrolledCoursesWithProgress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCoursesWithProgress.map((course) => (
              <div 
                key={course.id} 
                className="glass-card p-6 border-white/5 bg-[#0f172a]/10 flex flex-col justify-between h-48 hover:border-white/10 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-headers font-bold text-white text-base truncate">{course.title}</h3>
                    <span className="text-[10px] bg-neon-cyan/10 border border-neon-cyan/25 text-neon-cyan px-2 py-0.5 rounded-full font-bold">
                      {course.completedLessons}/{course.totalLessons} Nodes
                    </span>
                  </div>
                  <p className="text-xs text-muted-lavender/80 line-clamp-2 mt-1.5">{course.description}</p>
                </div>

                <div className="mt-4">
                  {/* Progress Indicator */}
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-muted-lavender">Roadmap Progress</span>
                    <span className="font-bold text-neon-cyan">{course.progressPercent}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-gradient-to-r from-neon-violet to-neon-cyan"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>

                  <Link 
                    href={`/dashboard/courses/${course.courseId}`}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-white py-2 transition-all"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> Resume Roadmap
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center text-center gap-4 py-12">
            <BookOpen className="h-12 w-12 text-muted-lavender/25" />
            <div>
              <h3 className="font-semibold text-white text-sm">No Active Roadmaps</h3>
              <p className="text-xs text-muted-lavender/60 mt-1 max-w-xs">
                You haven't unlocked any courses yet. Visit the catalog to find free or premium courses.
              </p>
            </div>
            <Link href="/dashboard/discover" className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5 mt-2">
              Browse Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
