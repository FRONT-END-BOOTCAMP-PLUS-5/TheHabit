import { useRouter } from 'next/navigation';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';

export const BackComponent = () => {
  const router = useRouter();
  const { userInfo } = useGetUserInfo();

  const handlergoBack = () => router.push(`/user/profile/${userInfo?.nickname}`);

  return (
    <p
      onClick={handlergoBack}
      className='text-[40px] cursor-pointer inline pl-[20px] absolute top-[-8px] left-0'
    >
      {'<'}
    </p>
  );
};
