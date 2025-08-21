'use client';

import { useUserPage } from '@/libs/hooks/user-hooks/useUserPage';
import { useParams } from 'next/navigation';
import { UserPage } from '@/app/user/profile/components/UserPage';

const UserProfilePage = () => {
  const { nickname: slugNickname } = useParams();
  const { getNickname, isLoading, getSessionNickname } = useUserPage(slugNickname);
  return (
    <>
      {isLoading ? (
        <>로딩중ㅋ</>
      ) : (
        <UserPage userNickname={getNickname} sessionNickname={getSessionNickname} />
      )}
    </>
  );
};

export default UserProfilePage;
