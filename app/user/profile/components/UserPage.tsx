'use client';
import { Button } from '@/app/user/profile/components/Button';
import { CompletionComponent } from '@/app/user/profile/components/Completion';
import { useRouter } from 'next/navigation';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';
import { usersApi } from '@/libs/api/users.api';
import { useEffect, useState, useRef, useMemo } from 'react';
import { RoutineComponent } from '@/app/user/profile/components/Routine';
import { UserChallengeAndRoutineAndFollowAndCompletionDto } from '@/backend/users/applications/dtos/UserChallengeAndRoutineAndFollowAndCompletion';
import { ChallengeSelectComponent } from '@/app/user/profile/components/ChallengeSelect';
import NoneProfile from '@/app/_components/none/NoneProfile';

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
  const selectWrapperRef = useRef<HTMLDivElement>(null);

  const { getUserAllData } = usersApi;

  const fetchData = async () => {
    const response = await getUserAllData(userNickname || '');
    if (response?.data) setUserData({ ...response.data });
  };

  useEffect(() => {
    if (userNickname && getUserData.challenges.length === 0) fetchData();
  }, [getUserData, userNickname]);

  useEffect(() => {
    if (getUserData.challenges.length > 0 && getSelectedChallengeId === null) {
      const firstChallenge = getUserData.challenges[0];
      setSelectedChallengeId(firstChallenge.id);
      setSelectedChallengeName(firstChallenge.name);
    }
  }, [getUserData, getSelectedChallengeId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectWrapperRef.current && !selectWrapperRef.current.contains(event.target as Node))
        if (getShow) setShow(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [getShow]);

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
      <section id='top' className='flex mt-10 justify-center items-center px-5'>
        <section id='top_wrapper' className='flex flex-col  w-[100%]'>
          <div id='user_wrapper' className='flex text-center items-end justify-between px-5'>
            {getUserData?.profileImg ? (
              <div className='w-[120px]'>
                <ProfileImage
                  imageSrc={getUserData?.profileImg}
                  wrapperWidth={30}
                  wrapperHeight={30}
                />
              </div>
            ) : (
              <NoneProfile
                className={`w-[120] h-[120] rounded-full overflow-hidden border-primary border-2`}
              />
            )}
            <div id='challenge' className='relative' ref={selectWrapperRef}>
              <p className='font-bold text-[19px] text-left'>{getUserData?.username}</p>
              <p className='font-semibold mb-5 text-[13px] text-[#CCC] text-left'>{`${getUserData?.nickname ? '(' + getUserData?.nickname + ')' : ''}`}</p>
              <div className='cursor-pointer'>
                {getUserData.challenges.length > 0 ? (
                  <div
                    onClick={() => {
                      setShow(prev => !prev);
                    }}
                  >
                    <span className='font-bold'>
                      {getSelectedChallengeName ? `${getSelectedChallengeName}` : '챌린지'}
                    </span>
                    <br />
                    <span className='font-bold'>{getSelectedChallengeName && '챌린지'} 선택</span>
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
            {sessionNickname === userNickname ? (
              <div
                className='cursor-pointer mr-[20px]'
                onClick={() => {
                  const query = new URLSearchParams({
                    nickname: getUserData?.nickname || '',
                    t: 'follower',
                  }).toString();
                  router.push(`/user/follow?${query}`);
                }}
              >
                <span className='font-bold'>{getUserData?.followers?.length}</span>
                <br />
                <span>팔로워</span>
              </div>
            ) : (
              <div className='text-[10px] text-[#ccc]'>
                <span>
                  유저의 팔로워를
                  <br />
                  이용하실 수 없어요.
                </span>
              </div>
            )}

            {sessionNickname === userNickname ? (
              <div
                className='cursor-pointer'
                onClick={() => {
                  const query = new URLSearchParams({
                    nickname: getUserData?.nickname || '',
                    t: 'following',
                  }).toString();
                  router.push(`/user/follow?${query}`);
                }}
              >
                <span className='font-bold'>{getUserData?.following?.length}</span>
                <br />
                <span>팔로잉</span>
              </div>
            ) : (
              <div className='text-[10px] text-[#ccc]'>
                <span>
                  유저의 팔로잉을
                  <br />
                  이용하실 수 없어요.
                </span>
              </div>
            )}
          </div>
          <div
            id='button_wrapper'
            className={`flex gap-10 mt-10 px-5 ${sessionNickname != userNickname ? 'justify-end' : 'justify-center'}`}
          >
            <Button
              className={
                'w-[200px] z-20 bg-[#FFC70A] text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg cursor-pointer hover:animate-float transition-all duration-300 hover:scale-110'
              }
              onClick={() => {
                router.push('/user/dashboard');
              }}
            >
              대시보드 보러가기
            </Button>
            {sessionNickname === userNickname ? (
              <Button
                className={
                  'w-[200px] z-20 bg-[#48a9a0] text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg cursor-pointer hover:animate-float transition-all duration-300 hover:scale-110'
                }
                onClick={() => {
                  router.push(`/user/profile/edit/${getUserData?.nickname}`);
                }}
              >
                프로필 편집
              </Button>
            ) : (
              <></>
            )}
          </div>
          <div id='routine_wrapper' className='flex flex-col py-8 gap-1'>
            <RoutineComponent getUserData={filteredUserData} />
          </div>
          <div id='achievement_wrapper'>
            <div></div>
          </div>
        </section>
      </section>
      <section id='bottom' className='px-5 h-[550px]'>
        <CompletionComponent
          profileImg={getUserData?.profileImg || null}
          username={getUserData?.username || ''}
          nickname={userNickname || ''}
          userId={getUserData?.id || ''}
        />
      </section>
    </main>
  );
};
