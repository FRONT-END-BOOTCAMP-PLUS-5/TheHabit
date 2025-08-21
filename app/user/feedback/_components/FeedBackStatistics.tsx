'use client';

import { Pagination, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { DashboardDto } from '@/backend/dashboards/application/dtos/DashboardDto';
import { getDateString } from '@/public/utils/dateUtils';
import 'swiper/css';
import 'swiper/css/pagination';

export const FeedBackStatistics = ({ dashBoardData }: { dashBoardData: DashboardDto }) => {
  const { challenge, routines, routineCompletions } = dashBoardData;

  // 각 챌린지별 완료 데이터를 미리 계산
  const challengeCompletionData = challenge.map(currentChallenge => {
    const heatMap = getDateString(new Date(currentChallenge?.createdAt));

    // 21일 카운트 해야함
    const days = 21;
    const dataArray = Array.from({ length: days }, (_, i) => {
      const date = new Date(heatMap);
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    const currentChallengeRoutineIds = routines
      .filter(routine => routine.challengeId === currentChallenge?.id)
      .map(routine => routine.id);

    const completion = dataArray.map(date => {
      const dailyCompletions = routineCompletions.filter(completion => {
        const completionDate = getDateString(new Date(completion.createdAt));

        return (
          completionDate === date &&
          currentChallengeRoutineIds.includes(completion.routineId) &&
          completion.content &&
          completion.content.trim() !== ''
        );
      });

      const completedRoutineIds = dailyCompletions.map(completion => completion.routineId);

      const allRoutinesCompleted =
        currentChallengeRoutineIds.length > 0 &&
        currentChallengeRoutineIds.every(routineId => completedRoutineIds.includes(routineId));

      return allRoutinesCompleted;
    });

    return {
      challenge: currentChallenge,
      dataArray,
      completion,
    };
  });

  if (!challenge || challenge.length === 0) {
    return (
      <div className='w-full text-center p-8'>
        <p className='text-gray-500'>챌린지가 없습니다.</p>
      </div>
    );
  }

  return (
    <section className='w-full mt-10 h-full p-2 rounded-lg shadow-md'>
      <Swiper
        modules={[Pagination, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        speed={500}
        threshold={10}
        loop={true}
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
            <div className='p-4'>
              <h3 className='text-xl font-bold mb-4'>{data.challenge.name}</h3>
              <div className='text-center grid gap-6 grid-cols-7'>
                {data.dataArray.map((_, dayIndex) => {
                  const isCompleted = data.completion[dayIndex];
                  return (
                    <Image
                      key={dayIndex}
                      src={isCompleted ? '/icons/completed.svg' : '/icons/notCompleted.svg'}
                      alt={isCompleted ? 'completed' : 'not completed'}
                      width={20}
                      height={20}
                      className='w-5 h-5'
                    />
                  );
                })}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
