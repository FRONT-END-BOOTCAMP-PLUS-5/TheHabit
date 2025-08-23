import { FollowerDto } from '@/backend/follows/applications/dtos/FollowerDto';
import { FollowingDto } from '@/backend/follows/applications/dtos/FollowingDto';
import { ListComponent } from '@/app/user/follow/components/List';
import NoneSearchData from '@/app/_components/none/NoneSearchData';
import React from 'react';

interface IContent {
  data?: FollowerDto | FollowingDto;
  onToggleFollow: (targetUserId: string, isFollowing: boolean | undefined) => void;
}

export const ContentComponent = ({ data, onToggleFollow }: IContent) => {
  const noneSearch = () => {
    return (
      <NoneSearchData>
        <p>
          어이쿠 해당 데이터가 없네요.. <br />
          이번기회에 찾으러 가볼까요? ❤️
        </p>
      </NoneSearchData>
    );
  };
  return (
    <div id='follow_content' className='mt-5 mb-5 flex justify-around h-[450px] overflow-scroll'>
      <ul className='w-full'>
        {data &&
          ('followers' in data
            ? data.followers.length > 0
              ? data?.followers.map(follower => {
                  return (
                    <ListComponent
                      key={follower.fromUser.id}
                      data={follower.fromUser}
                      onToggleFollow={onToggleFollow}
                    />
                  );
                })
              : noneSearch()
            : data?.following.length > 0
              ? data?.following.map(following => {
                  return (
                    <ListComponent
                      key={following.toUser.id}
                      data={following.toUser}
                      onToggleFollow={onToggleFollow}
                    />
                  );
                })
              : noneSearch())}
      </ul>
    </div>
  );
};
