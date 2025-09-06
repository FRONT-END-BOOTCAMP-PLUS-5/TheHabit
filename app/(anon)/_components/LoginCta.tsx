'use client';

import ConfirmModal from '@/app/_components/modals/ConfirmModal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const LoginCta: React.FC = () => {
  const [redirect, setRedirect] = useState(false);

  const router = useRouter();

  const handleLogin = () => {
    setRedirect(prev => !prev);
    if (redirect) router.push('/login');
  };

  return (
    <section
      role='region'
      aria-labelledby='login-cta-title'
      className='mx-auto max-w-md rounded-xl bg-primary text-white p-4 shadow-lg'
    >
      <div className='flex items-center justify-between gap-3'>
        <div className='flex-1'>
          <h2 id='login-cta-title' className='text-sm font-semibold'>
            더 많은 기능을 사용해보세요
          </h2>
          <p className='text-xs opacity-90'>로그인하면 기록, 피드백, 팔로우가 활성화됩니다.</p>
        </div>
        <button
          aria-label='로그인 페이지로 이동'
          title='로그인'
          className='cursor-pointer flex-shrink-0 inline-flex items-center justify-center h-10 px-4 rounded-lg bg-white text-primary font-semibold transition duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none motion-reduce:transform-none'
          onClick={handleLogin}
        >
          로그인
        </button>
      </div>
      {redirect && (
        <ConfirmModal
          type='positive'
          title='로그인 페이지로 이동'
          description='로그인 페이지로 이동합니다.'
          isOpen={redirect}
          onClose={() => setRedirect(false)}
          onConfirm={() => handleLogin()}
          confirmDisabled={false}
          children={<div className='text-xs opacity-90'>로그인 페이지로 이동합니다.</div>}
        />
      )}
    </section>
  );
};
