'use client';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';

const UserProfileSection: React.FC = () => {
  return (
    <nav className='w-full px-4 py-4'>
      <div className='flex gap-5 justify-center items-center'>
        <ProfileImage />
        <p className='w-80 text-2xl font-bold truncate'>로그인을 진행해주세요</p>
      </div>
    </nav>
  );
};

export default UserProfileSection;
