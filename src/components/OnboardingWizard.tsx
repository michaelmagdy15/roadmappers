'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitOnboardingAction } from '@/app/actions/onboarding';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  BookOpen, 
  Compass,
  Code,
  Palette,
  Megaphone,
  Briefcase
} from 'lucide-react';

interface OnboardingWizardProps {
  userName: string;
}

export default function OnboardingWizard({ userName }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendedId, setRecommendedId] = useState<string | null>(null);

  // Form states
  const [goal, setGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('');

  const goals = [
    { id: 'Software Dev', label: 'Software Development', icon: Code, desc: 'Learn to code, build apps, and engineer web platforms.' },
    { id: 'Design', label: 'Product Design (UI/UX)', icon: Palette, desc: 'Master wireframing, layout aesthetics, and design thinking.' },
    { id: 'Marketing', label: 'Digital Marketing', icon: Megaphone, desc: 'Grow brands, run ads, and optimize audience outreach.' },
    { id: 'Business', label: 'Career & Business Growth', icon: Briefcase, desc: 'Learn entrepreneurship, management, and strategy.' },
  ];

  const experienceLevels = [
    { id: 'Beginner', label: 'Beginner', desc: 'No prior experience. Starting completely fresh.' },
    { id: 'Intermediate', desc: 'Have basic understanding or done small projects before.' },
    { id: 'Advanced', desc: 'Experienced professional looking to refine skills.' },
  ];

  const commitments = [
    { id: '<5 hours', label: 'Muted Plan', desc: 'Less than 5 hours per week (busy schedule).' },
    { id: '5-15 hours', desc: '5 to 15 hours per week (standard study pace).' },
    { id: '15+ hours', desc: '15+ hours per week (intensive boot-camp mode).' },
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitOnboardingAction({
        goal,
        experienceLevel,
        timeCommitment,
      });

      if (result.success) {
        setRecommendedId(result.recommendedCourseId ?? null);
        setStep(4);
      } else {
        alert(result.error || 'Failed to submit onboarding survey.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step Indicator */}
      {step < 4 && (
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-initial">
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                  step === s 
                    ? 'border-neon-violet bg-neon-violet/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                    : step > s 
                    ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan' 
                    : 'border-white/10 text-muted-lavender bg-white/5'
                }`}
              >
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div 
                  className={`h-0.5 flex-1 mx-4 transition-all ${
                    step > s ? 'bg-neon-cyan' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: GOAL SELECTION */}
      {step === 1 && (
        <div className="glass-card p-6 md:p-8 flex flex-col gap-6">
          <div>
            <h1 className="font-headers text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Welcome, {userName}!
            </h1>
            <p className="text-muted-lavender text-sm md:text-base">
              What is your primary learning goal? This helps us recommend the perfect roadmap path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => {
              const Icon = g.icon;
              const isSelected = goal === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-neon-violet bg-neon-violet/10 shadow-[0_0_15px_rgba(139,92,246,0.15)] text-white' 
                      : 'border-white/5 bg-white/5 hover:bg-white/10 text-muted-lavender'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${
                    isSelected ? 'bg-neon-violet/20 text-neon-violet' : 'bg-white/5 text-muted-lavender'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base text-white">{g.label}</h3>
                    <p className="text-[12px] text-muted-lavender/80 mt-1 leading-relaxed">{g.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!goal}
            className="w-full flex items-center justify-center gap-2 btn-primary h-12 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* STEP 2: EXPERIENCE LEVEL */}
      {step === 2 && (
        <div className="glass-card p-6 md:p-8 flex flex-col gap-6">
          <div>
            <button 
              onClick={handleBack}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-lavender hover:text-white mb-6 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h1 className="font-headers text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              What's your experience level?
            </h1>
            <p className="text-muted-lavender text-sm md:text-base">
              We'll customize the roadmap curriculum depth based on your starting background.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {experienceLevels.map((lvl) => {
              const isSelected = experienceLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setExperienceLevel(lvl.id)}
                  className={`flex flex-col p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-neon-violet bg-neon-violet/10 shadow-[0_0_15px_rgba(139,92,246,0.15)] text-white' 
                      : 'border-white/5 bg-white/5 hover:bg-white/10 text-muted-lavender'
                  }`}
                >
                  <h3 className="font-semibold text-base text-white">{lvl.id}</h3>
                  <p className="text-xs text-muted-lavender/80 mt-1">{lvl.desc}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!experienceLevel}
            className="w-full flex items-center justify-center gap-2 btn-primary h-12 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* STEP 3: TIME COMMITMENT */}
      {step === 3 && (
        <div className="glass-card p-6 md:p-8 flex flex-col gap-6">
          <div>
            <button 
              onClick={handleBack}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-lavender hover:text-white mb-6 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h1 className="font-headers text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Weekly commitment?
            </h1>
            <p className="text-muted-lavender text-sm md:text-base">
              Choose how much study time you can dedicate to stay on track.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {commitments.map((c) => {
              const isSelected = timeCommitment === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setTimeCommitment(c.id)}
                  className={`flex flex-col p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-neon-violet bg-neon-violet/10 shadow-[0_0_15px_rgba(139,92,246,0.15)] text-white' 
                      : 'border-white/5 bg-white/5 hover:bg-white/10 text-muted-lavender'
                  }`}
                >
                  <h3 className="font-semibold text-base text-white">{c.id}</h3>
                  <p className="text-xs text-muted-lavender/80 mt-1">{c.desc}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!timeCommitment || isSubmitting}
            className="w-full flex items-center justify-center gap-2 btn-primary h-12 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? 'Generating recommendation...' : 'Finish & Get Roadmap'}
            {!isSubmitting && <ArrowRight className="h-5 w-5" />}
          </button>
        </div>
      )}

      {/* STEP 4: RECOMMENDATION SCREEN */}
      {step === 4 && (
        <div className="glass-card p-6 md:p-8 flex flex-col items-center text-center gap-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] border-neon-cyan/20">
          <div className="h-16 w-16 rounded-full bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan animate-pulse">
            <Check className="h-8 w-8" />
          </div>

          <div>
            <h1 className="font-headers text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Roadmap Matches Generated!
            </h1>
            <p className="text-muted-lavender text-sm max-w-md mx-auto">
              Based on your goal of <strong>{goal}</strong> at the <strong>{experienceLevel}</strong> tier, we have mapped out your customized path.
            </p>
          </div>

          {recommendedId ? (
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 text-left flex items-start gap-4">
              <div className="p-3 bg-neon-violet/10 rounded-xl text-neon-violet shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1 overflow-hidden">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neon-cyan">
                  Recommended Course
                </span>
                <h3 className="font-headers text-lg font-bold text-white mt-1 leading-snug truncate">
                  Matching Roadmap Path
                </h3>
                <p className="text-xs text-muted-lavender mt-1">
                  Start your training checklist today. Complete the quizzes to unlock recruiter job matches.
                </p>
                <button
                  onClick={() => router.push(`/dashboard/courses/${recommendedId}`)}
                  className="mt-4 flex items-center gap-1.5 text-xs font-bold text-neon-violet hover:text-white hover:underline transition-all cursor-pointer"
                >
                  Go to course page
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 text-left flex items-start gap-4">
              <div className="p-3 bg-neon-violet/10 rounded-xl text-neon-violet shrink-0">
                <Compass className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neon-cyan">
                  Explore Catalog
                </span>
                <h3 className="font-headers text-lg font-bold text-white mt-1 leading-snug">
                  No courses matching this tag yet
                </h3>
                <p className="text-xs text-muted-lavender mt-1">
                  Head over to the discover catalog page to enroll in any active course.
                </p>
                <button
                  onClick={() => router.push('/dashboard/discover')}
                  className="mt-4 flex items-center gap-1.5 text-xs font-bold text-neon-violet hover:text-white hover:underline transition-all cursor-pointer"
                >
                  Browse all courses
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full max-w-xs mt-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full btn-primary h-12 flex items-center justify-center gap-2"
            >
              Go to my Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
