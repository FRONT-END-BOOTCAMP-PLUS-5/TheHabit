'use client';
import Input from '@/app/_components/inputs/Input';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { BackComponent } from '@/app/_components/back/Back';
import { FollowCategoryComponent } from '@/app/user/follow/components/FollowCategory';
import { ContentComponent } from '@/app/user/follow/components/Content';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { useGetFollowing } from '@/libs/hooks/user-hooks/useGetFollowing';
import { useGetFollower } from '@/libs/hooks/user-hooks/useGetFollower';
import { useFollowMutation } from '@/libs/hooks/user-hooks/useCreateFollow';
import { useUnfollowMutation } from '@/libs/hooks/user-hooks/useDeleteFollow';
import { debounce } from 'lodash';
import { AvatarSkeleton, ButtonSkeleton, TextSkeleton } from '@/app/_components/skeleton/Skeleton';
import { COMPLETION_SKELETON } from '@/public/consts/completionSkeleton';

const FollowPage = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get('t');

  const { userInfo } = useGetUserInfo();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [getValue, setValue] = useState<string>('');

  const debounceSearch = useMemo(() => {
    return debounce((value: string) => {
      setValue(value);
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);

  const { data: followerData, isLoading: isFollowerLoading } = useGetFollower(
    userInfo?.id || '',
    getValue,
    {
      enabled: !!userInfo?.id && type === 'follower',
    }
  );
  const { data: followingData, isLoading: isFollowingLoading } = useGetFollowing(
    userInfo?.id || '',
    getValue,
    {
      enabled: !!userInfo?.id && type === 'following',
    }
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
    setValue('');
  };

  return (
    <main className='px-5'>
      <section id='head'>
        <div id='follow_wrapper' className='flex items-center gap-[5.8rem]'>
          <BackComponent
            nickname={userInfo?.nickname || ''}
            className={
              'text-[40px] text-[#93d50b] cursor-pointer inline pl-[20px] absolute top-[-4px] left-0'
            }
          />
        </div>
        <FollowCategoryComponent
          init={init}
          type={type as 'follower' | 'following'}
          nickname={userInfo?.nickname || ''}
        />
        <Input
          placeholder={
            type === 'follower'
              ? '팔로워한 사람들을 검색해보세요'
              : '팔로잉한 사람들을 검색해보세요'
          }
          className='border-t-0 border-l-0 border-r-0 border-b-2 focus:!border-[#07bc0c] rounded-[0px] hover:border-[#07bc0c] !shadow-none '
          onChange={evt => {
            setSearchTerm(evt.target.value);
            debounceSearch(evt.target.value);
          }}
          value={searchTerm}
        />
        <p className='mt-10 font-semibold'>
          {type === 'follower' ? '나를 팔로워한 사람들' : '내가 팔로잉한 사람들'}
        </p>
      </section>
      <section id='content' className='h-[450px] overflow-scroll'>
        {isLoading ? (
          COMPLETION_SKELETON.map((_, idx) => {
            return (
              <div key={idx} className='flex justify-between items-center mb-8 mt-4'>
                <div className='flex gap-2 items-center'>
                  <AvatarSkeleton className='w-[80px] h-[80px]' />
                  <div>
                    <TextSkeleton className='w-[140px] mb-3' />
                    <TextSkeleton className='w-[140px]' />
                  </div>
                </div>
                <ButtonSkeleton />
              </div>
            );
          })
        ) : (
          <ContentComponent data={followData} onToggleFollow={handleToggleFollow} />
        )}
      </section>
    </main>
  );
};

export default FollowPage;
