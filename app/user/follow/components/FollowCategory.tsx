import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SELECTED } from '@/public/consts/userFollowSelected';

interface ICategory {
  init: () => void;
  type: 'follower' | 'following';
  nickname: string;
}

export const FollowCategoryComponent = ({ init, type, nickname }: ICategory) => {
  const router = useRouter();
  const [getCategory, setCategory] = useState<'follower' | 'following'>(type);
  const handlerSelected = (category: 'follower' | 'following') => {
    init();
    router.push(`/user/follow?nickname=${nickname}&t=${category}`);
    setCategory(category);
  };

  return (
    <div id='follow_category' className='mt-5 mb-5 flex justify-around'>
      <span
        onClick={() => {
          handlerSelected('follower');
        }}
        className={`text-[18px] cursor-pointer ${getCategory === 'follower' ? SELECTED : ''}`}
      >
        팔로워
      </span>
      <span
        onClick={() => {
          handlerSelected('following');
        }}
        className={`text-[18px] cursor-pointer ${getCategory === 'following' ? SELECTED : ''}`}
      >
        팔로잉
      </span>
    </div>
  );
};
