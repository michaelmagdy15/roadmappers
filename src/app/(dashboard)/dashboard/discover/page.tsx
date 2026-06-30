import { redirect } from 'next/navigation';
import { db, courses, enrollments } from '@/db';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { BookOpen, Shield, Lock, Compass, ArrowRight } from 'lucide-react';

export default async function DiscoverCatalogPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/');
  }

  // 1. Fetch all published courses
  const allCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.published, 1));

  // 2. Fetch student's enrollments to map unlock status
  const studentEnrollments = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, currentUser.id),
        eq(enrollments.status, 'active')
      )
    );

  const unlockedCourseIds = new Set(studentEnrollments.map(e => e.courseId));

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-neon-cyan">
          Catalog Explorer
        </span>
        <h1 className="font-headers text-2xl md:text-3xl font-bold text-white mt-1">
          Explore Learning Roadmaps
        </h1>
        <p className="text-sm text-muted-lavender mt-1">
          Browse our collection of structured courses. Unlock premium pathways seamlessly via Whop checkout.
        </p>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCourses.map((course) => {
          const isUnlocked = unlockedCourseIds.has(course.id);
          const isFree = course.price === 0;
          const isManagement = currentUser.role === 'mentor' || currentUser.role === 'admin';

          let buttonText = 'Unlock Course';
          let buttonClass = 'btn-whop text-xs';
          let badgeText = `${course.price} EGP`;
          let badgeClass = 'bg-white/5 border border-white/10 text-white';

          if (isManagement) {
            buttonText = 'Bypass Access (Edit/View)';
            buttonClass = 'btn-primary text-xs';
            badgeClass = 'bg-neon-violet/10 border border-neon-violet/20 text-neon-violet';
          } else if (isUnlocked) {
            buttonText = 'Resume Course';
            buttonClass = 'w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-white py-2.5 transition-all';
            badgeText = 'Unlocked';
            badgeClass = 'bg-neon-cyan/10 border border-neon-cyan/25 text-neon-cyan';
          } else if (isFree) {
            buttonText = 'Enroll Free';
            buttonClass = 'btn-primary text-xs';
            badgeText = 'Free';
            badgeClass = 'bg-green-500/10 border border-green-500/20 text-green-400';
          }

          return (
            <div 
              key={course.id} 
              className="glass-card p-6 border-white/5 bg-[#0f172a]/10 flex flex-col justify-between h-56 hover:border-white/10 transition-all"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-headers font-bold text-white text-base truncate">{course.title}</h3>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${badgeClass}`}>
                    {badgeText}
                  </span>
                </div>
                <p className="text-xs text-muted-lavender/80 line-clamp-3 mt-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-1 text-[10px] text-muted-lavender/50 font-bold uppercase tracking-wider">
                  {isUnlocked || isFree || isManagement ? (
                    <span className="flex items-center gap-1 text-neon-cyan">
                      <Shield className="h-3.5 w-3.5" /> Access Open
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted-lavender">
                      <Lock className="h-3.5 w-3.5" /> Locked Premium
                    </span>
                  )}
                </div>

                <Link 
                  href={`/dashboard/courses/${course.id}`}
                  className={`${buttonClass} px-4 py-2 rounded-xl text-center font-bold`}
                >
                  {buttonText}
                </Link>
              </div>
            </div>
          );
        })}

        {allCourses.length === 0 && (
          <div className="col-span-full glass-card p-12 text-center text-muted-lavender">
            <Compass className="h-12 w-12 text-muted-lavender/25 mx-auto mb-2" />
            <h3 className="font-semibold text-white text-sm">No Roadmap Paths Published Yet</h3>
            <p className="text-xs text-muted-lavender/60 mt-1">Check back later for new releases.</p>
          </div>
        )}
      </div>
    </div>
  );
}
