'use client';

import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import ChallengesAccordion from '@/app/_components/challenges-accordion/ChallengesAccordion';

interface HistoryChallengeListProps {
  challenges: ChallengeDto[];
  nickname: string;
}

const HistoryChallengeList: React.FC<HistoryChallengeListProps> = ({ challenges, nickname }) => {
  if (challenges.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg'>
        <div className='text-gray-400 text-4xl mb-4'>📋</div>
        <h3 className='text-lg font-semibold text-gray-600 mb-2'>완료/실패된 챌린지가 없습니다</h3>
        <p className='text-sm text-gray-500 text-center'>
          아직 완료하거나 실패한 챌린지가 없습니다.
        </p>
      </div>
    );
  }

  // 챌린지 상태에 따른 뱃지 정보 결정
  const getChallengeStatusBadge = (challenge: ChallengeDto) => {
    const { completionProgress, endAt } = challenge;

    if (completionProgress === 'completed_21' || completionProgress === 'completed_66') {
      return {
        text: '완료',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: '✅',
      };
    } else if (completionProgress === 'extended' || completionProgress === 'extended_100') {
      return {
        text: '연장됨',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        icon: '🔄',
      };
    } else if (endAt && new Date(endAt) < new Date()) {
      return {
        text: '실패',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        icon: '❌',
      };
    } else {
      return {
        text: '기타',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-200',
        icon: '❓',
      };
    }
  };

  return (
    <div className='space-y-3'>
      {challenges.map(challenge => {
        const statusBadge = getChallengeStatusBadge(challenge);

        return (
          <div key={challenge.id} className='relative'>
            {/* 상태 뱃지 */}
            <div
              className={`absolute top-3 right-15 z-10 px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bgColor} ${statusBadge.textColor} ${statusBadge.borderColor} border flex items-center gap-1`}
            >
              <span className='text-xs'>{statusBadge.icon}</span>
              <span>{statusBadge.text}</span>
            </div>

            <ChallengesAccordion
              challenge={challenge}
              routines={[]} // 히스토리에서는 루틴이 필요 없음
              routineCompletions={[]} // 히스토리에서는 루틴 완료가 필요 없음
              selectedDate={new Date()} // 현재 날짜 사용
              nickname={nickname}
            />
          </div>
        );
      })}
    </div>
  );
};

export default HistoryChallengeList;
