'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
import { ONBOARDING_LIST } from '@/public/consts/onboarding';

export const OnBoardingStepComponent = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  // const { data: session } = useSession();
  // const userNickname = session?.user?.nickname;

  const currentOnboarding = ONBOARDING_LIST[currentStep];

  const handleNext = () => {
    if (currentStep < ONBOARDING_LIST.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 온보딩 완료 표시 쿠키 설정 후 로그인 페이지로 이동
      document.cookie = `onboarding=done; path=/; max-age=${60 * 60 * 24 * 365}`;
      router.push('/dashboard');

      // 로그인 상태에 따라 다른 페이지로 이동
      // if (session?.user) {
      //   // 로그인이 되어있으면 대시보드로
      //   router.push(`/user/dashboard/${userNickname}`);
      // } else {
      //   // 로그인이 안되어있으면 랜딩 페이지로
      //   router.push('/');
      // }
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
          className='w-full text-lg font-semibold text-white bg-primary cursor-pointer rounded-xl h-14 transition duration-200 ease-out hover:scale-105 hover:shadow-lg active:scale-95'
          onClick={handleNext}
          type='button'
        >
          {currentStep === ONBOARDING_LIST.length - 1 ? '시작하기' : '다음으로'}
        </button>
      </div>
    </>
  );
};
