'use client';

import { Pagination, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { DashboardDto } from '@/backend/dashboards/application/dtos/DashboardDto';
import 'swiper/css';
import 'swiper/css/pagination';
import React, { useMemo } from 'react';
import { calculateSingleChallengeProgress } from '@/app/user/feedback/_components/CalcFeedBackData';
import { CATEGORY_CONFIG } from '@/public/consts/categoryConfig';
import { SlideContent } from '@/app/user/feedback/_components/Swiper';

export const FeedBackStatistics: React.FC<{ dashBoardData: DashboardDto }> = ({
  dashBoardData,
}) => {
  const { challenge, routines, routineCompletions } = dashBoardData;

  const categoryById = CATEGORY_CONFIG.map(category => ({
    [category.id]: category,
  }));

  // 슬라이드에 전달할 최소 데이터만 구성
  const slidesData = useMemo(() => {
    return challenge.map(challenge => {
      const start = new Date(challenge.createdAt);
      const end = new Date(challenge.endAt);
      const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const { dailyCompletions } = calculateSingleChallengeProgress(
        challenge,
        routines,
        routineCompletions,
        days
      );
      const category = CATEGORY_CONFIG.find(
        challengeCategory => challengeCategory.id === challenge.categoryId
      );
      return {
        id: challenge.id,
        name: challenge.name,
        src: category?.src,
        color: category?.color,
        dailyCompletions,
        categoryName: category?.name,
      };
    });
  }, [challenge, routines, routineCompletions, categoryById]);

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
        loop={true}
        touchRatio={1}
        autoHeight={true}
        resistance={false}
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
        {slidesData.map(slide => (
          <SwiperSlide key={slide.id}>
            <SlideContent
              name={slide.name}
              src={slide.src}
              color={slide.color}
              dailyCompletions={slide.dailyCompletions}
              categoryName={slide.categoryName}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
