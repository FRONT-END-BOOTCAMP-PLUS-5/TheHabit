"use client";

import ChallengesAccordion from "@/app/_components/challenges-accordion/ChallengesAccordion";
import WeeklySlide from "@/app/_components/weekly-slides/WeeklySlide";
import { getKoreanDate, getKoreanDateFromDate } from "@/public/utils/dateUtils";
import { useState } from "react";

const ChallengeListSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <section className="flex flex-col gap-1 px-2 py-2 w-full">
      <WeeklySlide onDateSelect={handleDateSelect} />
      <div className="flex flex-col gap-1">
        <div className="font-bold text-2xl">
          {getKoreanDateFromDate(selectedDate)}
        </div>
        <div className="text-sm font-normal text-primary-grey">
          3개의 챌린지
        </div>
        <ChallengesAccordion
          title="매일 팔굽혀펴기"
          totalRoutines={3}
          completedRoutines={0}
          backgroundColor="bg-[#007EA7]"
          completedColor="bg-[#AAE3F6]"
          category={0}
        />
        <ChallengesAccordion
          title="독서 습관 들이기"
          totalRoutines={3}
          completedRoutines={1}
          backgroundColor="bg-[#FFD447]"
          completedColor="bg-[#FFE89B]"
          category={1}
        />
        <ChallengesAccordion
          title="매일 스케이트보드 타기"
          totalRoutines={3}
          completedRoutines={2}
          backgroundColor="bg-[#FA6A8E]"
          completedColor="bg-[#FFB5C7]"
          category={3}
        />
      </div>
    </section>
  );
};

export default ChallengeListSection;
