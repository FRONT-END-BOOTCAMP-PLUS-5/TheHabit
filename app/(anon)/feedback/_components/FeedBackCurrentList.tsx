'use client';

import { NONE_USER_CATEGORY_CONFIG } from '@/public/consts/noneUserCategory';
import Image from 'next/image';
import React, { useState } from 'react';
import { LoginCta } from '@/app/(anon)/_components/LoginCta';

const FeedBackCurrentList: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };
  return (
    <div className='w-5/6 mx-auto mt-10 flex flex-col gap-5'>
      {NONE_USER_CATEGORY_CONFIG.map(category => (
        <div key={category.id}>
          <p className='text-lg font-bold'>{category.detailName}</p>
          <div
            className='p-7 rounded-2xl h-full flex flex-col justify-center text-white relative'
            style={{ backgroundColor: category.color, opacity: 0.4 }}
          >
            <Image
              className='absolute rounded-full bg-white p-2'
              src={category.src}
              alt={category.name}
              width={40}
              height={40}
            />
            <button
              className='absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer'
              onClick={() => handleToggle(category.id)}
            >
              <Image
                src={
                  openId === category.id ? '/icons/icon_up_arrow.png' : '/icons/icon_down_arrow.svg'
                }
                alt='arrow-right'
                width={20}
                height={20}
              />
            </button>
            <p className='text-lg font-bold pl-12'>{category.name}</p>
          </div>
          {openId === category.id && (
            <div className='p-4 flex flex-col justify-center relative'>
              <LoginCta />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedBackCurrentList;
