import { OnBoardingStep } from '@/app/onboarding/_components/onBoardingStep';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-between min-h-screen bg-white px-6 py-8'>
      <OnBoardingStep />
    </main>
  );
}
