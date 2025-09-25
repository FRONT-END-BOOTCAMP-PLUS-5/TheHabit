'use client';

// app/user/feedback/_components/Swiper.tsx
import React from 'react';
import Image from 'next/image';
import { FeedBackEmptyIcon, FeedBackErrorIcon, FeedBackSuccessIcon } from './FeedbackIcon';

export const SlideContent: React.FC<{
  src?: string;
  name?: string;
  color?: string;
  categoryName?: string;
  dailyCompletions: (boolean | null)[];
}> = React.memo(({ name, src, color, dailyCompletions, categoryName }) => {
  return (
    <div className='p-5'>
      <h3 className='text-xl font-bold flex items-center relative'>
        <p className='w-2/3 whitespace-nowrap overflow-hidden text-ellipsis'>{name}</p>
        {src && (
          <div
            className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm border'
            style={{ backgroundColor: `${color}22`, borderColor: color }}
          >
            <Image
              src={src}
              alt={name || ''}
              width={18}
              height={18}
              className='rounded-full border border-white/50 shadow-sm'
            />
            <span className='text-sm font-bold' style={{ color: color }}>
              {categoryName}
            </span>
          </div>
        )}
      </h3>
      <div className='text-center grid grid-cols-7 gap-3 pt-10'>
        {dailyCompletions.map((isCompleted, i) => (
          <div key={i} className='rounded-full text-white text-xs font-bold'>
            {isCompleted === null ? (
              <FeedBackEmptyIcon />
            ) : isCompleted ? (
              <FeedBackSuccessIcon />
            ) : (
              <FeedBackErrorIcon />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
