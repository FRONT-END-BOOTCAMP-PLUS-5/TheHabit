'use client';
import { ProfileImage } from '../profile-images/ProfileImage';

const UserProfileSection: React.FC = () => {
  return (
    <div className='flex flex-row items-center gap-2 w-full px-4 py-4'>
      <ProfileImage
        imageSrc={
          'https://images.unsplash.com/photo-1597769906792-4b2f9a3403a8?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }
      />
      <div className='flex flex-col justify-center'>
        {/* username */}
        <div className='text-2xl font-bold'>정승민</div>
        {/* nickname */}
        <div className='text-sm font-bold text-primary-grey'>(HarenKei)</div>
      </div>
    </div>
  );
};

export default UserProfileSection;
