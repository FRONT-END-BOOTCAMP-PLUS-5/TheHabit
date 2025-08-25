'use client';

import ChallengeBadge from '@/app/_components/challenges-accordion/ChallengeBadge';

export default function BadgeTestPage() {
  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>
          🏷️ 챌린지 뱃지 테스트 페이지
        </h1>

        <div className='bg-white rounded-lg shadow-lg p-8'>
          <h2 className='text-xl font-semibold mb-6 text-gray-700'>뱃지 타입별 테스트</h2>

          <div className='space-y-6'>
            {/* 21일 뱃지 */}
            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
              <div className='w-24 text-sm font-medium text-gray-600'>21일 뱃지:</div>
              <ChallengeBadge challengeType='21일' />
              <div className='text-sm text-gray-500'>은색 그라데이션 + 노란색 glow</div>
            </div>

            {/* 66일 뱃지 */}
            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
              <div className='w-24 text-sm font-medium text-gray-600'>66일 뱃지:</div>
              <ChallengeBadge challengeType='66일' />
              <div className='text-sm text-gray-500'>금색 그라데이션 + 노란색 glow</div>
            </div>

            {/* 무제한 뱃지 */}
            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
              <div className='w-24 text-sm font-medium text-gray-600'>무제한 뱃지:</div>
              <ChallengeBadge challengeType='무제한' />
              <div className='text-sm text-gray-500'>빨간색 그라데이션 + 노란색 glow</div>
            </div>
          </div>

          <div className='mt-8 pt-6 border-t border-gray-200'>
            <h3 className='text-lg font-semibold mb-4 text-gray-700'>뱃지 스타일 정보</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600'>
              <div className='p-3 bg-blue-50 rounded-lg'>
                <div className='font-medium text-blue-800'>21일 챌린지</div>
                <div>• 은색 그라데이션 배경</div>
                <div>• 회색 테두리</div>
                <div>• 노란색 glow 효과</div>
              </div>
              <div className='p-3 bg-yellow-50 rounded-lg'>
                <div className='font-medium text-yellow-800'>66일 챌린지</div>
                <div>• 금색 그라데이션 배경</div>
                <div>• 금색 테두리</div>
                <div>• 노란색 glow 효과</div>
              </div>
              <div className='p-3 bg-red-50 rounded-lg'>
                <div className='font-medium text-red-800'>무제한 챌린지</div>
                <div>• 빨간색 그라데이션 배경</div>
                <div>• 빨간색 테두리</div>
                <div>• 노란색 glow 효과</div>
              </div>
            </div>
          </div>

          <div className='mt-8 pt-6 border-t border-gray-200'>
            <h3 className='text-lg font-semibold mb-4 text-gray-700'>애니메이션 효과</h3>
            <div className='text-sm text-gray-600 space-y-2'>
              <div>
                • <strong>Glow 효과</strong>: 2초 주기로 부드럽게 반복
              </div>
              <div>
                • <strong>색상</strong>: 노란색 (#ffd700) glow
              </div>
              <div>
                • <strong>크기</strong>: 2px → 12px 범위로 변화
              </div>
              <div>
                • <strong>타이밍</strong>: ease-in-out으로 자연스러운 전환
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 text-center'>
          <a
            href='/user/dashboard'
            className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            대시보드로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
