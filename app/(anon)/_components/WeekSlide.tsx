'use client';

import { useMemo } from 'react';
import DayCard from '@/app/_components/weekly-slides/DayCard';

interface DayCard {
  day: string;
  date: number;
  month?: string;
  isToday: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

interface WeeklySlideProps {
  onDateSelect?: (date: Date) => void;
}

const WeeklySlide: React.FC<WeeklySlideProps> = ({ onDateSelect: _onDateSelect }) => {
  // useMemo로 날짜 계산 최적화
  const weekDays = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // 일요일부터 시작

    const days: DayCard[] = [];
    const isToday = (date: Date) =>
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      days.push({
        day: dayNames[i],
        date: currentDate.getDate(),
        month:
          currentDate.getMonth() !== today.getMonth()
            ? `${currentDate.getMonth() + 1}월`
            : undefined,
        isToday: isToday(currentDate),
      });
    }

    return days;
  }, []);

  return (
    <div className='w-full'>
      <div className='flex gap-1 overflow-x-auto scrollbar-hide min-w-full overflow-y-visible px-2 py-2'>
        {weekDays.map((day, index) => (
          <DayCard
            key={index}
            day={day.day}
            date={day.date}
            month={day.month}
            isToday={day.isToday}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklySlide;
