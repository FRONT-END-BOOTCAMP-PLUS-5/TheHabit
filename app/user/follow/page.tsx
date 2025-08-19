'use client';
import Input from '@/app/_components/inputs/Input';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { BackComponent } from '@/app/user/follow/components/Back';
import { CategoryComponent } from '@/app/user/follow/components/Category';
import { ContentComponent } from '@/app/user/follow/components/Content';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { useGetFollowing } from '@/libs/hooks/user-hooks/useGetFollowing';
import { useGetFollower } from '@/libs/hooks/user-hooks/useGetFollower';
import { useFollowMutation } from '@/libs/hooks/user-hooks/useCreateFollow';
import { useUnfollowMutation } from '@/libs/hooks/user-hooks/useDeleteFollow';

const FollowPage = () => {
  const searchParams = useSearchParams();
  const nickname = searchParams.get('nickname');
  const type = searchParams.get('t');

  const { userInfo } = useGetUserInfo();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [getValue, setValue] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setValue(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data: followerData, isLoading: isFollowerLoading } = useGetFollower(
    userInfo?.id || '',
    getValue
  );
  const { data: followingData, isLoading: isFollowingLoading } = useGetFollowing(
    userInfo?.id || '',
    getValue
  );
  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();

  const handleToggleFollow = (targetUserId: string, isFollowing: boolean | undefined) => {
    if (!userInfo?.id) return;

    if (isFollowing)
      unfollowMutation.mutate({ fromUserId: userInfo?.id || '', toUserId: targetUserId });
    else followMutation.mutate({ fromUserId: userInfo?.id || '', toUserId: targetUserId });
  };

  const followData = type === 'follower' ? followerData?.data : followingData?.data;
  const isLoading = type === 'follower' ? isFollowerLoading : isFollowingLoading;

  const init = () => {
    setSearchTerm('');
  };

  return (
    <main className='px-5'>
      <section id='head'>
        <div id='follow_wrapper' className='flex items-center gap-[5.8rem]'>
          <BackComponent nickname={userInfo?.nickname || ''} />
          <p className='pt-2 font-bold text-[20px] w-[200] text-center whitespace-nowrap overflow-hidden text-ellipsis'>
            {nickname}
          </p>
        </div>
        <CategoryComponent
          init={init}
          type={type as 'follower' | 'following'}
          nickname={userInfo?.nickname || ''}
        />
        <Input
          placeholder='Search'
          onChange={evt => setSearchTerm(evt.target.value)}
          value={searchTerm}
        />
        <p className='mt-10 font-semibold'>
          {type === 'follower' ? '나를 팔로워한 사람들' : '내가 팔로잉한 사람들'}
        </p>
      </section>
      <section id='content'>
        {isLoading ? (
          <p>나중에 스켈레톤이나 스피너 해주겠지</p>
        ) : (
          <ContentComponent data={followData} onToggleFollow={handleToggleFollow} />
        )}
      </section>
    </main>
  );
};

export default FollowPage;
