'use client';

import { useGetUserCompletion } from '@/libs/hooks/user-hooks/useGetUserCompletion';
import { useInView } from 'react-intersection-observer';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/user/profile/components/Button';
import Image from 'next/image';
import None from '@/app/_components/none/None';
import { USER_ROUTINE_COMPLETION_BTN } from '@/public/consts/userRoutineCompletionsBtn';
import { BUTTON_CLASS, CATEGORY_COLOR } from '@/public/consts/userRoutineCompletionsBtnColor';

import { useModalStore } from '@/libs/stores/modalStore';
import { CreateRoutineCompletionResponseDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import UserRoutineCompletion from '@/app/user/profile/components/UserRoutineCompletion';
import NoneImg from '@/app/_components/none/NoneImg';
import { ButtonSkeleton, Skeleton } from '@/app/_components/skeleton/Skeleton';
import { COMPLETION_SKELETON } from '@/public/consts/completionSkeleton';

export const CompletionComponent = ({
  profileImg,
  username,
  nickname,
  userId,
  propLoading,
}: {
  profileImg?: string | null;
  username: string;
  nickname: string;
  userId: string | null;
  propLoading?: boolean;
}) => {
  const [getSelectedCategory, setSelectedCategory] = useState<string>('All');
  const [getUserClicked, setUserClicked] = useState<boolean>(false);

  const { data, fetchNextPage, hasNextPage, isLoading } = useGetUserCompletion(
    nickname,
    getSelectedCategory,
    userId!
  );

  const rootRef = useRef<HTMLUListElement>(null);

  const { ref, inView } = useInView({
    root: rootRef.current,
    threshold: 0,
  });

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setUserClicked(true);
  };

  const { openModal } = useModalStore();

  const handleOpenModal = (
    profileImg: string | null,
    { proofImgUrl, content, createdAt, id }: CreateRoutineCompletionResponseDto
  ) => {
    openModal(
      <UserRoutineCompletion
        proofImgUrl={proofImgUrl || ''}
        content={content || '내용이 없어요'}
        createdAt={createdAt}
        profileImg={profileImg}
        username={username}
        nickname={nickname}
        routineCompletionId={id.toString()}
      />,
      'floating'
    );
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const allCompletions = data?.pages.flatMap(page => page.data) || [];

  let contentToRender = null;

  if (isLoading && userId != 'edit') {
    contentToRender = (
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-1 overflow-y-scroll scroll-smooth max-h-[450px]'>
        {COMPLETION_SKELETON.map((_, idx) => (
          <Skeleton
            key={idx}
            width={'w-[144px]  max-sm:w-[186px]'}
            height={'h-[144px] max-sm:h-[186px]'}
          />
        ))}
      </div>
    );
  } else if (
    (allCompletions.length === 0 && getUserClicked) ||
    allCompletions.length === 0 ||
    userId === 'edit'
  ) {
    contentToRender = <None userId={userId!} />;
  } else {
    contentToRender = (
      <ul
        className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-1 overflow-y-scroll scroll-smooth max-h-[450px]'
        ref={rootRef}
      >
        {allCompletions.map((item, idx: number) => {
          const isLastItem = idx === allCompletions.length - 1;
          return (
            <li
              key={item.id}
              className='relative aspect-square cursor-pointer'
              ref={isLastItem ? ref : null}
              onClick={() => handleOpenModal(profileImg || null, item)}
            >
              {item.proofImgUrl ? (
                <Image
                  src={item.proofImgUrl}
                  alt='유저 컴플리션 인증 사진들'
                  fill
                  className='object-cover rounded-sm'
                  sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw'
                />
              ) : (
                <NoneImg rounded={'md'} type={true} content={item.content || ''} />
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <>
      <section
        id='btn_section'
        className='flex justify-center gap-[10px] mb-[10px] font-semibold text-[12px]'
      >
        {USER_ROUTINE_COMPLETION_BTN.map(item => {
          const isSelected = getSelectedCategory === item.id;
          const selectedClass = isSelected ? CATEGORY_COLOR[item.id] : 'bg-white text-[#333]';

          return propLoading ? (
            <ButtonSkeleton key={item.id} width={'w-[80px] rounded-full'} />
          ) : (
            <Button
              key={item.id}
              className={`${BUTTON_CLASS} ${selectedClass}`}
              onClick={() => {
                if (userId !== 'edit') selectCategory(item.id);
              }}
              disabled={userId === 'edit'}
            >
              {item.id !== 'All' && (
                <Image
                  src={item.icon}
                  alt={item.alt}
                  width={16}
                  height={12}
                  className='opacity-80'
                />
              )}
              {item.label}
            </Button>
          );
        })}
      </section>
      {contentToRender}
    </>
  );
};
