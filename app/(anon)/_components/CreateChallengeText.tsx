import React from 'react';

export const CreateChallengeText = () => {
  return (
    <div className='flex flex-col gap-2 items-center justify-center text-center py-8'>
      <p className='text-2xl font-bold'>아직 등록된 챌린지가 없어요</p>
      <p className='text-gray-500'>새 챌린지를 만들어 오늘부터 시작해보세요.</p>
    </div>
  );
};
