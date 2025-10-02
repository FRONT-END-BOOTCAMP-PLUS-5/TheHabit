import React from 'react';

export const UserProfileButton: React.FC = () => {
  return (
    <div className='flex gap-4 w-full mt-4'>
      <button
        disabled
        className='cursor-not-allowed bg-[#FFC70A] flex-1 h-10 rounded-lg flex items-center justify-center hover:bg-[#FFC70A]/80'
      >
        <p className='text-white font-bold text-center text-lg'>대시보드 보러가기</p>
      </button>
      <button
        disabled
        className='cursor-not-allowed bg-[#48a9a0] flex-1 h-10 rounded-lg flex items-center justify-center hover:bg-[#48a9a0]/80'
      >
        <p className='text-white font-bold text-center text-lg'>프로필 편집</p>
      </button>
    </div>
  );
};
