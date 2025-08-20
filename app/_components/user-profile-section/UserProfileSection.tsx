'use client';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';
import { useEffect, useState } from 'react';
import { Toast } from '@/app/_components/toasts/Toast';

const UserProfileSection: React.FC = () => {
  const { userInfo, error, isLoading } = useGetUserInfo();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (error) {
      setHasError(true);
      Toast.error('사용자 정보를 불러올 수 없습니다');
    }
  }, [error]);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

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
        <div className='w-8 h-8 bg-gray-200 rounded-full animate-pulse'></div>
        <div className='flex flex-col gap-2'>
          <div className='w-24 h-6 bg-gray-200 rounded animate-pulse'></div>
          <div className='w-16 h-4 bg-gray-200 rounded animate-pulse'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-row items-center gap-2 w-full px-4 py-4'>
      <ProfileImage imageSrc={userInfo?.profileImg} />
      <div className='flex flex-col justify-center'>
        {/* username */}
        <div className='text-2xl font-bold'>{userInfo?.username || '사용자'}</div>
        {/* nickname */}
        <div className='text-sm font-bold text-primary-grey'>
          {userInfo?.nickname ? `(${userInfo.nickname})` : ''}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;
