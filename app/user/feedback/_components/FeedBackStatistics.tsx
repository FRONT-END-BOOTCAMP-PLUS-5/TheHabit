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
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

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
    <section className='w-full mt-10 rounded-lg shadow-md'>
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
        {challengeCompletionData.map(data => (
          <SwiperSlide key={data.challenge.id}>
            <div className='p-5'>
              <h3 className='text-xl font-bold mb-4 text-ellipsis overflow-hidden whitespace-nowrap'>
                {data.challenge.name}
              </h3>
              <div className={`text-center grid grid-cols-7 gap-3`}>
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
        ))}
      </Swiper>
    </section>
  );
};
