import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { 
  Compass, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  CheckSquare, 
  ExternalLink,
  Play,
  CheckCircle,
  Circle,
  HelpCircle,
  MessageSquare,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  Users
} from 'lucide-react';

export default async function LandingPage() {
  const user = await getCurrentUser();

  // If already authenticated, bypass landing page
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-[#f4f4f5] flex flex-col relative overflow-hidden grid-bg">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-neon-violet/10 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[-5%] h-[600px] w-[600px] rounded-full bg-neon-cyan/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-[40%] left-[45%] h-[300px] w-[300px] rounded-full bg-[#f43f5e]/5 blur-[120px] pointer-events-none" />

      {/* FLOATING GLASS NAVIGATION BAR */}
      <nav className="sticky top-0 w-full z-50 bg-[#07070a]/60 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-neon-violet to-neon-cyan flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-headers text-lg font-bold tracking-wide text-white leading-none">
                Roadmappers
              </span>
              <span className="text-[9px] text-neon-cyan font-bold tracking-widest uppercase mt-1">
                Eduction Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="/api/auth/whop/login" 
              className="text-xs font-semibold text-muted-lavender hover:text-white transition-all cursor-pointer"
            >
              Sign In
            </a>
            <a 
              href="/api/auth/whop/login" 
              className="btn-primary text-xs md:text-sm py-2 px-5 flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              Get Access Pass
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - SPLIT GRID */}
      <header className="max-w-7xl mx-auto w-full px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Copywriting, CTAs, Badges */}
        <div className="lg:col-span-6 flex flex-col gap-6 text-left items-start">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-muted-lavender">
            <Sparkles className="h-4 w-4 text-neon-cyan animate-pulse" />
            <span>Interactive Roadmaps Powered by Whop</span>
          </div>

          <h1 className="font-headers text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-xl">
            Master Skills via{' '}
            <span className="bg-gradient-to-r from-neon-violet via-purple-400 to-neon-cyan bg-clip-text text-transparent drop-shadow-sm font-black">
              Interactive
            </span>{' '}
            Learning Paths
          </h1>

          <p className="text-sm md:text-base text-muted-lavender max-w-lg leading-relaxed">
            Stop scrolling through scattered links. Take diagnostic surveys to find matching courses, mark lesson nodes completed on your timeline, pass quizzes, and qualify for placement on our Admin Recruiter Roster.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
            <a 
              href="/api/auth/whop/login" 
              className="btn-whop h-14 flex items-center justify-center gap-3 text-base shadow-[0_4px_25px_rgba(255,90,31,0.25)] cursor-pointer flex-1 sm:flex-none px-8"
            >
              Sign In via Whop.com
              <ExternalLink className="h-5 w-5" />
            </a>
            
            <a 
              href="/api/auth/whop/login" 
              className="flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 rounded-full text-sm font-semibold text-white px-6 h-14 transition-all cursor-pointer flex-1 sm:flex-none"
            >
              Explore Catalog <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Social Proof metrics */}
          <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-8 mt-6 w-full max-w-md">
            <div>
              <span className="block font-headers text-2xl font-bold text-white leading-none">94%</span>
              <span className="text-[10px] text-muted-lavender/60 font-semibold uppercase tracking-wider mt-1 block">Placement Rate</span>
            </div>
            <div>
              <span className="block font-headers text-2xl font-bold text-white leading-none">12K+</span>
              <span className="text-[10px] text-muted-lavender/60 font-semibold uppercase tracking-wider mt-1 block">Enrolled Students</span>
            </div>
            <div>
              <span className="block font-headers text-2xl font-bold text-white leading-none">70/30</span>
              <span className="text-[10px] text-muted-lavender/60 font-semibold uppercase tracking-wider mt-1 block">Mentor Revenue Split</span>
            </div>
          </div>
        </div>

        {/* Right Side: High-fidelity CSS Workspace Player Mockup */}
        <div className="lg:col-span-6 relative w-full flex justify-center items-center">
          
          {/* Decorative Glowing Orbit Ring */}
          <div className="absolute inset-[-10px] bg-gradient-to-tr from-neon-violet/20 to-neon-cyan/20 rounded-[24px] blur-md pointer-events-none opacity-60" />

          {/* Interactive Player Dashboard Mockup Frame */}
          <div className="w-full max-w-2xl glass-card border-white/10 bg-slate-900/60 overflow-hidden shadow-2xl flex flex-col h-[380px] md:h-[420px]">
            
            {/* Mock Header Controls */}
            <div className="h-10 border-b border-white/5 bg-slate-950/40 px-4 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/30 border border-red-500/50" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
                <span className="h-3 w-3 rounded-full bg-green-500/30 border border-green-500/50" />
              </div>
              <span className="text-[9px] font-bold text-muted-lavender/40 uppercase tracking-widest">
                Dashboard Workspace Mockup
              </span>
            </div>

            {/* Split layout inside mockup */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Mock Panel: Video Frame & Progress */}
              <div className="flex-1 p-4 flex flex-col gap-3 justify-between">
                
                {/* Mock Video Frame */}
                <div className="aspect-video w-full rounded-xl bg-slate-950 border border-white/5 relative overflow-hidden flex items-center justify-center group shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-tr from-neon-violet/10 to-transparent pointer-events-none" />
                  <div className="h-12 w-12 rounded-full bg-neon-violet/20 border border-neon-violet/30 flex items-center justify-center text-neon-violet group-hover:scale-105 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>
                  
                  {/* Floating Indicator */}
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-white/5 text-[9px] text-muted-lavender font-bold uppercase tracking-wider">
                    Lesson 2: Core Components
                  </span>
                </div>

                {/* Mock Progress Info */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline text-[10px]">
                    <span className="text-muted-lavender/60">Module Progress</span>
                    <span className="font-bold text-neon-cyan">60% Completed</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-neon-violet to-neon-cyan w-[60%]" />
                  </div>
                </div>

                {/* Mock Tab Selector */}
                <div className="flex gap-3 border-b border-white/5 pb-2 text-[10px] font-bold uppercase text-muted-lavender">
                  <span className="text-white border-b border-neon-violet pb-2 cursor-pointer">Lesson Notes</span>
                  <span className="cursor-pointer">Step Q&A</span>
                  <span className="text-neon-cyan flex items-center gap-0.5 cursor-pointer">
                    Take Quiz <Zap className="h-3 w-3 fill-current" />
                  </span>
                </div>
              </div>

              {/* Right Mock Sidebar: Timeline Checklist */}
              <div className="w-48 border-l border-white/5 bg-slate-950/20 p-3 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
                <span className="text-[8px] font-bold text-muted-lavender/50 uppercase tracking-widest block mb-1">
                  Steps Checklist
                </span>

                {/* Step 1: Completed */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg border border-white/5 bg-white/2.5">
                  <CheckCircle className="h-4 w-4 text-neon-cyan shrink-0" />
                  <div className="overflow-hidden">
                    <span className="block text-[10px] text-white font-bold truncate">01. Setup local.db</span>
                  </div>
                </div>

                {/* Step 2: Active */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg border border-neon-violet/30 bg-neon-violet/5 shadow-[0_0_10px_rgba(139,92,246,0.05)]">
                  <Play className="h-3.5 w-3.5 text-neon-violet shrink-0" />
                  <div className="overflow-hidden">
                    <span className="block text-[10px] text-white font-bold truncate">02. Schema Pushing</span>
                  </div>
                </div>

                {/* Step 3: Locked */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg opacity-40">
                  <Lock className="h-3.5 w-3.5 text-muted-lavender shrink-0" />
                  <div className="overflow-hidden">
                    <span className="block text-[10px] text-muted-lavender font-bold truncate">03. Integration Quiz</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* CORE FEATURES BENTO SECTION */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 relative z-10 text-center flex flex-col gap-12">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-neon-cyan">Platform Features</span>
          <h2 className="font-headers text-3xl md:text-4xl font-extrabold text-white mt-2">
            Engineered for Placement & Output
          </h2>
          <p className="text-sm text-muted-lavender mt-2 max-w-md mx-auto">
            Review the advanced features designed to maximize student placement rates and simplify payment logistics.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-card glass-card-hover p-6 md:p-8 flex flex-col gap-4 text-left">
            <div className="h-12 w-12 rounded-xl bg-neon-violet/10 border border-neon-violet/20 flex items-center justify-center text-neon-violet shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-headers text-xl font-bold text-white">Diagnostic Profiler</h3>
              <p className="text-xs text-muted-lavender/80 leading-relaxed mt-2">
                A 3-step onboarding survey evaluates student time commitment, goals, and technical background. Computes the optimal roadmap curriculum match instantly.
              </p>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-6 md:p-8 flex flex-col gap-4 text-left">
            <div className="h-12 w-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-headers text-xl font-bold text-white">Timeline Checklists</h3>
              <p className="text-xs text-muted-lavender/80 leading-relaxed mt-2">
                Course material is delivered node-by-node. Mark lessons completed to trigger visual progress indicators, maintaining high-fidelity aspect-ratio player states.
              </p>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-6 md:p-8 flex flex-col gap-4 text-left">
            <div className="h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-headers text-xl font-bold text-white">Recruitment Talent Roster</h3>
              <p className="text-xs text-muted-lavender/80 leading-relaxed mt-2">
                Quizzes evaluate student output. Scoring exceptionally well (&gt;= 85%) automatically logs user credentials in the Admin recruiter table for job matches.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* DYNAMIC TIMELINE VISUALIZATION PREVIEW */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12 relative z-10 flex flex-col md:flex-row items-center gap-12 border-t border-white/5 mt-12 pt-16">
        <div className="md:w-1/2 flex flex-col gap-6 text-left">
          <span className="text-[10px] uppercase font-bold tracking-widest text-neon-violet">
            Whop Checkout Integration
          </span>
          <h2 className="font-headers text-3xl font-extrabold text-white leading-tight">
            Connect Products, Webhooks & Automated Access
          </h2>
          <p className="text-sm text-muted-lavender leading-relaxed">
            Whop.com handles global checkout processing, subscription collections, and licensing. Our backend verifies incoming event signatures and provisions student access automatically.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-neon-cyan/15 flex items-center justify-center text-neon-cyan shrink-0">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="text-xs text-white/90">HMAC-SHA256 Signature verified webhook route handlers</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-neon-cyan/15 flex items-center justify-center text-neon-cyan shrink-0">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="text-xs text-white/90">Auto-activation/deactivation database triggers</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-neon-cyan/15 flex items-center justify-center text-neon-cyan shrink-0">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="text-xs text-white/90">70/30 Offline splits payouts metrics panel</span>
            </div>
          </div>
        </div>

        {/* Visual Roadmap connector */}
        <div className="md:w-1/2 w-full p-6 glass-card border-white/5 bg-[#0f172a]/5 flex flex-col gap-6">
          <h3 className="font-headers text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3">
            Access Fulfillment Flow
          </h3>

          <div className="flex flex-col gap-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-neon-violet before:to-neon-cyan">
            
            <div className="relative">
              <span className="absolute left-[-21px] top-0 h-4 w-4 rounded-full bg-neon-violet flex items-center justify-center shadow-[0_0_8px_#8b5cf6]" />
              <span className="block text-xs font-bold text-white">1. Whop.com Product Checkout Pass</span>
              <span className="block text-[10px] text-muted-lavender mt-0.5">Student pays and gets registered on Whop membership.</span>
            </div>

            <div className="relative">
              <span className="absolute left-[-21px] top-0 h-4 w-4 rounded-full bg-[#f43f5e] flex items-center justify-center shadow-[0_0_8px_#f43f5e]" />
              <span className="block text-xs font-bold text-white">2. HMAC signature verification webhook</span>
              <span className="block text-[10px] text-muted-lavender mt-0.5">Payload received, checked against WHOP_WEBHOOK_SECRET.</span>
            </div>

            <div className="relative">
              <span className="absolute left-[-21px] top-0 h-4 w-4 rounded-full bg-neon-cyan flex items-center justify-center shadow-[0_0_8px_#06b6d4]" />
              <span className="block text-xs font-bold text-white">3. Access Open & Workspace Released</span>
              <span className="block text-[10px] text-muted-lavender mt-0.5">Drizzle inserts enrollment, student unlocks workspace player.</span>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-muted-lavender/50 mt-20 relative z-10 bg-[#07070a]/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Roadmappers. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-all">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
