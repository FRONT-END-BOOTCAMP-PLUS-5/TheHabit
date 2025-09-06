'use client';

import WeeklySlide from '@/app/_components/weekly-slides/WeeklySlide';
import { useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import { LoginCta } from '@/app/(anon)/_components/LoginCta';

const ChallengeListSection: React.FC = () => {
  const [, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <section className='flex flex-col gap-2 px-3 py-2 w-full relative mb-10'>
      <WeeklySlide onDateSelect={handleDateSelect} />
      <div className='flex flex-col gap-4 items-center justify-center text-center py-8'>
        <div className='text-2xl font-bold text-secondary'>아직 등록된 챌린지가 없어요</div>
        <div className='text-gray-500'>새 챌린지를 만들어 오늘부터 시작해보세요.</div>
      </div>
      <LoginCta />
    </section>
  );
};

export default ChallengeListSection;
