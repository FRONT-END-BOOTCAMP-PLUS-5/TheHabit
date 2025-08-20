'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ONBOARDING_LIST } from '@/public/consts/onboarding';

export const OnBoardingStep = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentOnboarding = ONBOARDING_LIST[currentStep];

  const handleNext = () => {
    if (currentStep < ONBOARDING_LIST.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 온보딩 완료 후 로그인 페이지로 이동
      router.push('/login');
    }
  };

  if (!isMounted) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg text-gray-600'>로딩 중...</div>
      </div>
    );
  }

  return (
    <>
      {/* 페이지 인디케이터 */}
      <div className='flex space-x-2 mt-4'>
        {ONBOARDING_LIST.map((item, index) => (
          <div
            key={item?.id}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentStep ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <div className='flex flex-col items-center justify-center flex-1 text-center'>
        {/* 아이콘 */}
        <div className='mb-8'>
          <Image
            src={currentOnboarding?.icon || ''}
            alt='onBoarding'
            width={200}
            height={200}
            className='rounded-2xl shadow-lg'
          />
        </div>

        {/* 타이틀 */}
        <h1 className='text-3xl font-bold text-gray-900 mb-6 whitespace-pre-line'>
          {currentOnboarding?.title}
        </h1>

        {/* 설명 */}
        <p className='text-lg text-gray-600 leading-relaxed whitespace-pre-line'>
          {currentOnboarding?.description}
        </p>
      </div>

      {/* 다음 버튼 */}
      <div className='w-full'>
        <button
          className='w-full text-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors duration-200 rounded-xl h-14'
          onClick={handleNext}
          type='button'
        >
          {currentStep === ONBOARDING_LIST.length - 1 ? '시작하기' : '다음으로'}
        </button>
      </div>
    </>
  );
};
