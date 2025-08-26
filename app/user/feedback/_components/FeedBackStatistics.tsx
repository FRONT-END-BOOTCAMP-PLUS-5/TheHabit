'use client';

import { Pagination, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { DashboardDto } from '@/backend/dashboards/application/dtos/DashboardDto';
import 'swiper/css';
import 'swiper/css/pagination';
import { useMemo } from 'react';
import {
  FeedBackEmptyIcon,
  FeedBackErrorIcon,
  FeedBackSuccessIcon,
} from '@/app/user/feedback/_components/FeedbackIcon';
import { calculateSingleChallengeProgress } from '@/app/user/feedback/_components/CalcFeedBackData';
import { CATEGORY_CONFIG } from '@/public/consts/categoryConfig';
import Image from 'next/image';

export const FeedBackStatistics: React.FC<{ dashBoardData: DashboardDto }> = ({
  dashBoardData,
}) => {
  const { challenge, routines, routineCompletions } = dashBoardData;

  // 각 챌린지별 완료 데이터를 미리 계산 (메모이제이션)
  const challengeCompletionData = useMemo(
    () =>
      challenge.map(currentChallenge => {
        const start = new Date(currentChallenge.createdAt);
        const end = new Date(currentChallenge.endAt);
        const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        const { dailyCompletions } = calculateSingleChallengeProgress(
          currentChallenge,
          routines,
          routineCompletions,
          days
        );

        return {
          challenge: currentChallenge,
          days,
          dailyCompletions,
        };
      }),
    [challenge, routines, routineCompletions]
  );

  if (!challenge || challenge.length === 0) {
    return (
      <div className='w-full text-center p-8'>
        <p className='text-gray-500'>챌린지가 없습니다.</p>
      </div>
    );
  }

  return (
    <section className={`w-full mt-10 rounded-lg shadow-md`}>
      <Swiper
        modules={[Pagination, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        speed={300}
        autoHeight={true}
        observer={true}
        observeParents={true}
        loop={true}
        touchRatio={1}
        resistance={false}
        freeMode={false}
        touchStartPreventDefault={false}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: (index, className) => {
            return `<span class="${className} custom-bullet">${index + 1}</span>`;
          },
        }}
        className='challenge-swiper'
      >
        {challengeCompletionData.map(data => {
          const categoryInfo = CATEGORY_CONFIG.find(c => c.id === data.challenge.categoryId);
          return (
            <SwiperSlide key={data.challenge.id}>
              <div className='p-5'>
                <h3 className='text-xl font-bold flex items-center relative'>
                  <p className='w-2/3 whitespace-nowrap overflow-hidden text-ellipsis'>
                    {data.challenge.name}
                  </p>
                  {categoryInfo?.src && (
                    <div
                      className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm border'
                      style={{
                        backgroundColor: `${categoryInfo.color}22`,
                        borderColor: categoryInfo.color,
                      }}
                    >
                      <Image
                        className='rounded-full border border-white/50 shadow-sm'
                        src={categoryInfo.src}
                        alt={categoryInfo.alt || ''}
                        width={18}
                        height={18}
                      />
                      <span className='text-sm font-bold' style={{ color: categoryInfo.color }}>
                        {categoryInfo.name}
                      </span>
                    </div>
                  )}
                </h3>
                <div className={`text-center grid grid-cols-7 gap-3 pt-10`}>
                  {data.dailyCompletions.map((isCompleted, dayIndex) => (
                    <div key={dayIndex} className={`rounded-full text-white text-xs font-bold `}>
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
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};
