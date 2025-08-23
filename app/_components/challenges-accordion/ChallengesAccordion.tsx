'use client';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import HealthIcon from '@/public/icons/icon_health.png';
import BookIcon from '@/public/icons/icon_study.svg';
import DevelopIcon from '@/public/icons/icon_develop.png';
import GuitarIcon from '@/public/icons/icon_guitar.png';
import UpArrow from '@/public/icons/icon_up_arrow.png';
import DownArrow from '@/public/icons/icon_down_arrow.svg';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { CHALLENGE_COLORS } from '@/public/consts/challengeColors';
import ChallengesAccordionContent from '@/app/_components/challenges-accordion/ChallengesAccordionContent';
import { StaticImageData } from 'next/image';

// ChallengesAccordion 컴포넌트는 피드백 및 분석에도 사용되므로 공통으로 분리하였습니다.
// - 승민 2025.08.23
interface ChallengesAccordionProps {
  challenge: ChallengeDto;
  routines: ReadRoutineResponseDto[];
  routineCompletions: RoutineCompletionDto[];
  selectedDate: Date; // 선택된 날짜 추가
  onRoutineAdded?: () => void;
}

const CATEGORY_ICON: Record<number, { icon: StaticImageData; alt: string }> = {
  1: {
    icon: HealthIcon,
    alt: 'health',
  },
  2: {
    icon: BookIcon,
    alt: 'book',
  },
  3: {
    icon: DevelopIcon,
    alt: 'develop',
  },
  4: {
    icon: GuitarIcon,
    alt: 'guitar',
  },
};

const ChallengesAccordion: React.FC<ChallengesAccordionProps> = ({
  challenge,
  routines,
  routineCompletions,
  selectedDate,
  onRoutineAdded,
}) => {
  // 완료된 루틴 비율에 따라 동적으로 너비 계산
  const completedRatio = (() => {
    if (routines.length === 0) return 0;

    // 이미 필터링된 routineCompletions를 사용
    const filteredRoutines = routines.filter(routine => routine.challengeId === challenge.id);
    const filteredCompletions = routineCompletions.filter(completion => {
      // 해당 챌린지의 루틴인지 확인
      const isRoutineInChallenge = filteredRoutines.some(
        routine => routine.id === completion.routineId
      );

      if (!isRoutineInChallenge) return false;

      // 선택된 날짜에 완료된 루틴인지 확인
      const completionDate = new Date(completion.createdAt);
      const selectedDateOnly = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      const completionDateOnly = new Date(
        completionDate.getFullYear(),
        completionDate.getMonth(),
        completionDate.getDate()
      );

      const isSameDate = completionDateOnly.getTime() === selectedDateOnly.getTime();

      return isSameDate;
    });

    const ratio = (filteredCompletions.length / filteredRoutines.length) * 100;

    return ratio;
  })();

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
    <div className='px-1 py-0.5 w-full rounded-lg'>
      <div
        className='w-full rounded-full relative overflow-hidden duration-300'
        style={{ backgroundColor: CHALLENGE_COLORS[challenge.categoryId].completed }}
      >
        <div
          className='absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out'
          style={
            {
              backgroundColor: CHALLENGE_COLORS[challenge.categoryId].background,
              width: `${completedRatio}%`,
              animation: 'progressFill 1s ease-out forwards',
              '--progress-width': `${completedRatio}%`,
            } as React.CSSProperties
          }
        ></div>

        <div className='flex items-center justify-between relative z-10 w-full'>
          <div className='flex flex-col gap-1 p-2'>
            <div className='flex items-center gap-2 min-w-0'>
              <div className='flex justify-center items-center rounded-full bg-white p-1 w-10 h-10 border-primary border-2 flex-shrink-0'>
                <Image
                  src={CATEGORY_ICON[challenge.categoryId].icon}
                  alt={CATEGORY_ICON[challenge.categoryId].alt}
                  width={24}
                  height={24}
                />
              </div>
              <div className='w-[80%] text-xl font-bold text-white truncate min-w-0 overflow-hidden flex-shrink-0'>
                {challenge.name}
              </div>
            </div>
          </div>
          <button
            className='w-[60px] flex items-center justify-center p-3 cursor-pointer'
            onClick={openHandler}
          >
            {isOpen ? (
              <Image src={UpArrow} alt='up-arrow' width={12} height={12} />
            ) : (
              <Image src={DownArrow} alt='down-arrow' width={12} height={12} />
            )}
          </button>
        </div>
      </div>

      {/* 아코디언 내용 영역 */}
      <div
        className='bg-white rounded-xl mt-3 overflow-hidden transition-all duration-300 ease-in-out border-2'
        style={{
          height: isOpen ? `${contentHeight}px` : '0px',
          opacity: isOpen ? 1 : 0,
          borderColor: CHALLENGE_COLORS[challenge.categoryId].background,
        }}
      >
        <div ref={contentRef}>
          <ChallengesAccordionContent
            challenge={challenge}
            routines={routines.filter(routine => routine.challengeId === challenge.id)}
            routineCompletions={routineCompletions.filter(completion => {
              // 해당 챌린지의 루틴인지 확인
              const isRoutineInChallenge = routines.some(
                routine =>
                  routine.id === completion.routineId && routine.challengeId === challenge.id
              );

              if (!isRoutineInChallenge) return false;

              // 선택된 날짜에 완료된 루틴인지 확인
              const completionDate = new Date(completion.createdAt);
              const selectedDateOnly = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate()
              );
              const completionDateOnly = new Date(
                completionDate.getFullYear(),
                completionDate.getMonth(),
                completionDate.getDate()
              );

              return completionDateOnly.getTime() === selectedDateOnly.getTime();
            })}
            selectedDate={selectedDate}
            onRoutineAdded={onRoutineAdded}
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengesAccordion;
