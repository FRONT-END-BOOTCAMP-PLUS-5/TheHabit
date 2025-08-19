'use client';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';
import { useEffect } from 'react';

const UserProfileSection: React.FC = () => {
  const { userInfo } = useGetUserInfo();

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  return (
    <div className='flex flex-row items-center gap-2 w-full px-4 py-4'>
      <ProfileImage imageSrc={userInfo?.profileImg} />
      <div className='flex flex-col justify-center'>
        {/* username */}
        <div className='text-2xl font-bold'>{userInfo?.username}</div>
        {/* nickname */}
        <div className='text-sm font-bold text-primary-grey'>{userInfo?.nickname}</div>
      </div>
    </div>
  );
};

export default UserProfileSection;
