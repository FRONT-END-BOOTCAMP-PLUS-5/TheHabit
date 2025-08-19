'use client';
import { Button } from '@/app/_components/buttons/Button';
// import { followsApi } from '@/libs/api/follows.api'; // ⬅️ 제거
// import { useState } from 'react'; // ⬅️ 제거
// import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo'; // ⬅️ 제거

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
  return (
    <li key={data.id} className='flex justify-between items-center mb-8'>
      <div id='follower_users' className='flex items-center gap-2'>
        <div className='w-[80px] h-[80px] bg-black rounded-full'>{data.profileImg}</div>
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
