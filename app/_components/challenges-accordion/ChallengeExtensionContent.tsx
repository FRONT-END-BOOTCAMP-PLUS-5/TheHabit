'use client';

import React from 'react';
import { Button } from '@/app/_components/buttons/Button';
import { useExtendChallenge } from '@/libs/hooks/challenges-hooks/useExtendChallenge';
import { useCompleteChallenge } from '@/libs/hooks/challenges-hooks/useCompleteChallenge';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { getChallengeType } from '@/public/utils/challengeUtils';

interface ChallengeExtensionContentProps {
  challenge: ChallengeDto;
  nickname: string;
  onSuccess?: () => void;
}

export const ChallengeExtensionContent: React.FC<ChallengeExtensionContentProps> = ({
  challenge,
  nickname,
  onSuccess,
}) => {
  const extendChallengeMutation = useExtendChallenge();
  const completeChallengeMutation = useCompleteChallenge();

  const challengeType = getChallengeType(challenge.createdAt, challenge.endAt);
  const is21DayChallenge = challengeType === '21일';
  const is66DayChallenge = challengeType === '66일';

  const handleExtend = async () => {
    if (!challenge.id) {
      console.error('챌린지 ID가 없습니다.');
      return;
    }

    try {
      await extendChallengeMutation.mutateAsync({
        nickname,
        challengeId: challenge.id,
      });
      onSuccess?.();
    } catch (error) {
      console.error('챌린지 연장 실패:', error);
    }
  };

  const handleComplete = async () => {
    if (!challenge.id) {
      console.error('챌린지 ID가 없습니다.');
      return;
    }

    try {
      await completeChallengeMutation.mutateAsync({
        nickname,
        challengeId: challenge.id,
      });
      onSuccess?.();
    } catch (error) {
      console.error('챌린지 완료 실패:', error);
    }
  };

  const getModalContent = () => {
    if (is21DayChallenge) {
      return {
        title: '21일 챌린지 완료!',
        description: `${challenge.name} 챌린지를 66일 챌린지로 연장하시겠습니까?`,
        extendText: '66일로 연장하기',
        completeText: '완료하고 종료하기',
        extendButtonStyle:
          'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white border-0',
      };
    } else if (is66DayChallenge) {
      return {
        title: '66일 챌린지 완료!',
        description: `${challenge.name} 챌린지를 무제한 챌린지로 연장하시겠습니까? (100년 뒤까지)`,
        extendText: '무제한으로 연장하기',
        completeText: '완료하고 종료하기',
        extendButtonStyle:
          'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white border-0',
      };
    }
    return null;
  };

  const content = getModalContent();
  if (!content) return null;

  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* 제목 */}
      <div className='text-center'>
        <h3 className='text-xl font-bold text-gray-900 mb-2'>🎉 {content.title}</h3>
        <p className='text-gray-600 text-sm'>{content.description}</p>
      </div>

      {/* 버튼 */}
      <div className='flex gap-3'>
        <Button
          buttonType='primary'
          onClick={handleExtend}
          disabled={extendChallengeMutation.isPending}
          className={`flex-1 ${content.extendButtonStyle}`}
        >
          🚀 {extendChallengeMutation.isPending ? '연장 중...' : content.extendText}
        </Button>
        <Button
          buttonType='secondary'
          onClick={handleComplete}
          disabled={completeChallengeMutation.isPending}
          className='flex-1'
        >
          {completeChallengeMutation.isPending ? '완료 중...' : content.completeText}
        </Button>
      </div>
    </div>
  );
};
