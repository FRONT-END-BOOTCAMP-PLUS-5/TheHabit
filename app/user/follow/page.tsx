'use client';
import Input from '@/app/_components/inputs/Input';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

import { followsApi } from '@/libs/api/follows.api';
import { FollowerDto } from '@/backend/follows/applications/dtos/FollowerDto';
import { FollowingDto } from '@/backend/follows/applications/dtos/FollowingDto';
import { BackComponent } from '@/app/user/follow/components/Back';
import { CategoryComponent } from '@/app/user/follow/components/Category';
import { ContentComponent } from '@/app/user/follow/components/Content';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { debounce } from 'lodash';

const FollowPage = () => {
  const searchParams = useSearchParams();
  const nickname = searchParams.get('nickname');
  const type = searchParams.get('t');

  const { userInfo } = useGetUserInfo();

  const [getFollows, setFollows] = useState<FollowerDto | FollowingDto>();
  const [getInputText, setInputText] = useState<string>('');

  const { follower, following } = followsApi;

  const isMounted = useRef(false);

  const init = () => {
    setInputText('');
  };

  const getFollow = useCallback(
    async (type: 'follower' | 'following', keyword: string = '') => {
      const response =
        type === 'follower'
          ? await follower(userInfo?.id || '', keyword)
          : await following(userInfo?.id || '', keyword);
      if (isMounted.current) setFollows(response?.data);
    },
    [follower, following]
  );

  const handleSearch = useCallback(
    debounce(async (value: string) => {
      if (type === 'follower' || type === 'following') await getFollow(type, value);
    }, 500),
    [type, getFollow]
  );

  useEffect(() => {
    isMounted.current = true;

    (async function () {
      if (type === 'follower' || type === 'following') await getFollow(type);
    })();

    return () => {
      isMounted.current = false;
      handleSearch.cancel();
    };
  }, [type, getFollow, handleSearch]);

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
          onChange={evt => {
            setInputText(evt.target.value);
            handleSearch(evt.target.value);
          }}
          value={getInputText}
        />
        <p className='mt-10 font-semibold'>
          {type === 'follower' ? '나를 팔로워한 사람들' : '내가 팔로잉한 사람들'}
        </p>
      </section>
      <section id='content'>
        <ContentComponent data={getFollows} />
      </section>
    </main>
  );
};

export default FollowPage;
