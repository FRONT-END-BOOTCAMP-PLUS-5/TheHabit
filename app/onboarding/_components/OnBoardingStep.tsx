'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ONBOARDING_LIST } from '@/public/consts/onboarding';

export const OnBoardingStepComponent = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const currentOnboarding = ONBOARDING_LIST[currentStep];

  const handleNext = async () => {
    if (currentStep < ONBOARDING_LIST.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/onboarding/complete', { method: 'POST' });
      if (!res.ok) throw new Error('온보딩 완료 처리에 실패했습니다.');
      const data = (await res.json()) as { redirectTo?: string };

      if (session?.user) {
        await update();
      }

      router.replace(data.redirectTo ?? '/demo');
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 페이지 인디케이터 */}
      <div className='flex space-x-2 mt-4 border-b-2 border-gray-300 w-full'>
        {ONBOARDING_LIST.map((item, index) => (
          <div
            key={item?.id}
            className={`w-3 h-3 rounded-full transition-colors duration-300 mb-3 ${
              index === currentStep ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <div className='flex flex-col items-center justify-center flex-1 text-center'>
        {/* 아이콘 */}
        {currentOnboarding?.icon && (
          <div className='mb-8'>
            <Image
              src={currentOnboarding.icon}
              alt='onBoarding'
              width={200}
              height={200}
              className='rounded-2xl shadow-lg'
            />
          </div>
        )}

        {/* 타이틀 */}
        <h1 className='text-3xl font-bold text-gray-900 mb-6 whitespace-pre-line'>
          {currentOnboarding?.title}
        </h1>

        {/* 설명 */}
        {currentOnboarding?.description && (
          <p className='text-lg text-gray-600 leading-relaxed whitespace-pre-line'>
            {currentOnboarding.description}
          </p>
        )}
      </div>

      {/* 다음 버튼 */}
      <div className='w-full'>
        <button
          className='w-full text-lg font-semibold text-white bg-primary cursor-pointer rounded-xl h-14 transition duration-200 ease-out hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100'
          onClick={handleNext}
          type='button'
          disabled={isSubmitting}
        >
          {isSubmitting
            ? '처리 중...'
            : currentStep === ONBOARDING_LIST.length - 1
              ? '시작하기'
              : '다음으로'}
        </button>
      </div>
    </>
  );
};
