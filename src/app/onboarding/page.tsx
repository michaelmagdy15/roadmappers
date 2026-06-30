import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import OnboardingWizard from '@/components/OnboardingWizard';

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4 py-12 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-neon-violet/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        <OnboardingWizard userName={user.name} />
      </div>
    </div>
  );
}
