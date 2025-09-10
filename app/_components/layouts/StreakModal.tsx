'use client';

import { useMemo } from 'react';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { useGetDashboardByNickname } from '@/libs/hooks/dashboard-hooks/useGetDashboardByNickname';
import { calculateSingleChallengeProgress } from '@/app/user/feedback/_components/CalcFeedBackData';
import {
  FeedBackEmptyIcon,
  FeedBackErrorIcon,
  FeedBackSuccessIcon,
} from '@/app/user/feedback/_components/FeedbackIcon';

const StreakModal: React.FC = () => {
  const { userInfo, isLoading: userLoading } = useGetUserInfo();
  const nickname = userInfo?.nickname || '';
  const { data: dash, isLoading: dashLoading } = useGetDashboardByNickname(nickname);

  const { bestChallengeName, bestDailyCompletions, longestStreak } = useMemo(() => {
    if (!dash || !dash.challenge || dash.challenge.length === 0) {
      return {
        bestChallengeName: '',
        bestDailyCompletions: [] as (boolean | null)[],
        longestStreak: 0,
      };
    }

    const results = dash.challenge.map(ch => {
      const start = new Date(ch.createdAt);
      const end = new Date(ch.endAt);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const { dailyCompletions } = calculateSingleChallengeProgress(
        ch,
        dash.routines,
        dash.routineCompletions,
        days
      );

      // 최장 연속 true 길이 계산 (null은 제외, false에서 끊김)
      let maxRun = 0;
      let run = 0;
      for (const v of dailyCompletions) {
        if (v === true) {
          run += 1;
          if (run > maxRun) maxRun = run;
        } else if (v === false) {
          run = 0;
        }
      }
      return { name: ch.name, dailyCompletions, maxRun };
    });

    const best = results.reduce((a, b) => (b.maxRun > a.maxRun ? b : a), results[0]);
    return {
      bestChallengeName: best.name,
      bestDailyCompletions: best.dailyCompletions,
      longestStreak: best.maxRun,
    };
  }, [dash]);

  if (userLoading || dashLoading) {
    return (
      <div className='text-center py-8'>
        <div className='text-gray-600'>스트릭 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!dash || !dash.challenge || dash.challenge.length === 0) {
    return (
      <div className='text-center py-8'>
        <h2 className='text-xl font-bold mb-2'>최장 스트릭</h2>
        <div className='text-gray-600'>진행 중인 챌린지가 없어요.</div>
      </div>
    );
  }

  return (
    <div className='py-6 px-4'>
      <h2 className='text-xl font-bold mb-1'>최장 스트릭</h2>
      <div className='text-sm text-gray-600 mb-4'>{bestChallengeName}</div>
      <div className='flex items-center gap-2 mb-6'>
        <span className='text-3xl font-extrabold text-primary'>{longestStreak + 1}</span>
        <span className='text-gray-600'>일 연속</span>
      </div>

      {/* 캘린더(피드백 통계 아이콘 스타일 재사용) */}
      <div className='grid grid-cols-7 gap-3 justify-items-center'>
        {bestDailyCompletions.map((isCompleted, idx) => (
          <div key={idx} className='w-6 h-6 flex items-center justify-center'>
            {isCompleted === null ? (
              <FeedBackEmptyIcon />
            ) : isCompleted ? (
              <FeedBackSuccessIcon />
            ) : (
              <FeedBackErrorIcon />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreakModal;
