'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { tabItem } from '@/public/consts/tabItem';
import homeIcon from '@/public/icons/home.svg';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';

export const TabNavigation = () => {
  const [isHover, setIsHover] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const { userInfo } = useGetUserInfo();
  const nickname = userInfo?.nickname;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMouseHover = (name: string) => {
    setIsHover(name);
  };

  const isMouseOut = () => {
    setIsHover('');
  };

  // 서버사이드 렌더링 방지
  if (!mounted) {
    return null;
  }

  return (
    <nav className='fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[480px] z-50'>
      <ul className='relative h-16 flex justify-around bg-white shadow-[0_6px_24px_rgba(0,0,0,0.12)] items-center rounded-2xl mx-auto px-2'>
        {tabItem(nickname).map((item, i) => (
          <li key={i}>
            <Link href={item.href || ''} className='w-12 h-12 flex justify-center items-center'>
              <Image
                src={isHover === item.name ? item.isHover : item.icon}
                alt={item.name}
                className='w-7 h-7'
                onMouseLeave={isMouseOut}
                onMouseEnter={() => isMouseHover(item.name)}
              />
            </Link>
          </li>
        ))}
        <div className='absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#93D50B] cursor-pointer hover:scale-105 transition-transform duration-200 hover:opacity-95 flex items-center justify-center rounded-full shadow-lg'>
          <Link href={userInfo?.nickname ? `/user/dashboard/${userInfo.nickname}` : '/login'}>
            <Image src={homeIcon} alt='홈으로 이동' className='w-8 h-8' />
          </Link>
        </div>
      </ul>
    </nav>
  );
};
