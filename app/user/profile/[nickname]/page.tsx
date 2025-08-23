'use client';

import { useUserPage } from '@/libs/hooks/user-hooks/useUserPage';
import { useParams } from 'next/navigation';
import { UserPage } from '@/app/user/profile/components/UserPage';
import { LoadingSpinner } from '@/app/_components/loading/LoadingSpinner';

const UserProfilePage = () => {
  const { nickname: slugNickname } = useParams();
  const { getNickname, isLoading, getSessionNickname } = useUserPage(slugNickname);
  return (
    <>
      {isLoading ? (
        <div className='h-[400px] flex items-center justify-center'>
          <LoadingSpinner />
        </div>
      ) : (
        <UserPage userNickname={getNickname} sessionNickname={getSessionNickname} />
      )}
    </>
  );
};

export default UserProfilePage;
