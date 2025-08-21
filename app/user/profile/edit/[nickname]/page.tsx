'use client';
import React, { useEffect, useState } from 'react';
import { useUploadProfile } from '@/libs/hooks/signup/useUploadProfile';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';
import Image from 'next/image';
import { NameComponent } from '@/app/user/profile/edit/_components/Name';
import { NicknameComponent } from '@/app/user/profile/edit/_components/Nickname';
import { usersApi } from '@/libs/api/users.api';
import { useRouter } from 'next/navigation';
import { BackComponent } from '@/app/_components/back/Back';
import { CompletionComponent } from '@/app/user/profile/components/Completion';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { RoutineComponent } from '@/app/user/profile/components/Routine';
import LogOut from '@/app/user/profile/edit/_components/LogOut';

const UserProfileEditPage = () => {
  const router = useRouter();
  const { userInfo, update } = useGetUserInfo();
  const [profilePreview, setProfilePreview] = useState<string | null>(userInfo?.profileImg || '');

  const { handleImageClick, fileInputRef } = useUploadProfile();

  const { updateUser, deleteRegister } = usersApi;

  const handleDeleteUserRegister = async () => {
    //나중에 confirm창으로 추가 validation 해야함!
    const response = await deleteRegister(userInfo?.id || '');
    if (response.data) router.push('/login');
  };

  const handleFileChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) {
      const type = userInfo?.profileImg ? 'update' : 'create';

      const formData = new FormData();

      formData.append('id', userInfo?.id || '');
      formData.append('profile_img_path', userInfo?.profileImgPath || '');
      formData.append('username', userInfo?.username || '');
      formData.append('nickname', userInfo?.nickname || '');
      formData.append('file', file);
      formData.append('type', type);

      const response = await updateUser(userInfo?.nickname || '', formData);
      const img = response.data?.profileImg as string;
      const path = response.data?.profileImgPath as string;
      setProfilePreview(img);

      update({
        profileImg: img,
        profileImgPath: path,
        username: userInfo?.username,
        nickname: userInfo?.nickname,
      });
    }
  };

  useEffect(() => {
    if (userInfo?.profileImg) {
      setProfilePreview(userInfo.profileImg);
    }
  }, [userInfo]);

  return (
    <main>
      <section id='logo_wrapper' className='positive pt-[10px]'>
        <BackComponent />
      </section>
      <section id='top' className='flex mt-10 justify-center items-center px-5'>
        <section id='top_wrapper' className='flex flex-col  w-[100%]'>
          <div
            id='user_wrapper'
            className='flex text-center items-end justify-between px-5 pt-[110px]'
          >
            <div className='relative w-[190px] h-30 rounded-full bg-[#F5F5F5] bottom-[40px]'>
              <ProfileImage
                imageSrc={profilePreview || null}
                className='w-full h-full object-cover'
                wrapperWidth={30}
                wrapperHeight={30}
              />
              <Image
                src='/icons/camera.svg'
                alt='프로필 업로드'
                width={24}
                height={24}
                className='absolute bottom-0 right-0 cursor-pointer z-10 border border-light-gray bg-white rounded-full'
                onClick={handleImageClick}
              />
              <input
                type='file'
                className='hidden'
                accept='image/*'
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            <div id='challenge' className='flex flex-col items-start ml-[40px]'>
              <div className='flex flex-col mb-5 items-start absolute top-[100px] w-[240px] text-left ml-[10px] mt-[20px]'>
                <NameComponent />
                <NicknameComponent />
              </div>
              <div className='cursor-not-allowed text-[#ccc] text-[12px]'>
                <span className='font-bold'>편집에서는</span>
                <br />
                <span>챌린지 선택을 이용하실 수 없어요</span>
              </div>
            </div>
            <div className='cursor-not-allowed text-[#ccc] text-[12px]'>
              <span className='font-bold'>팔로워는</span>
              <br />
              <span>편집에서 이용할 수 없어요</span>
            </div>
            <div className='cursor-not-allowed text-[#ccc] text-[12px]'>
              <span className='font-bold'>팔로잉은</span>
              <br />
              <span>편집에서 이용할 수 없어요</span>
            </div>
          </div>
          <div id='button_wrapper' className='flex justify-end gap-10 mt-10 px-5'>
            <LogOut />
            <button
              color='default'
              className='w-[100px]
              h-8
              px-6
              cursor-pointer
              bg-[#f74444]
              hover:bg-[#ef0202]
              text-white
              font-medium
              text-sm
              rounded-lg
              transition-colors
              duration-200
              shadow-md
              hover:shadow-lg
              focus:outline-none
              focus:ring-2
              focus:ring-[#93d50b]
              focus:ring-opacity-50'
              onClick={handleDeleteUserRegister}
            >
              회원탈퇴
            </button>
          </div>
          <div id='routine_wrapper' className='flex flex-col py-8 gap-1'>
            <RoutineComponent type='edit' />
          </div>
          <div id='achievement_wrapper'></div>
        </section>
      </section>
      <section id='bottom'>
        <CompletionComponent profileImg={''} username={''} nickname={''} userId={'edit'} />
      </section>
    </main>
  );
};

export default UserProfileEditPage;
