import { useRouter } from 'next/navigation';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';

export const BackComponent = ({ nickname }: { nickname?: string }) => {
  const router = useRouter();
  //팔로우일때는 각 다른 url로 이동하기때문에 push로 해줘야함
  const handlergoBack = () => (nickname ? router.push(`/user/profile/${nickname}`) : router.back());

  return (
    <p
      onClick={handlergoBack}
      className='text-[40px] cursor-pointer inline pl-[20px] absolute top-[-8px] left-0'
    >
      {'<'}
    </p>
  );
};
