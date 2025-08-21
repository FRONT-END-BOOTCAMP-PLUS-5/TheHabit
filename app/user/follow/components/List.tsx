'use client';
import { Button } from '@/app/_components/buttons/Button';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';
import NoneProfile from '@/app/_components/none/NoneProfile';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  nickname: string;
  profileImg: string | null;
  isFollowing?: boolean;
}

interface IList {
  data: User;
  onToggleFollow: (targetUserId: string, isFollowing: boolean | undefined) => void;
}

export const ListComponent = ({ data, onToggleFollow }: IList) => {
  const router = useRouter();

  const handlergoBack = (nickname: string) => router.push(`/user/profile/${nickname}`);
  return (
    <li key={data.id} className='flex justify-between items-center mb-8'>
      <div
        id='follower_users'
        className='flex items-center gap-2 cursor-pointer'
        onClick={() => {
          handlergoBack(data.nickname);
        }}
      >
        {data.profileImg ? (
          <ProfileImage imageSrc={data.profileImg} wrapperWidth={20} wrapperHeight={20} />
        ) : (
          <NoneProfile
            className={`w-[80px] h-[80px] rounded-full overflow-hidden border-primary border-2`}
          />
        )}

        <div className='flex flex-col'>
          <span className='text-[14px] text-[#1f2328]'>{data.username}</span>
          <span className='text-[10px] mt-2 text-[#59636e]'>{'(' + data.nickname + ')'}</span>
        </div>
      </div>
      <Button
        type='default'
        color='default'
        className='w-[76px]'
        onClick={() => onToggleFollow(data.id, data.isFollowing)}
      >
        {data.isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    </li>
  );
};
