'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
//TODO : 최장 스트릭 정보 가져오기
const Header: React.FC = () => {
  return (
    <header className='w-full py-4 relative'>
      <h1 className='text-center text-[#93D50B]'>
        <Link className='text-3xl font-black' href='/'>
          The:Habit
        </Link>
      </h1>
      <Link
        href='/login'
        className='absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer'
      >
        <Image src='/icons/login.svg' alt='로그인' width={24} height={24} />
      </Link>
    </header>
  );
};

export default Header;
