import { useRouter } from 'next/navigation';

export const BackComponent = ({ nickname }: { nickname: string }) => {
  const router = useRouter();

  const handlergoBack = () => router.push(`/user/profile/${nickname}`);

  return (
    <p onClick={handlergoBack} className='text-[40px] cursor-pointer inline'>
      {'<'}
    </p>
  );
};
