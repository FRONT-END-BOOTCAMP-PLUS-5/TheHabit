'use client';

import Link from 'next/link';
import Image from 'next/image';
import CompleteIcon from '@/public/icons/completed.svg';
import { useModalStore } from '@/libs/stores/modalStore';
import StreakModal from '@/app/_components/layouts/StreakModal';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { useGetDashboardByNickname } from '@/libs/hooks/dashboard-hooks/useGetDashboardByNickname';
import { useMemo } from 'react';
import { calculateSingleChallengeProgress } from '@/app/user/feedback/_components/CalcFeedBackData';

//TODO : 최장 스트릭 정보 가져오기
const Header: React.FC = () => {
  const { openModal } = useModalStore();
  const { userInfo } = useGetUserInfo();
  const nickname = userInfo?.nickname || '';
  const { data: dash } = useGetDashboardByNickname(nickname);

  const longestStreak = useMemo(() => {
    if (!dash || !dash.challenge || dash.challenge.length === 0) return 0;

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
      return maxRun;
    });

    return results.reduce((a, b) => (b > a ? b : a), 0);
  }, [dash]);

  const handleOpenModal = () => {
    openModal(<StreakModal />);
  };
  return (
    <header className='w-full flex justify-between items-center py-4'>
      <div className='flex flex-3 items-center justify-center' />
      <h1 className={'text-3xl font-black text-primary flex-3'}>
        <Link href='/'>The:Habit</Link>
      </h1>
      <button
        className='flex flex-2 items-center justify-end gap-1 pr-4 cursor-pointer'
        onClick={handleOpenModal}
      >
        <Image src={CompleteIcon} alt='challenge progress' width={24} height={24} />
        <div className='text-xl font-extrabold bg-gradient-to-r from-[#FF6D00] via-[#FF9800] to-[#FFC107] bg-clip-text text-transparent'>
          {longestStreak}
        </div>
      </button>
    </header>
  );
};

export default Header;
