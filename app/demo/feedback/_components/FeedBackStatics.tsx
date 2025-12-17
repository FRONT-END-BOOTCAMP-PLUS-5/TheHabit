'use client';

import { CATEGORY_CONFIG } from '@/public/consts/categoryConfig';
import { Progress } from 'antd';
import React from 'react';

export const FeedBackStatics: React.FC = () => {
  return (
    <div className='w-5/6 mx-auto mt-10'>
      <h1 className='text-xl font-bold mb-3'>카테고리별 통계</h1>
      {CATEGORY_CONFIG.map(category => (
        <div key={category.id} className='w-full flex flex-row gap-2 mt-2'>
          <span className={`text-lg font-bold whitespace-nowrap w-2 ${category.textClass}`}>-</span>
          <h2 className='text-lg font-bold whitespace-nowrap w-1/5'>{category.name}</h2>
          <Progress percent={0} />
        </div>
      ))}
    </div>
  );
};
