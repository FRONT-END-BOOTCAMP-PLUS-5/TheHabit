import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ICategory {
  init: () => void;
  type: 'follower' | 'following';
}

const SELECTED = 'border-b-4 border-black';
const NICK_NAME = '이게 도파민이지...';

export const CategoryComponent = ({ init, type }: ICategory) => {
  const router = useRouter();
  const [getCategory, setCategory] = useState<'follower' | 'following'>(type);
  const handlerSelected = (category: 'follower' | 'following') => {
    init();
    router.push(`/user/follow?nickname=${NICK_NAME}&t=${category}`);
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
