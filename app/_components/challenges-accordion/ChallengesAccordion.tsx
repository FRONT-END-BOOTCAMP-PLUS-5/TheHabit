'use client';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { useModalStore } from '@/libs/stores/modalStore';
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
import { ChallengesAccordionContent } from '@/app/_components/challenges-accordion/ChallengesAccordionContent';
import { StaticImageData } from 'next/image';
import {
  getChallengeProgress,
  calculateCompletionRatio,
  isSameDate,
  getChallengeDurationInfo,
} from '@/public/utils/dateUtils';
import { shouldShowExtensionModal } from '@/public/utils/challengeUtils';
import ChallengeBadge from './ChallengeBadge';
import ChallengeExtensionContent from './ChallengeExtensionContent';

// ChallengesAccordion 컴포넌트는 피드백 및 분석에도 사용되므로 공통으로 분리하였습니다.
// - 승민 2025.08.23
interface ChallengesAccordionProps {
  challenge: ChallengeDto;
  routines: ReadRoutineResponseDto[];
  routineCompletions: RoutineCompletionDto[];
  onFeedbackClick?: (challengeId: number) => void;
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
  onFeedbackClick,
  selectedDate,
  onRoutineAdded,
}) => {
  const { openModal } = useModalStore();
  const [hasShownExtensionModal, setHasShownExtensionModal] = useState<boolean>(false);

  // 완료된 루틴 비율에 따라 동적으로 너비 계산
  const completedRatio = calculateCompletionRatio(
    routines.filter(routine => routine.challengeId === challenge.id),
    routineCompletions,
    selectedDate
  );

  // 챌린지 진행 일수 계산
  const progressInfo = getChallengeProgress(challenge.createdAt, challenge.endAt);

  // 챌린지 기간 정보 계산
  const durationInfo = getChallengeDurationInfo(challenge.createdAt, challenge.endAt);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // 챌린지 완료 감지 및 연장 모달 표시
  useEffect(() => {
    // 이미 연장 모달을 보여줬다면 다시 표시하지 않음
    if (hasShownExtensionModal) return;

    // 연장 모달을 표시해야 하는지 확인
    const shouldShow = shouldShowExtensionModal(challenge, routines, routineCompletions);

    if (shouldShow) {
      // 연장 모달 표시
      openModal(
        <ChallengeExtensionContent
          challengeName={challenge.name}
          onExtend={() => {
            alert('🚀 66일로 연장되었습니다!');
            setHasShownExtensionModal(true);
          }}
          onComplete={() => {
            alert('✅ 챌린지가 완료되었습니다!');
            setHasShownExtensionModal(true);
          }}
        />,
        'floating',
        '챌린지 연장',
        '21일 챌린지 완료'
      );

      // 연장 모달을 보여줬다고 표시
      setHasShownExtensionModal(true);
    }
  }, [challenge, routines, routineCompletions, hasShownExtensionModal, openModal]);

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
              <div className='flex flex-col gap-1 min-w-0'>
                <div className='w-full text-xl font-bold text-white truncate min-w-0 overflow-hidden flex-shrink-0'>
                  {challenge.name}
                </div>
                {/* 챌린지 기간 뱃지 */}
                <div className='flex items-center gap-2'>
                  <ChallengeBadge badge={durationInfo.badge} />
                  {/* 챌린지 진행 일수 표시 */}
                  <div className='text-xs text-white/80'>
                    {progressInfo.status === 'not-started' && <span>시작 예정</span>}
                    {progressInfo.status === 'in-progress' && (
                      <span>
                        <span className='font-bold'>{progressInfo.days}일째</span> 진행 중
                      </span>
                    )}
                    {progressInfo.status === 'completed' && <span>완료됨</span>}
                    {progressInfo.status === 'error' && <span>진행 정보 오류</span>}
                  </div>
                </div>
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
            challengeId={challenge.id || 0}
            routines={routines.filter(routine => routine.challengeId === (challenge.id || 0))}
            routineCompletions={routineCompletions.filter(completion => {
              // 해당 챌린지의 루틴인지 확인
              const isRoutineInChallenge = routines.some(
                routine =>
                  routine.id === completion.routineId && routine.challengeId === (challenge.id || 0)
              );

              if (!isRoutineInChallenge) return false;

              // 선택된 날짜에 완료된 루틴인지 확인
              const completionDate = new Date(completion.createdAt);
              return isSameDate(completionDate, selectedDate);
            })}
            selectedDate={selectedDate}
            onRoutineAdded={onRoutineAdded}
            onFeedbackClick={onFeedbackClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengesAccordion;
