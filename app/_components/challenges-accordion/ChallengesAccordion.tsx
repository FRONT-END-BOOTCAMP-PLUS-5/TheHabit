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

//props 임시임 -승민
interface ChallengesAccordionProps {
  challenge: ChallengeDto;
  routines: ReadRoutineResponseDto[];
  routineCompletions: RoutineCompletionDto[];
}

const CATEGORY_ICON: Record<number, { icon: StaticImageData; alt: string }> = {
  0: {
    icon: HealthIcon,
    alt: 'health',
  },
  1: {
    icon: BookIcon,
    alt: 'book',
  },
  2: {
    icon: DevelopIcon,
    alt: 'develop',
  },
  3: {
    icon: GuitarIcon,
    alt: 'guitar',
  },
};

const ChallengesAccordion: React.FC<ChallengesAccordionProps> = ({
  challenge,
  routines,
  routineCompletions,
}) => {
  // 완료된 루틴 비율에 따라 동적으로 너비 계산
  const completedRatio =
    routines.length > 0 ? (routineCompletions.length / routines.length) * 100 : 0;

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
            <div className='flex items-center gap-2'>
              <div className='flex justify-center items-center rounded-full bg-white p-1 w-10 h-10 border-primary border-2'>
                <Image
                  src={CATEGORY_ICON[challenge.categoryId].icon}
                  alt={CATEGORY_ICON[challenge.categoryId].alt}
                  width={24}
                  height={24}
                />
              </div>
              <div className='text-xl font-bold text-white'>{challenge.name}</div>
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
            routineCompletions={routineCompletions.filter(completion =>
              routines.some(
                routine =>
                  routine.id === completion.routineId && routine.challengeId === challenge.id
              )
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengesAccordion;
