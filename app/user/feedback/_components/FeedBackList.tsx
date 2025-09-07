'use client';

import { useState } from 'react';
import { FeedBackStatistics } from '@/app/user/feedback/_components/FeedBackStatistics';
import { useGetDashboardByNickname } from '@/libs/hooks/dashboard-hooks/useGetDashboardByNickname';
import { FeedBackCategoryProgress } from '@/app/user/feedback/_components/FeedBackCategoryProgress';
import { FeedBackDescription } from '@/app/user/feedback/_components/FeedBackDescription';
import { FeedBackDetail } from '@/app/user/feedback/_components/FeedBackDetail';
import { FeedBackBarChart } from '@/app/user/feedback/_components/FeedBackBarChart';
import { FeedBackSkeleton } from '@/app/user/feedback/_components/FeedBackSkeleton';

const FEEDBACK_CATEGORIES = [
  { id: 1, name: '통계' },
  { id: 2, name: '분석' },
] as const;

interface FeedBackListProps {
  nickname?: string;
}

export const FeedBackList: React.FC<FeedBackListProps> = ({ nickname }) => {
  const { data: dashBoardData, isLoading } = useGetDashboardByNickname(nickname || '');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('통계');

  const handleModal = (name: string) => {
    setSelectedCategoryName(name);
  };

  return (
    <section className='flex flex-col mt-10 w-full mb-20'>
      <nav className='flex flex-1 items-center justify-between w-full h-1/3'>
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
      </nav>
      {isLoading || !nickname ? (
        <FeedBackSkeleton />
      ) : (
        <>
          {selectedCategoryName === '통계' ? (
            <div className='flex flex-col gap-10 w-6/7 mx-auto'>
              {dashBoardData && (
                <>
                  <FeedBackStatistics dashBoardData={dashBoardData} />
                  <FeedBackDescription />
                  <FeedBackCategoryProgress dashBoardData={dashBoardData} />
                  <FeedBackBarChart dashBoardData={dashBoardData} />
                </>
              )}
            </div>
          ) : (
            <FeedBackDetail nickname={nickname} />
          )}
        </>
      )}
    </section>
  );
};
