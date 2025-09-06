'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Tooltip,
  LabelList,
} from 'recharts';
import { CATEGORY_CONFIG } from '@/public/consts/categoryConfig';

export const FeedBackBar: React.FC = () => {
  return (
    <div className='w-5/6 mx-auto mt-10'>
      <h1 className='text-xl font-bold mb-3'>카테고리별 챌린지 현황</h1>

      <div className='w-full h-[350px] rounded-xl mb-20 backdrop-blur border border-gray-200 shadow-sm'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={CATEGORY_CONFIG}
            barSize={28}
            margin={{ top: 24, right: 24, left: 4, bottom: 8 }}
          >
            <defs>
              <linearGradient id='barGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#7C3AED' />
                <stop offset='100%' stopColor='#3B82F6' />
              </linearGradient>
            </defs>
            <CartesianGrid stroke='#E5E7EB' strokeDasharray='3 3' vertical={false} />
            <XAxis dataKey='name' tickLine={false} axisLine={false} tickMargin={8} />
            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            <Bar dataKey='value' radius={[8, 8, 8, 8]} fill='url(#barGradient)'>
              <LabelList dataKey='value' position='top' className='fill-gray-700 text-[12px]' />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
