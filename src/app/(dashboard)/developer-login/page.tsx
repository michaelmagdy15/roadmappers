'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { developerLoginAction } from '@/app/actions/developer-login';
import { ShieldAlert, User, Shield, GraduationCap, Compass } from 'lucide-react';

export default function DeveloperLoginPage() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleDevLogin = async (role: 'student_new' | 'student_enrolled' | 'mentor' | 'admin') => {
    setLoadingRole(role);
    try {
      const res = await developerLoginAction(role);
      if (res.success) {
        // Force reload / redirection to refresh server-side context
        window.location.href = '/dashboard';
      } else {
        alert(res.error || 'Failed to authenticate.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      {/* Alert Header */}
      <div className="glass-card p-6 border-neon-violet/30 bg-neon-violet/5 flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
        <ShieldAlert className="h-10 w-10 text-neon-violet shrink-0 animate-pulse" />
        <div>
          <h2 className="font-headers text-lg font-bold text-white">Local Developer Bypass Active</h2>
          <p className="text-xs text-muted-lavender mt-1 leading-relaxed">
            Your `.env.local` uses Whop's placeholder credentials. We activated this Developer Console so you can preview, build, and test all user journeys without setting up OAuth.
          </p>
        </div>
      </div>

      <h1 className="font-headers text-2xl md:text-3xl font-bold text-white text-center mb-2">
        Select a Test Role Profile
      </h1>
      <p className="text-sm text-muted-lavender text-center mb-10 max-w-md mx-auto">
        Click any of the profiles below to immediately sign in and mock access permissions for that role.
      </p>

      {/* Grid of Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Option 1: Student New */}
        <button
          onClick={() => handleDevLogin('student_new')}
          disabled={loadingRole !== null}
          className="glass-card p-6 border-white/5 bg-[#0f172a]/10 hover:border-neon-violet/30 transition-all text-left flex gap-4 cursor-pointer group disabled:opacity-50"
        >
          <div className="h-12 w-12 rounded-xl bg-neon-violet/10 border border-neon-violet/20 flex items-center justify-center text-neon-violet shrink-0 group-hover:scale-105 transition-all">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-headers font-bold text-white text-base">New Student (Onboarding Flow)</h3>
            <p className="text-xs text-muted-lavender/80 mt-1 leading-relaxed">
              Log in as a brand-new student. You will be directed to the 3-question diagnostic survey to define your experience, goals, and matching courses.
            </p>
            <span className="text-[10px] text-neon-violet font-semibold uppercase tracking-wider mt-3 block">
              {loadingRole === 'student_new' ? 'Authenticating...' : 'Sign In as Student (New) →'}
            </span>
          </div>
        </button>

        {/* Option 2: Student Enrolled */}
        <button
          onClick={() => handleDevLogin('student_enrolled')}
          disabled={loadingRole !== null}
          className="glass-card p-6 border-white/5 bg-[#0f172a]/10 hover:border-neon-cyan/30 transition-all text-left flex gap-4 cursor-pointer group disabled:opacity-50"
        >
          <div className="h-12 w-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan shrink-0 group-hover:scale-105 transition-all">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-headers font-bold text-white text-base">Enrolled Student (Workspace Player)</h3>
            <p className="text-xs text-muted-lavender/80 mt-1 leading-relaxed">
              Log in with an active course enrollment. This bypasses the Whop lock screen so you can immediately interact with the lesson player, completed checks, and quizzes.
            </p>
            <span className="text-[10px] text-neon-cyan font-semibold uppercase tracking-wider mt-3 block">
              {loadingRole === 'student_enrolled' ? 'Authenticating...' : 'Sign In as Student (Enrolled) →'}
            </span>
          </div>
        </button>

        {/* Option 3: Mentor */}
        <button
          onClick={() => handleDevLogin('mentor')}
          disabled={loadingRole !== null}
          className="glass-card p-6 border-white/5 bg-[#0f172a]/10 hover:border-purple-400/30 transition-all text-left flex gap-4 cursor-pointer group disabled:opacity-50"
        >
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-all">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-headers font-bold text-white text-base">Course Creator / Mentor</h3>
            <p className="text-xs text-muted-lavender/80 mt-1 leading-relaxed">
              Log in with mentor permissions. This enables you to review uploaded courses, edit step descriptions, and mock-upload curriculum nodes.
            </p>
            <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider mt-3 block">
              {loadingRole === 'mentor' ? 'Authenticating...' : 'Sign In as Mentor →'}
            </span>
          </div>
        </button>

        {/* Option 4: Admin */}
        <button
          onClick={() => handleDevLogin('admin')}
          disabled={loadingRole !== null}
          className="glass-card p-6 border-white/5 bg-[#0f172a]/10 hover:border-green-400/30 transition-all text-left flex gap-4 cursor-pointer group disabled:opacity-50"
        >
          <div className="h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0 group-hover:scale-105 transition-all">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-headers font-bold text-white text-base">System Administrator</h3>
            <p className="text-xs text-muted-lavender/80 mt-1 leading-relaxed">
              Log in with full platform credentials. Access the Talent Placements Roster, inspect gross sales logs, and verify platform/mentor splits (30/70%).
            </p>
            <span className="text-[10px] text-green-400 font-semibold uppercase tracking-wider mt-3 block">
              {loadingRole === 'admin' ? 'Authenticating...' : 'Sign In as Administrator →'}
            </span>
          </div>
        </button>

      </div>
    </div>
  );
}
