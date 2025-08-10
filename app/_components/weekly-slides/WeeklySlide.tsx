"use client";

import { useState, useEffect } from "react";
import DayCard from "./DayCard";

interface DayCard {
  day: string;
  date: number;
  month?: string;
  isToday: boolean;
  isSelected: boolean;
}

interface WeeklySlideProps {
  onDateSelect?: (date: Date) => void;
}

const WeeklySlide: React.FC<WeeklySlideProps> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<DayCard[]>([]);

  // 현재 주의 날짜들을 생성하는 함수
  const generateWeekDays = (date: Date): DayCard[] => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // 일요일부터 시작

    const days: DayCard[] = [];
    const today = new Date();
    const isToday = (date: Date) =>
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      const dayNames = ["일", "월", "화", "수", "목", "금", "토", "일"];

      days.push({
        day: dayNames[i],
        date: currentDate.getDate(),
        month:
          currentDate.getMonth() !== today.getMonth()
            ? `${currentDate.getMonth() + 1}월`
            : undefined,
        isToday: isToday(currentDate),
        isSelected: isToday(currentDate),
      });
    }

    return days;
  };

  useEffect(() => {
    setWeekDays(generateWeekDays(selectedDate));
  }, [selectedDate]);

  const handleDateClick = (index: number) => {
    const newWeekDays = weekDays.map((day, i) => ({
      ...day,
      isSelected: i === index,
    }));
    setWeekDays(newWeekDays);

    // 선택된 날짜를 부모 컴포넌트로 전달
    if (onDateSelect) {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
      const clickedDate = new Date(startOfWeek);
      clickedDate.setDate(startOfWeek.getDate() + index);
      onDateSelect(clickedDate);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide min-w-full overflow-y-visible px-2 py-2">
        {weekDays.map((day, index) => (
          <DayCard
            key={index}
            day={day.day}
            date={day.date}
            month={day.month}
            isToday={day.isToday}
            isSelected={day.isSelected}
            onClick={() => handleDateClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklySlide;
