import { redirect } from 'next/navigation';
import { db, talentRoster, users } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { Award, Mail, Calendar, FileText, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default async function AdminTalentPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/');
  }

  // Authorize: Admin only
  if (currentUser.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 gap-4">
        <ShieldAlert className="h-16 w-16 text-red-500/20 border border-red-500/30 p-3 rounded-2xl bg-red-500/5 animate-pulse" />
        <div>
          <h1 className="font-headers text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-muted-lavender text-sm max-w-sm">
            Only administrators are authorized to access the recruiter placement Talent Roster.
          </p>
        </div>
        <Link href="/dashboard" className="btn-primary mt-2">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Fetch talent roster joined with user info
  const roster = await db
    .select({
      id: talentRoster.id,
      userId: talentRoster.userId,
      name: users.name,
      email: users.email,
      averageScore: talentRoster.averageScore,
      cvUrl: talentRoster.cvUrl,
      addedAt: talentRoster.addedAt,
    })
    .from(talentRoster)
    .innerJoin(users, eq(talentRoster.userId, users.id))
    .orderBy(desc(talentRoster.averageScore));

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-neon-cyan">
          Recruitment Portal
        </span>
        <h1 className="font-headers text-2xl md:text-3xl font-bold text-white mt-1">
          Talent Placement Roster
        </h1>
        <p className="text-sm text-muted-lavender mt-1">
          Review and coordinate job placements for students who scored 85% or higher on platform quizzes.
        </p>
      </div>

      {/* Roster Cards/Table */}
      <div className="glass-card overflow-hidden border-white/5 bg-[#0f172a]/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/2.5 text-[10px] uppercase font-bold tracking-wider text-muted-lavender">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Average Grade</th>
                <th className="px-6 py-4">Date Qualified</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-muted-lavender">
              {roster.map((student) => (
                <tr key={student.id} className="hover:bg-white/2.5 transition-all">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center font-bold text-neon-cyan text-sm">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{student.name}</span>
                      <span className="text-xs text-muted-lavender/60 flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3" /> {student.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="h-6 px-2 rounded-md bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan font-bold text-xs flex items-center gap-1 shadow-[0_0_8px_rgba(6,182,212,0.15)]">
                        <Award className="h-3.5 w-3.5" /> {student.averageScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-lavender/40" />
                      {new Date(student.addedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      {student.cvUrl ? (
                        <a 
                          href={student.cvUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5" /> View CV
                        </a>
                      ) : (
                        <span className="text-xs italic text-muted-lavender/40 py-1.5">No CV Uploaded</span>
                      )}
                      
                      <a 
                        href={`mailto:${student.email}?subject=Roadmappers Placement Program&body=Hello ${student.name},%0D%0A%0D%0AWe reviewed your profile on Roadmappers...`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Contact Candidate <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              
              {roster.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-lavender/50">
                    No students have qualified for the Talent Roster yet (scores must be &gt;= 85%).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
