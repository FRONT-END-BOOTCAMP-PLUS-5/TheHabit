'use client';

import React, { useState } from 'react';
import { FeedBackBar } from '@/app/(anon)/feedback/_components/FeedBackBar';
import { FeedBackStatics } from '@/app/(anon)/feedback/_components/FeedBackStatics';
import { FeedBackList } from '@/app/(anon)/feedback/_components/FeedBackList';
import FeedBackCurrentList from '@/app/(anon)/feedback/_components/FeedBackCurrentList';

export const FeedbackNav: React.FC = () => {
  const FEEDBACK_CATEGORIES = [
    { id: 1, name: '통계' },
    { id: 2, name: '분석' },
  ] as const;

  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('통계');

  const handleModal = (name: string) => {
    setSelectedCategoryName(name);
  };

  return (
    <div className='flex flex-col mt-5 w-full'>
      <div className='w-full flex justify-center'>
        {FEEDBACK_CATEGORIES.map(linkItem => {
          return (
            <div key={linkItem.id} className='w-1/2 flex items-center justify-center'>
              <button
                className={`text-xl font-bold cursor-pointer ${
                  selectedCategoryName === linkItem.name
                    ? 'border-b-3 border-primary w-1/3 pb-2'
                    : 'border-b-3 border-transparent w-1/3 pb-2'
                }`}
                onClick={() => handleModal(linkItem.name)}
              >
                <p>{linkItem.name}</p>
              </button>
            </div>
          );
        })}
      </div>
      {selectedCategoryName === '통계' && (
        <>
          <FeedBackList />
          <FeedBackStatics />
          <FeedBackBar />
        </>
      )}
      {selectedCategoryName === '분석' && (
        <>
          <FeedBackCurrentList />
        </>
      )}
    </div>
  );
};
