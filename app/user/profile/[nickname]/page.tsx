'use client';
import { Button } from '@/app/_components/buttons/Button';
import { CompletionComponent } from '@/app/user/profile/components/Completion';
import { useRouter } from 'next/navigation';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';

const UserProfilePage = () => {
  const router = useRouter();
  const { userInfo } = useGetUserInfo();

  return (
    <main>
      <section id='top' className='flex mt-10 justify-center items-center px-5'>
        <section id='top_wrapper' className='flex flex-col  w-[100%]'>
          <div id='user_wrapper' className='flex text-center items-end justify-between px-5'>
            <ProfileImage imageSrc={userInfo?.profileImg} wrapperWidth={30} wrapperHeight={30} />
            <div id='challenge'>
              <p className='font-bold text-[19px]'>{userInfo?.username}</p>
              <p className='font-semibold mb-5 text-[13px] text-[#CCC] text-left'>{`${userInfo?.nickname ? '(' + userInfo?.nickname + ')' : ''}`}</p>
              <div>
                <span className='font-bold'>99일</span>
                <br />
                진행중
              </div>
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
              <span className='font-bold'>99</span>
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
              <span className='font-bold'>99</span>
              <br />
              <span>팔로잉</span>
            </div>
          </div>
          <div id='button_wrapper' className='flex justify-center gap-10 mt-10 px-5'>
            <Button
              type='default'
              color='default'
              className='w-[200px]'
              onClick={() => {
                router.push('/challenges');
              }}
            >
              챌린지 보러가기
            </Button>
            <Button
              type='default'
              color='default'
              className='w-[200px]'
              onClick={() => {
                router.push(`/user/profile/edit/${userInfo?.nickname}`);
              }}
            >
              프로필 편집
            </Button>
          </div>
          <div id='routine_wrapper' className='flex flex-col py-8 gap-1'>
            <p className='w-[100%]'>금주 21일째 실천중! 💦</p>
            <p className='w-[100%]'>금주 21일째 실천중! 💦</p>
            <p className='w-[100%]'>금주 21일째 실천중! 💦</p>
            <p className='w-[100%]'>금주 21일째 실천중! 💦</p>
            <p className='w-[100%]'>금주 21일째 실천중! 💦</p>
          </div>
          <div id='achievement_wrapper'>
            <div></div>
          </div>
        </section>
      </section>
      <section id='bottom' className='px-5 h-[550px]'>
        <CompletionComponent
          profileImg={userInfo?.profileImg}
          username={userInfo?.username || ''}
          nickname={userInfo?.nickname || ''}
          userId={userInfo?.id || ''}
        />
      </section>
    </main>
  );
};

export default UserProfilePage;
