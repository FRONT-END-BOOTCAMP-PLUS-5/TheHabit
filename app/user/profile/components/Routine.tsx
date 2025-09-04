'use client';

import { UserChallengeAndRoutineAndFollowAndCompletionDto } from '@/backend/users/application/dtos/UserChallengeAndRoutineAndFollowAndCompletion';
import { EMOJI_MAP } from '@/public/consts/routineItem';
import { getYearAndMonthAndDay } from '@/public/utils/dateUtils';
import { TextSkeleton } from '@/app/_components/skeleton/Skeleton';
import { ROUTINE_ARR } from '@/public/consts/userRoutine';

interface IRoutine {
  id: number;
  emoji: number;
  day: number;
  title: string;
}
export const RoutineComponent = ({
  getUserData,
  isLoading,
  type,
}: {
  getUserData?: UserChallengeAndRoutineAndFollowAndCompletionDto;
  isLoading?: boolean;
  type?: string;
}) => {
  const oneDay = 1000 * 60 * 60 * 24;

  const getRoutineDay = (): IRoutine[] | undefined => {
    if (getUserData)
      return getUserData.challenges.flatMap(challenge => {
        return challenge.routines.map(routine => {
          const routineCreatedAt = getYearAndMonthAndDay(routine.createdAt);
          const curDate = new Date();
          const tarDate = new Date(routineCreatedAt);
          const time = +curDate - +tarDate;
          const day = time / oneDay;
          const formatDay = Math.floor(day);

          let dayNum = 1;
          if (formatDay > 0) if (routine.completions.length > 0) dayNum = formatDay + 1;

          return {
            id: routine.id,
            emoji: routine.emoji,
            day: dayNum,
            title: routine.routineTitle,
          };
        });
      });
  };

  const routine = getRoutineDay();

  return (
    <div
      id='routine_wrapper'
      className='flex flex-col py-8 gap-2 border-t border-b border-gray-200 mt-6 h-[200px]'
    >
      {isLoading ? (
        ROUTINE_ARR.map((_, idx) => {
          return <TextSkeleton key={idx} height={'h-[24px]'} />;
        })
      ) : routine && routine.length > 0 ? (
        <>
          <h2 className='text-xl font-bold mb-4 text-gray-800'>루틴 실천 현황</h2>
          {routine.map(item => (
            <p key={item.id} className='w-[100%] text-gray-700 text-base'>
              <span className='font-semibold'>{item.title}</span>:{' '}
              <span className='font-bold text-blue-600'>{item.day}</span>일째 실천중!{' '}
              {EMOJI_MAP[item.emoji]}
            </p>
          ))}
        </>
      ) : (
        <p className='w-[100%] text-gray-500 text-left'>
          {type !== 'edit'
            ? '실천 중인 루틴이 없습니다. 새로운 루틴을 시작해보세요!'
            : '편집 페이지에는 이용하실 수 없습니다!'}
        </p>
      )}
    </div>
  );
};
