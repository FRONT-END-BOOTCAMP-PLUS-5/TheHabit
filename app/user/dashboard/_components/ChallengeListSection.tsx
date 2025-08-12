"use client";

import ChallengesAccordion from "@/app/_components/challenges-accordion/ChallengesAccordion";
import WeeklySlide from "@/app/_components/weekly-slides/WeeklySlide";
import { getKoreanDateFromDate } from "@/public/utils/dateUtils";
import { useState } from "react";
import { Radio, RadioChangeEvent } from "antd";
import AddChallengeButton from "./AddChallengeButton";
import "@ant-design/v5-patch-for-react-19";
import { useModalStore } from "@/libs/stores/modalStore";
import AddChallengeForm from "./AddChallengeForm";

const ChallengeListSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSort, setSelectedSort] = useState<string>("all");
  const { openModal } = useModalStore();

  // 카테고리별 색상 목록
  const categoryColors = {
    0: { background: "#FA6A8E", completed: "#FFB5C7" }, // 건강 - 분홍색
    1: { background: "#FFD447", completed: "#FFE89B" }, // 학습 - 노란색
    2: { background: "#007EA7", completed: "#AAE3F6" }, // 개발 - 파란색
    3: { background: "#A88BDB", completed: "#CFBBF1" }, // 취미 - 보라색
  };

  const handleOpenModal = () => {
    openModal(<AddChallengeForm />);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSort = (e: RadioChangeEvent) => {
    setSelectedSort(e.target.value);
  };

  const allChallenges: React.ReactNode = (
    <div className="flex flex-col gap-0.5">
      <ChallengesAccordion
        title="매일 팔굽혀펴기"
        totalRoutines={3}
        completedRoutines={2}
        backgroundColor={categoryColors[0].background}
        completedColor={categoryColors[0].completed}
        category={0}
      />
      <ChallengesAccordion
        title="매일 영어 스피킹"
        totalRoutines={3}
        completedRoutines={2}
        backgroundColor={categoryColors[1].background}
        completedColor={categoryColors[1].completed}
        category={1}
      />
      <ChallengesAccordion
        title="매일 아침 8시 기상"
        totalRoutines={3}
        completedRoutines={2}
        backgroundColor={categoryColors[2].background}
        completedColor={categoryColors[2].completed}
        category={2}
      />
      <ChallengesAccordion
        title="여자친구 만들기"
        totalRoutines={3}
        completedRoutines={1}
        backgroundColor={categoryColors[3].background}
        completedColor={categoryColors[3].completed}
        category={3}
      />
    </div>
  );

  const categoryChallenges: React.ReactNode = (
    <div className="flex flex-col gap-0.5">
      <div className="flex flex-col gap-0.5">
        <div className="text-lg font-bold text-secondary">건강</div>
        <div className="flex flex-col gap-0.5">
          <ChallengesAccordion
            title="매일 팔굽혀펴기"
            totalRoutines={3}
            completedRoutines={2}
            backgroundColor="bg-[#4FB9A8]"
            completedColor="bg-[#a4dfd5]"
            category={0}
          />
          <ChallengesAccordion
            title="매일 팔굽혀펴기"
            totalRoutines={3}
            completedRoutines={2}
            backgroundColor="bg-[#4FB9A8]"
            completedColor="bg-[#a4dfd5]"
            category={0}
          />
          <ChallengesAccordion
            title="매일 팔굽혀펴기"
            totalRoutines={3}
            completedRoutines={2}
            backgroundColor="bg-[#4FB9A8]"
            completedColor="bg-[#a4dfd5]"
            category={0}
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-lg font-bold text-secondary">공부</div>
          <div className="flex flex-col gap-0.5">
            <ChallengesAccordion
              title="매일 영어 스피킹"
              totalRoutines={3}
              completedRoutines={2}
              backgroundColor="bg-[#5BA9D9]"
              completedColor="bg-[#88c0e3]"
              category={0}
            />
            <ChallengesAccordion
              title="TOEIC 700점 목표"
              totalRoutines={3}
              completedRoutines={2}
              backgroundColor="bg-[#5BA9D9]"
              completedColor="bg-[#88c0e3]"
              category={0}
            />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-lg font-bold text-secondary">자기계발</div>
          <div className="flex flex-col gap-0.5">
            <ChallengesAccordion
              title="매일 아침 8시 기상"
              totalRoutines={3}
              completedRoutines={2}
              backgroundColor="bg-[#F28C6B]"
              completedColor="bg-[#f8beab]"
              category={2}
            />
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="text-lg font-bold text-secondary">기타</div>
          <div className="flex flex-col gap-0.5">
            <ChallengesAccordion
              title="여자친구 만들기"
              totalRoutines={3}
              completedRoutines={1}
              backgroundColor="bg-[#A88BDB]"
              completedColor="bg-[#cfbbf1]"
              category={3}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="flex flex-col gap-2 px-2 py-2 w-full relative mb-10">
      <WeeklySlide onDateSelect={handleDateSelect} />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center font-bold text-2xl text-secondary">
            {getKoreanDateFromDate(selectedDate)}
          </div>
          <div className="flex justify-center w-full">
            <Radio.Group
              onChange={(e) => handleSort(e)}
              value={selectedSort}
              style={{
                marginBottom: 8,
                display: "flex",
                width: "50%",
                justifyContent: "center",
              }}
              buttonStyle="solid"
              className="custom-radio-group w-full max-w-md"
            >
              <Radio.Button value="all" className="flex-1 text-center">
                전체
              </Radio.Button>
              <Radio.Button value="category" className="flex-1 text-center">
                카테고리
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
        {selectedSort === "all" ? allChallenges : categoryChallenges}
      </div>
      <AddChallengeButton onClick={handleOpenModal} />
    </section>
  );
};

export default ChallengeListSection;
