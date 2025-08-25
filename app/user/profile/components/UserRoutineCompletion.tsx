'use client';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';
import Image from 'next/image';
import { Button } from '@/app/user/profile/components/Button';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getKoreanDateFromDate } from '@/public/utils/dateUtils';
import { REVIEW_ARR, REVIEW_EMOTION } from '@/public/consts/userCompletionIcon';
import {
  createUserRoutineCompletionEmotion,
  deleteUserRoutineCompletionEmotion,
  getUserRoutineCompletionReview,
} from '@/libs/api/users.api';
import { UserReviewDto } from '@/backend/users/applications/dtos/UserReviewDto';
import NoneImg from '@/app/_components/none/NoneImg';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';

interface IUserRoutineCompletion {
  proofImgUrl: string;
  content?: string;
  createdAt: Date;
  username: string;
  nickname: string;
  profileImg: string | null;
  routineCompletionId: string;
}

const UserRoutineCompletion = ({
  proofImgUrl,
  content,
  createdAt,
  username,
  nickname,
  profileImg,
  routineCompletionId,
}: IUserRoutineCompletion) => {
  const [getReviewContainer, setReviewContainer] = useState<boolean>(false);
  const [getReviewEmotion, setReviewEmotion] = useState<UserReviewDto[]>([]);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const reviewSectionRef = useRef<HTMLDivElement>(null);

  const { userInfo } = useGetUserInfo();

  const changeDate = () => {
    const date = new Date(createdAt);
    return getKoreanDateFromDate(date);
  };

  const getReviewEmoji = useCallback(async () => {
    const response = await getUserRoutineCompletionReview(nickname, routineCompletionId);
    const reviews = response.data || [];
    setReviewEmotion([...reviews]);

    const userSelected = reviews
      .filter(item => item.nicknames?.includes(userInfo?.nickname || ''))
      .map(item => item.reviewContent);

    setSelectedEmojis(userSelected);
  }, [nickname, routineCompletionId, userInfo?.nickname]);

  useEffect(() => {
    getReviewEmoji();
  }, [getReviewEmoji]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reviewSectionRef.current && !reviewSectionRef.current.contains(event.target as Node))
        setReviewContainer(false);
    };

    if (getReviewContainer) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [getReviewContainer]); // The effect re-runs whenever getReviewContainer changes

  const selectEmoji = async (explain: string) => {
    const isSelected = selectedEmojis.includes(explain);
    if (isSelected) {
      await deleteUserRoutineCompletionEmotion(
        nickname,
        userInfo?.id || '',
        routineCompletionId,
        explain
      );
      setSelectedEmojis(prev => prev.filter(emoji => emoji !== explain));
    } else {
      await createUserRoutineCompletionEmotion(
        nickname,
        explain,
        routineCompletionId,
        userInfo?.id || ''
      );
      setSelectedEmojis(prev => [...prev, explain]);
    }

    setReviewContainer(false);
    await getReviewEmoji();
  };

  const formatToolTipText = (users: string[]): string => {
    if (!users || users.length === 0) return '';
    const totalUsers = users.length;
    if (totalUsers <= 5) return users.join(', ');

    const visibleUsers = users.slice(0, 5).join(', ');
    const remainingCount = totalUsers - 5;
    return `${visibleUsers}, 그 외 ${remainingCount}명`;
  };

  return (
    <section id='user_routine_completion_modal_wrapper' className='pb-2'>
      <div id='top' className='flex items-center gap-2 relative'>
        <div className='flex items-center gap-2 mb-8'>
          <ProfileImage imageSrc={profileImg} wrapperWidth={16} wrapperHeight={16} />
          <div className='flex flex-col items-left flex-shrink-0'>
            <div className='relative group'>
              <span className='font-bold text-[16px] block max-w-[160px] truncate'>{username}</span>
              <span
                className='absolute top-full left-1/2 -translate-x-1/2 mt-2
                     invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300
                     bg-gray-800 text-white text-xs rounded py-1 px-2 z-50 whitespace-nowrap'
              >
                {username}
              </span>
            </div>
            <span className='font-semibold text-[12px] text-[#CCC]'>({nickname})</span>
          </div>
        </div>
        <div className='absolute top-3 right-2 text-[12px] text-[#656565]'>{changeDate()}</div>
      </div>
      <div id='middle' className='w-full h-full mb-8'>
        {proofImgUrl ? (
          <Image
            src={proofImgUrl}
            alt={content || '유저 루틴 완료 이미지 사진'}
            width={600}
            height={800}
            className='w-full h-auto'
            placeholder='blur'
            blurDataURL='data:image/jpeg;base64,...'
          />
        ) : (
          <NoneImg height={'300px'} type={false} />
        )}

        <div className='mt-3 line-clamp-4 text-[14px]'>{content}</div>
      </div>
      <div id='bottom' className='relative' ref={reviewSectionRef}>
        <div className='flex items-center gap-2'>
          <Button
            className={`rounded-full border-1 w-[28px] h-[28px] bg-[#F6F8FA] border-[#d1d9e0] flex items-center justify-center cursor-pointer hover:bg-[#EFF2F5]`}
            onClick={() => {
              setReviewContainer(prev => !prev);
            }}
          >
            <Image
              src='/icons/face-smile-regular-full.svg'
              alt='클릭시 상대한테 감정표현으로 표현'
              width={24}
              height={24}
            />
          </Button>
          <div id='review_emotion_wrapper' className='flex absolute left-[40px]'>
            {getReviewEmotion.map(item => {
              const matchingEmotion = Object.values(REVIEW_EMOTION).find(
                emotion => emotion.explain === item.reviewContent
              );
              const selectedNickname = item.nicknames?.find(
                userNickname => userNickname === userInfo?.nickname
              );
              if (matchingEmotion) {
                return (
                  <div key={item.id} className='relative group'>
                    <button
                      className={`mr-2 flex items-center gap-1 
                                  border border-[#d1d9e0] rounded-[20px] 
                                  py-[3px] px-[6px] justify-center 
                                  cursor-pointer ${selectedNickname ? 'bg-[#DDF4FF] !border-[#0969DA]' : 'bg-[#FFF]'}`}
                      onClick={() => {
                        selectEmoji(item.reviewContent);
                      }}
                    >
                      {matchingEmotion.icon}
                      <span className='text-[12px] font-bold'>{item.count}</span>
                    </button>
                    <div
                      className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                  invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200
                                  [word-break:keep-all] text-center w-fit min-w-[80px] max-w-xs word-break-keep-all bg-gray-900 text-white text-sm font-normal rounded-md p-2 z-10 shadow-lg text-[12px]'
                    >
                      {formatToolTipText(item.usernames!)}
                      <div
                        className='absolute left-1/2 -translate-x-1/2 top-full w-0 h-0
                                    border-x-4 border-x-transparent border-t-4 border-t-gray-800'
                      />
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        {getReviewContainer && (
          <div
            id='review_icons'
            className='absolute animate-slide-up bottom-[-52px] left-0 flex gap-3 border-[#d1d9e0] border rounded-[20px] bg-white p-2 shadow-md'
          >
            {REVIEW_ARR.map((_, idx) => {
              const emojiData = REVIEW_EMOTION[idx + 1];
              const isSelected = selectedEmojis.includes(emojiData.explain);
              const buttonClassName = `cursor-pointer w-[32px] rounded-[10px] py-[4px] px-[6px] ${isSelected ? 'bg-[#DDF4FF]' : 'hover:bg-[#0860ca]'}`;

              return (
                <button
                  key={idx}
                  className={buttonClassName}
                  onClick={() => selectEmoji(emojiData.explain)}
                >
                  {emojiData.icon}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default UserRoutineCompletion;
