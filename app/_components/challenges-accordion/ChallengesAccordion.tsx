"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import UpArrow from "@/public/icons/icon_up_arrow.png";
import DownArrow from "@/public/icons/icon_down_arrow.svg";

//props 임시임 -승민
interface ChallengesAccordionProps {
  title: string;
  totalRoutines: number;
  completedRoutines: number;
  backgroundColor: string;
  completedColor: string;
  category: number;
}

const CATEGORY_ICON: { [key: number]: string } = {
  0: "💪",
  1: "📚",
  2: "💻",
  3: "🎸",
};

const ChallengesAccordion: React.FC<ChallengesAccordionProps> = ({
  title,
  totalRoutines,
  completedRoutines,
  backgroundColor,
  completedColor,
  category,
}) => {
  // 완료된 루틴 비율에 따라 동적으로 너비 계산
  const completedRatio =
    totalRoutines > 0 ? (completedRoutines / totalRoutines) * 100 : 0;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const openHandler = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [isOpen]);

  return (
    <div className="px-1 py-0.5 w-full rounded-lg">
      <div
        className={`w-full rounded-lg relative overflow-hidden ${completedColor}`}
      >
        <div
          className={`absolute top-0 left-0 h-full rounded-l-lg ${backgroundColor}`}
          style={{ width: `${completedRatio}%` }}
        ></div>

        <div className="flex items-center justify-between relative z-10 w-full">
          <div className="flex flex-col gap-1 p-3">
            <div className="flex items-center gap-1 font-bold text-2xl text-white">
              <div className="flex justify-center items-center rounded-full bg-white p-1 w-10 h-10 border-primary border-2">
                {CATEGORY_ICON[category]}
              </div>
              <div className="text-2xl font-bold text-white">{title}</div>
            </div>
            <div className="text-sm font-bold text-white">
              {totalRoutines}개의 루틴 중 {completedRoutines}개 완료
            </div>
          </div>
          <button
            className="w-[60px] flex items-center justify-center p-3 cursor-pointer"
            onClick={openHandler}
          >
            {isOpen ? (
              <Image src={UpArrow} alt="up-arrow" width={16} height={16} />
            ) : (
              <Image src={DownArrow} alt="down-arrow" width={16} height={16} />
            )}
          </button>
        </div>
      </div>

      {/* 아코디언 내용 영역 */}
      <div
        className={`bg-white rounded-lg mt-1 overflow-hidden transition-all duration-300 ease-in-out border-2`}
        style={{
          height: isOpen ? `${contentHeight}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="p-3">
          {/* 완료된 루틴 표시 */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-8 h-8 rounded-full ${backgroundColor} flex items-center justify-center`}
            >
              <div className="text-white text-sm">✓</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-yellow-500 text-lg">🛹</div>
              <span className="text-primary-grey font-medium">
                스케이트보드 알리 연습
              </span>
            </div>
          </div>

          {/* 새로운 루틴 추가 버튼 */}
          <div className="flex justify-center">
            <button className="bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold py-2 px-4 cursor-pointer">
              + 루틴 추가하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesAccordion;
