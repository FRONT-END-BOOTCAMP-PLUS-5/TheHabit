"use client";

import ChallengesAccordion from "@/app/_components/challenges-accordion/ChallengesAccordion";
import WeeklySlide from "@/app/_components/weekly-slides/WeeklySlide";
import { getKoreanDateFromDate } from "@/public/utils/dateUtils";
import { useState } from "react";

const ChallengeListSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <section className="flex flex-col gap-2 px-2 py-2 w-full">
      <WeeklySlide onDateSelect={handleDateSelect} />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center font-bold text-2xl text-primary">
            {getKoreanDateFromDate(selectedDate)}
          </div>
          {/* 이 부분은 사용자의 챌린지 중 지속 기간이 가장 긴 챌린지만 출력합니다. -승민 */}
          <div className="flex items-center justify-center border-2 border-primary rounded-xl text-xl font-normal text-black py-1 px-2">
            🔥 <span className="font-bold text-[#007EA7]">매일 팔굽혀펴기</span>{" "}
            23일 연속 진행중!
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
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
      </div>
    </section>
  );
};

export default ChallengeListSection;
