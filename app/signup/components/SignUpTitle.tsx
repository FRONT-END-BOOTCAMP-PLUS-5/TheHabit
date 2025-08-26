'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

export const SignUpTitle = () => {
  const router = useRouter();

  return (
    <div className='flex items-center justify-center relative w-full'>
      <Image
        onClick={() => router.back()}
        src='/icons/back.svg'
        alt='뒤로가기'
        width={20}
        height={20}
        className='cursor-pointer absolute left-5'
      />
      <h1 className='text-4xl font-bold'>회원가입</h1>
    </div>
  );
};
