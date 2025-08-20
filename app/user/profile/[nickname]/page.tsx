'use client';
import { Button } from '@/app/user/profile/components/Button';
import { CompletionComponent } from '@/app/user/profile/components/Completion';
import { useRouter } from 'next/navigation';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { usersApi } from '@/libs/api/users.api';
import { useEffect, useState, useRef, useMemo } from 'react';
import { RoutineComponent } from '@/app/user/profile/components/Routine';
import { UserChallengeAndRoutineAndFollowAndCompletionDto } from '@/backend/users/applications/dtos/UserChallengeAndRoutineAndFollowAndCompletion';
import { SelectComponent } from '@/app/user/profile/components/Select';
import NoneProfile from '@/app/_components/none/NoneProfile';

const UserProfilePage = () => {
  const router = useRouter();
  const [getUserData, setUserData] = useState<UserChallengeAndRoutineAndFollowAndCompletionDto>({
    challenges: [],
    followers: [],
    following: [],
  });
  const [getSelectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [getSelectedChallengeName, setSelectedChallengeName] = useState<string>('');
  const [getShow, setShow] = useState<boolean>(false);

  const selectWrapperRef = useRef<HTMLDivElement>(null);

  const { userInfo } = useGetUserInfo();
  const { getUserAllData } = usersApi;

  const fetchData = async () => {
    const response = await getUserAllData(userInfo?.nickname || '', userInfo?.id || '');
    if (response?.data) setUserData({ ...response.data });
  };

  useEffect(() => {
    if (userInfo?.nickname && getUserData.challenges.length === 0) fetchData();
  }, [userInfo, getUserData]);

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
    if (!getSelectedChallengeId) return getUserData; //변수명도 생각안나고 백엔드 Dto명이나 엔티티도 생각안나서 테이블 조인한거 테이블명 에다가 And 해놓음~ ㅋ

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
            {userInfo?.profileImg ? (
              <ProfileImage imageSrc={userInfo?.profileImg} wrapperWidth={30} wrapperHeight={30} />
            ) : (
              <NoneProfile
                className={`w-[120] h-[120] rounded-full overflow-hidden border-primary border-2`}
              />
            )}
            <div id='challenge' className='relative' ref={selectWrapperRef}>
              <p className='font-bold text-[19px]'>{userInfo?.username}</p>
              <p className='font-semibold mb-5 text-[13px] text-[#CCC] text-left'>{`${userInfo?.nickname ? '(' + userInfo?.nickname + ')' : ''}`}</p>
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
                <SelectComponent
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
            <div
              className='cursor-pointer mr-[20px]'
              onClick={() => {
                const query = new URLSearchParams({
                  nickname: userInfo?.nickname || '',
                  t: 'follower',
                }).toString();
                router.push(`/user/follow?${query}`);
              }}
            >
              <span className='font-bold'>{getUserData?.followers?.length}</span>
              <br />
              <span>팔로워</span>
            </div>
            <div
              className='cursor-pointer'
              onClick={() => {
                const query = new URLSearchParams({
                  nickname: userInfo?.nickname || '',
                  t: 'following',
                }).toString();
                router.push(`/user/follow?${query}`);
              }}
            >
              <span className='font-bold'>{getUserData?.following?.length}</span>
              <br />
              <span>팔로잉</span>
            </div>
          </div>
          <div id='button_wrapper' className='flex justify-center gap-10 mt-10 px-5'>
            <Button
              className={
                'w-[200px] z-20 bg-primary text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg cursor-pointer hover:animate-float transition-all duration-300 hover:scale-110'
              }
              onClick={() => {
                router.push('/user/dashboard');
              }}
            >
              대시보드 보러가기
            </Button>
            <Button
              className={
                'w-[200px] z-20 bg-primary text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg cursor-pointer hover:animate-float transition-all duration-300 hover:scale-110'
              }
              onClick={() => {
                router.push(`/user/profile/edit/${userInfo?.nickname}`);
              }}
            >
              프로필 편집
            </Button>
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
          profileImg={userInfo?.profileImg || null}
          username={userInfo?.username || ''}
          nickname={userInfo?.nickname || ''}
          userId={userInfo?.id || ''}
        />
      </section>
    </main>
  );
};

export default UserProfilePage;
