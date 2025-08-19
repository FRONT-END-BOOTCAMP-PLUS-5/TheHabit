'use client';

import { CHALLENGE_COLORS } from '@/public/consts/challengeColors';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';

interface ChallengesAccordionContentProps {
  challenge: ChallengeDto;
}

const ChallengesAccordionContent: React.FC<ChallengesAccordionContentProps> = ({ challenge }) => {
  return (
    <div className='p-3'>
      {/* 완료된 루틴 표시 */}
      <div className='flex items-center gap-3 mb-4'>
        <div
          className={`w-8 h-8 rounded-full ${CHALLENGE_COLORS[challenge.categoryId].background} flex items-center justify-center`}
        >
          <div className='text-white text-sm'>✓</div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='text-yellow-500 text-lg'>🛹</div>
          <span className='text-primary-grey font-medium'>스케이트보드 알리 연습</span>
        </div>
      </div>

      {/* 새로운 루틴 추가 버튼 */}
      <div className='flex justify-center'>
        <button className='bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold py-2 px-4 cursor-pointer'>
          + 루틴 추가하기
        </button>
      </div>
    </div>
  );
};

export default ChallengesAccordionContent;
