'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ONBOARDING_LIST } from '@/public/consts/onboarding';
import { useRouter } from 'next/navigation';

export const OnBoardingStep = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const router = useRouter();

  const currentOnboarding = ONBOARDING_LIST[currentStep];

  const handleNext = () => {
    if (currentStep < ONBOARDING_LIST.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 온보딩 완료 후 메인 페이지로 이동
      console.log('온보딩 완료');
      router.push('/login');
    }
  };

  return (
    <>
      {/* 페이지 인디케이터 */}
      <div className='flex space-x-2 mt-4 absolute right-5'>
        {ONBOARDING_LIST.map((item, index) => (
          <div
            key={item?.id}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentStep ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <div className='flex flex-col items-center justify-center flex-1 text-center'>
        {/* 아이콘 */}
        <div className='mb-8'>
          <Image src={currentOnboarding?.icon || ''} alt='onBoarding' width={200} height={200} />
        </div>

        {/* 타이틀 */}
        <h1
          className='text-[40px] font-bold text-gray-900 mb-6 whitespace-pre-line text-shadow-md
'
        >
          {currentOnboarding?.title}
        </h1>

        {/* 설명 */}
        <p className='text-[20px] text-gray-600 leading-relaxed whitespace-pre-line'>
          {currentOnboarding?.description}
        </p>
      </div>

      {/* 다음 버튼 */}
      <div className='w-full'>
        <button
          className='w-full text-lg font-semibold text-white bg-primary hover:bg-primary/80 transition-colors duration-200 rounded-xl h-14'
          onClick={handleNext}
          type='button'
        >
          {currentStep === ONBOARDING_LIST.length - 1 ? '시작하기' : '다음으로'}
        </button>
      </div>
    </>
  );
};
