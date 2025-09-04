'use client';
import { Button } from '@/app/user/profile/components/Button';
import { CompletionComponent } from '@/app/user/profile/components/Completion';
import { useRouter } from 'next/navigation';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';
import { getUserChallengeAndRoutineAndFollowAndCompletion } from '@/libs/api/dashboards.api';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { RoutineComponent } from '@/app/user/profile/components/Routine';
import { UserChallengeAndRoutineAndFollowAndCompletionDto } from '@/backend/users/application/dtos/UserChallengeAndRoutineAndFollowAndCompletion';
import { ChallengeSelectComponent } from '@/app/user/profile/components/ChallengeSelect';
import NoneProfile from '@/app/_components/none/NoneProfile';
import { AvatarSkeleton, ButtonSkeleton, TextSkeleton } from '@/app/_components/skeleton/Skeleton';
import { BackComponent } from '@/app/_components/back/Back';

export const UserPage = ({
  userNickname,
  sessionNickname,
}: {
  userNickname: string;
  sessionNickname: string;
}) => {
  const router = useRouter();
  const [getUserData, setUserData] = useState<UserChallengeAndRoutineAndFollowAndCompletionDto>({
    id: '',
    username: '',
    nickname: '',
    profileImgPath: '',
    profileImg: '',
    challenges: [],
    followers: [],
    following: [],
  });
  const [getSelectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [getSelectedChallengeName, setSelectedChallengeName] = useState<string>('');
  const [getShow, setShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const selectWrapperRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const response = await getUserChallengeAndRoutineAndFollowAndCompletion(userNickname || '');
    if (response?.data) {
      setUserData({ ...response.data, nickname: decodeURIComponent(response.data.nickname) });
      setIsLoading(false);
    }
  }, [userNickname]);

  const shouldFetchData = useMemo(() => {
    return userNickname && getUserData.challenges.length === 0;
  }, [userNickname, getUserData.challenges.length]);

  useEffect(() => {
    if (shouldFetchData) fetchData();
  }, [shouldFetchData, fetchData]);

  useEffect(() => {
    if (getUserData.challenges.length > 0 && getSelectedChallengeId === null) {
      const firstChallenge = getUserData.challenges[0];
      setSelectedChallengeId(firstChallenge.id);
      setSelectedChallengeName(firstChallenge.name);
    }
  }, [getUserData, getSelectedChallengeId, setSelectedChallengeId, setSelectedChallengeName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectWrapperRef.current && !selectWrapperRef.current.contains(event.target as Node))
        if (getShow) setShow(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [getShow, setShow]);

  const filteredUserData = useMemo(() => {
    if (!getSelectedChallengeId) return getUserData;

    const filteredChallenges = getUserData.challenges.filter(
      challenge => challenge.id === getSelectedChallengeId
    );
    return {
      ...getUserData,
      challenges: filteredChallenges,
    };
  }, [getUserData, getSelectedChallengeId]);

  return (
    <main>
      <section id='top' className='flex mt-10 justify-center px-4 sm:px-5'>
        <section id='top_wrapper' className='flex flex-col w-full max-w-lg'>
          {sessionNickname != userNickname && <BackComponent />}
          <div
            id='user_wrapper'
            className='flex flex-col items-center sm:flex-row sm:items-end justify-between gap-4 px-1 sm:px-5'
          >
            <div className='flex items-end gap-4 w-full sm:w-auto max-sm:px-[40px]'>
              {isLoading ? (
                <AvatarSkeleton
                  size={'large'}
                  className='w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] shrink-0'
                />
              ) : getUserData?.profileImg ? (
                <div className='w-[120px] h-[100px] sm:w-[120px] sm:h-[120px] shrink-0'>
                  <ProfileImage
                    imageSrc={getUserData?.profileImg}
                    wrapperWidth={30}
                    wrapperHeight={30}
                  />
                </div>
              ) : (
                <NoneProfile
                  className={`w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full overflow-hidden border-primary border-2 shrink-0`}
                />
              )}

              <div id='user_text_and_challenge' className='flex flex-col flex-grow min-w-0 '>
                {isLoading ? (
                  <TextSkeleton lines={2} className='mb-2' />
                ) : (
                  <>
                    <div className='relative group'>
                      <span className='font-bold text-xl sm:text-[19px] text-left block w-[130px] truncate'>
                        {getUserData?.username}
                      </span>
                      {getUserData?.username && (
                        <span
                          className='absolute top-full left-1/2 -translate-x-1/2 mt-2
                     invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300
                     bg-gray-800 text-white text-xs rounded py-1 px-2 z-50 whitespace-nowrap'
                        >
                          {getUserData?.username}
                        </span>
                      )}
                    </div>
                    <p className='font-semibold mb-3 text-xs sm:text-[13px] w-[130px] text-[#CCC] text-left truncate'>{`${
                      getUserData?.nickname ? '(' + getUserData?.nickname + ')' : ''
                    }`}</p>{' '}
                  </>
                )}
                <div
                  id='challenge'
                  className={`relative ${sessionNickname === userNickname ? '' : 'ml-0'} w-full`}
                  ref={selectWrapperRef}
                >
                  <div className='w-full min-h-[54px] line-clamp-2'>
                    {isLoading ? (
                      <TextSkeleton lines={2} className='w-[100px] mt-2' />
                    ) : getUserData.challenges.length > 0 ? (
                      <div
                        className='max-w-[142px] cursor-pointer'
                        onClick={() => {
                          setShow(prev => !prev);
                        }}
                      >
                        <span className='font-bold text-[15px]'>
                          {getSelectedChallengeName ? `${getSelectedChallengeName}` : '챌린지'}
                        </span>
                        <br />
                        <span className='font-bold [word-break: break-all] max-w-[130px] max-h-[82px]'>
                          {getSelectedChallengeName && '챌린지 선택'}
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className='font-bold'>아직 챌린지가</span>
                        <br />
                        <span className='font-bold'>없어요</span>
                      </>
                    )}
                  </div>
                  {getShow && (
                    <ChallengeSelectComponent
                      getUserData={getUserData}
                      selectedChallengeId={getSelectedChallengeId}
                      onSelectChallenge={(id, name) => {
                        setSelectedChallengeId(id);
                        setSelectedChallengeName(name);
                        setShow(false);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div
              id='follow_counts'
              className='flex justify-around w-full sm:w-auto mt-4 sm:mt-0 gap-4 sm:gap-6'
            >
              {isLoading ? (
                <TextSkeleton lines={2} className='w-[60px]' />
              ) : sessionNickname === userNickname ? (
                <div
                  className='cursor-pointer text-center'
                  onClick={() => {
                    const query = new URLSearchParams({
                      nickname: getUserData?.nickname || '',
                      t: 'follower',
                    }).toString();
                    router.push(`/user/follow?${query}`);
                  }}
                >
                  <span className='font-bold text-lg'>{getUserData?.followers?.length}</span>
                  <br />
                  <span className='text-sm'>팔로워</span>
                </div>
              ) : (
                <div className='text-[10px] text-[#ccc] text-center'>
                  <span>
                    팔로워를
                    <br />
                    이용하실 수 없어요.
                  </span>
                </div>
              )}
              {isLoading ? (
                <TextSkeleton lines={2} className='w-[60px]' />
              ) : sessionNickname === userNickname ? (
                <div
                  className='cursor-pointer text-center'
                  onClick={() => {
                    const query = new URLSearchParams({
                      nickname: getUserData?.nickname || '',
                      t: 'following',
                    }).toString();
                    router.push(`/user/follow?${query}`);
                  }}
                >
                  <span className='font-bold text-lg'>{getUserData?.following?.length}</span>
                  <br />
                  <span className='text-sm'>팔로잉</span>
                </div>
              ) : (
                <div className='text-[10px] text-[#ccc] text-center'>
                  <span>
                    팔로잉을
                    <br />
                    이용하실 수 없어요.
                  </span>
                </div>
              )}
            </div>
          </div>
          <div
            id='button_wrapper'
            className={`flex flex-col gap-3 mt-8 px-1 sm:px-5 sm:flex-row ${sessionNickname != userNickname ? 'justify-end' : 'justify-center'}`}
          >
            {isLoading ? (
              <ButtonSkeleton width={'w-full sm:w-[200px]'} className='h-[44px] rounded-[10px]' />
            ) : (
              <Button
                className={
                  'w-full sm:w-[200px] z-20 bg-[#FFC70A] text-white px-4 py-2 rounded-[10px] text-lg font-bold shadow-lg cursor-pointer hover:animate-float transition-all duration-300 hover:scale-105 sm:hover:scale-110'
                }
                onClick={() => {
                  router.push(`/user/dashboard/${userNickname}`);
                }}
              >
                대시보드 보러가기
              </Button>
            )}
            {isLoading ? (
              <ButtonSkeleton width={'w-full sm:w-[200px]'} className='h-[44px] rounded-[10px]' />
            ) : sessionNickname === userNickname ? (
              <Button
                className={
                  'w-full sm:w-[200px] z-20 bg-[#48a9a0] text-white px-4 py-2 rounded-[10px] text-lg font-bold shadow-lg cursor-pointer hover:animate-float transition-all duration-300 hover:scale-105 sm:hover:scale-110'
                }
                onClick={() => {
                  router.push(`/user/profile/edit/${sessionNickname}`);
                }}
              >
                프로필 편집
              </Button>
            ) : (
              <></>
            )}
          </div>

          <div id='routine_wrapper' className='flex flex-col py-8 gap-1 px-1 sm:px-5 pt-0'>
            <RoutineComponent getUserData={filteredUserData} isLoading={isLoading} />
          </div>
          <div id='achievement_wrapper'>
            <div></div>
          </div>
        </section>
      </section>
      <section id='bottom' className='px-4 sm:px-5 h-auto min-h-[550px]'>
        <CompletionComponent
          profileImg={getUserData?.profileImg || null}
          username={getUserData?.username || ''}
          nickname={userNickname || ''}
          userId={getUserData?.id || ''}
          propLoading={isLoading}
        />
      </section>
    </main>
  );
};
