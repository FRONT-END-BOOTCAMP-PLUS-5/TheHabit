'use client';

import { FEEDBACK_DESCRIPTION } from '@/public/consts/feedBackItem';
import Image from 'next/image';
import React from 'react';

export const FeedBackList: React.FC = () => {
  return (
    <section
      className='flex flex-col mt-10 w-full mb-20'
      role='region'
      aria-labelledby='feedback-title'
    >
      <div className='w-5/6 h-54 mx-auto grid grid-cols-7 rounded-xl shadow-md py-2'>
        <h2 id='feedback-title' className='text-xl font-bold col-span-7 pl-3 pt-5'>
          챌린지를 생성해주세요
        </h2>
        {Array.from({ length: 21 }).map((_, index) => (
          <div key={index} className='w-full mx-auto flex items-center justify-center'>
            <Image src='/icons/notCompleted.svg' alt='notCompleted' width={25} height={25} />
          </div>
        ))}
      </div>
      <ol className='flex justify-end gap-5 w-5/6 mx-auto mt-5'>
        {FEEDBACK_DESCRIPTION.map(item => (
          <li key={item.id} className='flex items-center gap-2'>
            <Image src={item.icon} alt={item.description} width={20} height={20} />
            <p className='text-sm'>{item.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};
