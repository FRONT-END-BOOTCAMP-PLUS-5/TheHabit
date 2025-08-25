'use client';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';
import { useState } from 'react';
import { useGetUserByNickname } from '@/libs/hooks/user-hooks/useGetUserByNickname';
import { useParams } from 'next/navigation';

interface UserProfileSectionProps {
  nickname?: string; // 옵셔널로 유저 닉네임 받기
}

const UserProfileSection: React.FC<UserProfileSectionProps> = () => {
  const [hasError, setHasError] = useState(false);

  // props로 받은 nickname이 없으면 빈 문자열로 설정 (훅에서 enabled: false가 되도록)
  const nickname = useParams().nickname || '';
  const { data: userInfo, isLoading } = useGetUserByNickname(nickname as string);

  // 에러 상태 처리
  if (hasError) {
    return (
      <div className='flex flex-col items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg'>
        <div className='text-red-600 text-2xl mb-2'>😵</div>
        <p className='text-sm text-red-600 text-center mb-3'>사용자 정보를 불러올 수 없습니다</p>
        <button
          onClick={() => {
            setHasError(false);
            window.location.reload();
          }}
          className='px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors'
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className='flex flex-row items-center gap-2 w-full px-4 py-4'>
        <div className='w-22 h-22 bg-gray-200 rounded-full animate-pulse'></div>
        <div className='flex flex-col gap-2'>
          <div className='w-24 h-6 bg-gray-200 rounded animate-pulse'></div>
          <div className='w-16 h-4 bg-gray-200 rounded animate-pulse'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-row items-center gap-2 w-full px-4 py-4'>
      <ProfileImage imageSrc={userInfo?.data?.profileImg} />
      <div className='flex flex-col justify-center'>
        {/* username */}
        <div className='relative group'>
          <div className='w-80 text-2xl font-bold truncate'>
            {userInfo?.data?.username || '사용자'}
          </div>
          <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
            {userInfo?.data?.username || '사용자'}
          </div>
        </div>
        {/* nickname */}
        <div className='text-sm font-bold text-primary-grey'>
          {userInfo?.data?.nickname ? `(${userInfo.data.nickname})` : ''}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;
