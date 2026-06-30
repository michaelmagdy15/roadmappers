import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { 
  BookOpen, 
  Compass, 
  User, 
  PlusCircle, 
  Users, 
  DollarSign, 
  LogOut 
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#09090b]">
      {/* PERSISTENT SIDEBAR - Desktop Only */}
      <aside className="hidden lg:flex flex-col w-64 glass-nav-sidebar border-r border-white/8 bg-[#0f172a]/20 p-6 shrink-0 h-screen sticky top-0 justify-between">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-neon-violet to-neon-cyan flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]">
              R
            </span>
            <span className="font-headers text-xl font-bold tracking-wide bg-gradient-to-r from-white to-muted-lavender bg-clip-text text-transparent group-hover:to-white transition-all">
              Roadmappers
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-lavender/50 px-3">
              Learning
            </span>
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-muted-lavender hover:text-white transition-all"
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">My Courses</span>
            </Link>
            <Link 
              href="/dashboard/discover" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-muted-lavender hover:text-white transition-all"
            >
              <Compass className="h-5 w-5" />
              <span className="text-sm font-medium">Discover</span>
            </Link>

            {/* Creator-Specific Navigation */}
            {user.role === 'mentor' && (
              <>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-lavender/50 px-3 mt-6">
                  Creator Space
                </span>
                <Link 
                  href="/creator/courses" 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-muted-lavender hover:text-white transition-all"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Course Builder</span>
                </Link>
                <Link 
                  href="/creator/earnings" 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-muted-lavender hover:text-white transition-all"
                >
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium">My Earnings</span>
                </Link>
              </>
            )}

            {/* Admin-Specific Navigation */}
            {user.role === 'admin' && (
              <>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-lavender/50 px-3 mt-6">
                  Admin Panel
                </span>
                <Link 
                  href="/admin/talent" 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-muted-lavender hover:text-white transition-all"
                >
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">Talent Roster</span>
                </Link>
                <Link 
                  href="/admin/finance" 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-muted-lavender hover:text-white transition-all"
                >
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium">Mentor Splits</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
          <div className="flex items-center gap-3 px-3">
            <div className="h-9 w-9 rounded-full bg-neon-violet/20 border border-neon-violet/30 flex items-center justify-center font-bold text-neon-violet text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate text-white">{user.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-lavender font-bold">
                {user.role}
              </span>
            </div>
          </div>
          <a 
            href="/api/auth/signout" 
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </a>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION - Floating Capsule on Mobile & iPad */}
      <nav className="fixed bottom-4 left-4 right-4 h-16 z-50 glass-nav glass-card lg:hidden flex items-center justify-around px-4 bg-[#09090b]/80">
        <Link 
          href="/dashboard" 
          className="flex flex-col items-center justify-center w-12 h-12 text-muted-lavender hover:text-white transition-all rounded-full hover:bg-white/5"
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-[9px] font-bold mt-0.5">Courses</span>
        </Link>
        <Link 
          href="/dashboard/discover" 
          className="flex flex-col items-center justify-center w-12 h-12 text-muted-lavender hover:text-white transition-all rounded-full hover:bg-white/5"
        >
          <Compass className="h-5 w-5" />
          <span className="text-[9px] font-bold mt-0.5">Discover</span>
        </Link>

        {user.role === 'mentor' && (
          <Link 
            href="/creator/courses" 
            className="flex flex-col items-center justify-center w-12 h-12 text-muted-lavender hover:text-white transition-all rounded-full hover:bg-white/5"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="text-[9px] font-bold mt-0.5">Builder</span>
          </Link>
        )}

        {user.role === 'admin' && (
          <Link 
            href="/admin/talent" 
            className="flex flex-col items-center justify-center w-12 h-12 text-muted-lavender hover:text-white transition-all rounded-full hover:bg-white/5"
          >
            <Users className="h-5 w-5" />
            <span className="text-[9px] font-bold mt-0.5">Talent</span>
          </Link>
        )}

        <Link 
          href="/dashboard/profile" 
          className="flex flex-col items-center justify-center w-12 h-12 text-muted-lavender hover:text-white transition-all rounded-full hover:bg-white/5"
        >
          <User className="h-5 w-5" />
          <span className="text-[9px] font-bold mt-0.5">Profile</span>
        </Link>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col pb-24 lg:pb-0 h-screen overflow-y-auto">
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#09090b]/40 backdrop-blur sticky top-0 z-40">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-md bg-gradient-to-tr from-neon-violet to-neon-cyan flex items-center justify-center font-bold text-white text-xs">
              R
            </span>
            <span className="font-headers text-lg font-bold tracking-wide text-white">
              Roadmappers
            </span>
          </Link>
          <div className="h-8 w-8 rounded-full bg-neon-violet/20 border border-neon-violet/30 flex items-center justify-center font-bold text-neon-violet text-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </header>
        <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
