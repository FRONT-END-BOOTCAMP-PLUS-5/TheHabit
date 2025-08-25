'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { getTabItems } from '@/public/consts/tabItem';
import homeIcon from '@/public/icons/home.svg';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';


export const TabNavigation = () => {
  const [isHover, setIsHover] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const { userInfo } = useGetUserInfo();
  const tabItems = getTabItems(userInfo?.nickname || '');
  

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
    <nav className='sticky bottom-0'>
      <ul className=' w-11/12 h-22 flex justify-around bg-white shadow-[0_0_20px_rgba(0,0,0,0.3)] items-center rounded-xl mx-auto'>
        {tabItems.map((item, i) => (
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
        <div className='w-15 h-15 bg-[#93D50B] absolute bottom-7/11 cursor-pointer hover:scale-110 transition-all duration-300 hover:opacity-90 flex items-center justify-center rounded-full'>
          <Link
            href={userInfo?.nickname ? `/user/dashboard/${userInfo.nickname}` : '/login'}
          >
            <Image
              src={homeIcon}
              alt='홈으로 이동'
              className='w-10 h-10 cursor-pointer hover:scale-110 transition-all duration-300 hover:opacity-90'
            />
          </Link>
        </div>
      </ul>
    </nav>
  );
};
