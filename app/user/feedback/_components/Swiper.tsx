'use client';

// app/user/feedback/_components/Swiper.tsx
import React from 'react';
import Image from 'next/image';
import {
  FeedBackEmptyIcon,
  FeedBackErrorIcon,
  FeedBackSuccessIcon,
} from '@/app/user/feedback/_components/FeedbackIcon';

type SlideContentProps = {
  name?: string;
  categorySrc?: string;
  categoryName?: string;
  categoryColor?: string;
  dailyCompletions: (boolean | null)[];
};

export const SlideContent: React.FC<SlideContentProps> = React.memo(function SlideContent({
  name,
  categorySrc,
  categoryName,
  categoryColor,
  dailyCompletions,
}) {
  return (
    <div className='p-5'>
      <h3 className='text-xl font-bold flex items-center relative'>
        <p className='w-2/3 whitespace-nowrap overflow-hidden text-ellipsis'>{name}</p>
        {categorySrc && (
          <div
            className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm border'
            style={{ backgroundColor: `${categoryColor}22`, borderColor: categoryColor }}
          >
            <Image
              src={categorySrc}
              alt={categoryName || ''}
              width={18}
              height={18}
              className='rounded-full border border-white/50 shadow-sm'
            />
            <span className='text-sm font-bold' style={{ color: categoryColor }}>
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
