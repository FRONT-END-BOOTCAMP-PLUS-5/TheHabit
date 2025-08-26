import { useRouter } from 'next/navigation';

export const BackComponent = ({
  nickname,
  className = 'text-[40px] text-[#000] cursor-pointer inline pl-[20px] absolute top-[-6px] left-0',
}: {
  nickname?: string;
  className?: string;
}) => {
  const router = useRouter();
  //팔로우일때는 각 다른 url로 이동하기때문에 push로 해줘야함
  const handlergoBack = () => (nickname ? router.push(`/user/profile/${nickname}`) : router.back());

  return (
    <p onClick={handlergoBack} className={className}>
      {'<'}
    </p>
  );
};
