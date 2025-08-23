import NoneSearchData from '@/app/_components/none/NoneSearchData';
import React from 'react';
import { newUserDto } from '@/backend/users/applications/dtos/UserDto';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';
import NoneProfile from '@/app/_components/none/NoneProfile';
import { Button } from '@/app/_components/buttons/Button';

interface IContent {
  data?: newUserDto[] | undefined;
  onToggleFollow: (targetUserId: string, isFollowing: boolean | undefined) => void;
}

export const ContentComponent = ({ data, onToggleFollow }: IContent) => {
  const noneSearch = () => {
    return (
      <NoneSearchData>
        <p>찾아봤는데...해당 데이터가 없네요..😮</p>
      </NoneSearchData>
    );
  };
  return (
    <div
      id='follow_content'
      className='mt-5 mb-5 flex justify-around max-h-[450px] overflow-scroll'
    >
      <ul className='w-full'>
        {data && data.length > 0
          ? data?.map(item => {
              return (
                <li key={item.nickname} className='flex justify-between items-center mb-8'>
                  <div id='follower_users' className='flex items-center gap-2'>
                    {item.profileImg ? (
                      <ProfileImage
                        imageSrc={item.profileImg}
                        wrapperWidth={20}
                        wrapperHeight={20}
                      />
                    ) : (
                      <NoneProfile
                        className={`w-[80px] h-[80px] rounded-full overflow-hidden border-primary border-2`}
                      />
                    )}
                    <div className='flex flex-col'>
                      <span className='text-[14px] text-[#1f2328]'>{item.username}</span>
                      <span className='text-[10px] mt-2 text-[#59636e]'>
                        {'(' + item.nickname + ')'}
                      </span>
                    </div>
                  </div>
                  <Button
                    color='default'
                    className='w-[100px]'
                    onClick={() => onToggleFollow(item.id || '', item.isFollowing)}
                  >
                    {item.isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                </li>
              );
            })
          : noneSearch()}
      </ul>
    </div>
  );
};
