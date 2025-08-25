'use client';
import CustomInput from '@/app/_components/inputs/CustomInput';
import { useState, useEffect, useMemo } from 'react';
import { ContentComponent } from '@/app/user/search/_components/Content';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { useFollowMutation } from '@/libs/hooks/user-hooks/useCreateFollow';
import { useUnfollowMutation } from '@/libs/hooks/user-hooks/useDeleteFollow';
import { debounce } from 'lodash';
import { AvatarSkeleton, ButtonSkeleton, TextSkeleton } from '@/app/_components/skeleton/Skeleton';
import { COMPLETION_SKELETON } from '@/public/consts/completionSkeleton';
import { useGetUsers } from '@/libs/hooks/user-hooks/useGetUsers';

const SearchPage = () => {
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

  const { data: users, isLoading } = useGetUsers(
    userInfo?.nickname || '',
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

  return (
    <main className='px-5'>
      <section id='head' className='mt-[40px]'>
        <div id='follow_wrapper' className='flex items-center gap-[5.8rem]'></div>
        <CustomInput
          placeholder='원하는 사람을 찾아보세요'
          className='border-t-0 border-l-0 border-r-0 border-b-2 focus:!border-[#07bc0c] rounded-[0px] hover:border-[#07bc0c] !shadow-none '
          onChange={evt => {
            setSearchTerm(evt.target.value);
            debounceSearch(evt.target.value);
          }}
          value={searchTerm}
        />
        <p className='mt-10 font-semibold'>
          친구 찾기 / <span>{users?.data ? users?.data.length : 0}명</span>
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
          <ContentComponent data={users?.data} onToggleFollow={handleToggleFollow} />
        )}
      </section>
    </main>
  );
};

export default SearchPage;
