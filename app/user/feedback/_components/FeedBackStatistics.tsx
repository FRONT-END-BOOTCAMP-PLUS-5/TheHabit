'use client';

import React, { useState } from 'react';
import { Progress } from 'antd';
import Image from 'next/image';
import { Dashboard } from '@/backend/dashboards/domain/entity/Dashboard';

export const FeedBackStatistics = ({ dashBoardData }: { dashBoardData: Dashboard }) => {
  const { challenge, routines, routineCount, routineCompletion } = dashBoardData;
  const [currentIndex, setCurrentIndex] = useState(0);

  // 안전한 날짜 비교 함수
  const getDateString = (dateValue: Date): string => {
    if (!dateValue) return '';

    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0];
    }

    // 문자열인 경우 Date로 변환 후 처리
    try {
      return new Date(dateValue).toISOString().split('T')[0];
    } catch (error) {
      console.error('날짜 변환 오류:', error, dateValue);
      return '';
    }
  };

  // //createdAt을 기준으로 + 21을 하자
  const currentChallenge = challenge && challenge[currentIndex];

  const heatMap = getDateString(currentChallenge?.createdAt);

  // 21일 카운트 해야함
  const days = 21;
  const dataArray = Array.from({ length: days }, (_, i) => {
    const date = new Date(heatMap);
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  // 현재 챌린지의 루틴 ID들만 가져오기 (더 효율적)
  const currentChallengeRoutineIds = routines
    .filter(routine => routine.challengeId === currentChallenge?.id)
    .map(routine => routine.id);

  // 챌린지 날짜별 완료 여부 확인
  const completion = dataArray.map(date => {
    // 해당 날짜에 완료된 루틴들 중 현재 챌린지의 루틴들만 필터링
    const dailyCompletions = routineCompletion.filter(completion => {
      const completionDate = getDateString(completion.createdAt);

      return (
        completionDate === date && // 날짜가 일치하고
        currentChallengeRoutineIds.includes(completion.routineId) && // 현재 챌린지의 루틴이고
        completion.content && // content가 존재하고
        completion.content.trim() !== '' // 빈 문자열이 아닌 경우
      );
    });

    // 완료된 루틴 ID들
    const completedRoutineIds = dailyCompletions.map(completion => completion.routineId);

    // 현재 챌린지의 모든 루틴이 완료되었는지 확인
    const allRoutinesCompleted =
      currentChallengeRoutineIds.length > 0 &&
      currentChallengeRoutineIds.every(routineId => completedRoutineIds.includes(routineId));

    return allRoutinesCompleted;
  });

  const handlePrev = () => {
    if (challenge) {
      setCurrentIndex(currentIndex === 0 ? challenge.length - 1 : currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (challenge) {
      setCurrentIndex(currentIndex === challenge.length - 1 ? 0 : currentIndex + 1);
    }
  };

  if (!challenge || challenge.length === 0) {
    return (
      <div className='w-full text-center p-8'>
        <p className='text-gray-500'>챌린지가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className='w-full relative'>
      <div className='flex flex-col items-center justify-center mt-10'>
        <button
          onClick={handlePrev}
          className='absolute left-0 cursor-pointer hover:opacity-70 transition-opacity duration-200'
        >
          <Image src='/icons/left.svg' alt='prev' width={20} height={20} />
        </button>

        <div className='p-6 w-3/4 border rounded-lg shadow-md'>
          <h3 className='text-xl font-bold mb-4'>{currentChallenge.name}</h3>
          <div className='text-center grid gap-6 grid-cols-7'>
            {dataArray.map((_, index) => {
              const isCompleted = completion[index];
              return (
                <Image
                  key={index}
                  src={isCompleted ? '/icons/completed.svg' : '/icons/notCompleted.svg'}
                  alt={isCompleted ? 'completed' : 'not completed'}
                  width={20}
                  height={20}
                  className='w-5 h-5'
                />
              );
            })}
          </div>
        </div>

        <button
          onClick={handleNext}
          className='absolute right-0 cursor-pointer hover:opacity-70 transition-opacity duration-200'
        >
          <Image src='/icons/right.svg' alt='next' width={20} height={20} />
        </button>
      </div>

      {/* 페이지네이션 인디케이터 */}
      <div className='flex justify-center mt-4 space-x-2'>
        {challenge?.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
