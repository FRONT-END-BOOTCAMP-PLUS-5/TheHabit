'use client';

import { useExtendChallenge } from '@/libs/hooks/challenges-hooks/useExtendChallenge';
import { useCompleteChallenge } from '@/libs/hooks/challenges-hooks/useCompleteChallenge';

interface ChallengeExtensionContentProps {
  challengeName: string;
  nickname: string;
  challengeId: number;
  onSuccess?: () => void;
}

export default function ChallengeExtensionContent({
  challengeName,
  nickname,
  challengeId,
  onSuccess,
}: ChallengeExtensionContentProps) {
  const extendChallenge = useExtendChallenge({
    nickname,
    onSuccess: () => {
      onSuccess?.();
    },
  });
  const completeChallenge = useCompleteChallenge({
    nickname,
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const handleExtend = async () => {
    try {
      await extendChallenge.mutateAsync(challengeId);
    } catch (error) {
      console.error('챌린지 연장 실패:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeChallenge.mutateAsync(challengeId);
    } catch (error) {
      console.error('챌린지 완료 실패:', error);
    }
  };

  return (
    <div className='text-center py-4'>
      <div className='mb-6'>
        <h3 className='text-xl font-bold text-gray-800 mb-3'>🎉 21일 챌린지 완료!</h3>
        <p className='text-gray-600'>
          <span className='font-semibold text-blue-600'>{challengeName}</span> 챌린지를
          <span className='text-yellow-500 font-bold'> 66일 챌린지</span>로 연장하시겠습니까?
        </p>
      </div>
      <div className='flex gap-3 justify-center'>
        <button
          onClick={handleExtend}
          disabled={extendChallenge.isPending}
          className='px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {extendChallenge.isPending ? '연장 중...' : '🚀 66일로 연장하기'}
        </button>
        <button
          onClick={handleComplete}
          disabled={completeChallenge.isPending}
          className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {completeChallenge.isPending ? '완료 중...' : '완료하고 종료하기'}
        </button>
      </div>
    </div>
  );
}
