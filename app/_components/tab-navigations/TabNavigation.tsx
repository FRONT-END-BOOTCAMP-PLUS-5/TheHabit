'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { tabItem } from '@/public/consts/tabItem';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/app/_components/modals/ConfirmModal';
import Image from 'next/image';

export const TabNavigation = () => {
  const router = useRouter();
  const [isHover, setIsHover] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const { userInfo } = useGetUserInfo();
  const [isOpen, setIsOpen] = useState(false);
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

  const handleClick = (href: string) => {
    if (href === '/') {
      setIsOpen(prev => !prev);
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <nav className='fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[480px] z-50'>
        <ul className='relative h-16 flex justify-around bg-white shadow-[0_6px_24px_rgba(0,0,0,0.12)] items-center rounded-2xl mx-auto px-2'>
          {tabItem(nickname).map((item, i) => (
            <li key={i}>
              <button
                onClick={() => handleClick(item.href)}
                className='cursor-pointer w-12 h-12 flex justify-center items-center'
              >
                <Image
                  src={isHover === item.name ? item.isHover : item.icon}
                  alt={item.name}
                  title={item.name}
                  onMouseLeave={isMouseOut}
                  onMouseEnter={() => isMouseHover(item.name)}
                />
              </button>
            </li>
          ))}
          <li className='absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#93D50B] cursor-pointer hover:scale-105 transition-transform duration-200 hover:opacity-95 flex items-center justify-center rounded-full shadow-lg'>
            <Link href={userInfo?.nickname ? `/user/dashboard/${userInfo.nickname}` : '/'}>
              <Image src='/icons/home.svg' alt='홈으로 이동' width={24} height={24} />
            </Link>
          </li>
        </ul>
      </nav>
      {isOpen && (
        <ConfirmModal
          type='positive'
          isOpen={isOpen}
          title='로그인을 진행해주세요'
          description='로그인 페이지로 이동하시겠습니까?'
          onClose={() => setIsOpen(false)}
          onConfirm={() => router.push('/login')}
        >
          <span></span>
        </ConfirmModal>
      )}
    </>
  );
};
