'use client';

import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';
import { useUploadProfile } from '@/libs/hooks/signup/useUploadProfile';
import { useEffect } from 'react';
import CustomInput from '@/app/_components/inputs/CustomInput';

// 닉네임 자동 생성 함수
const generateRandomNickname = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // 6글자 랜덤 조합
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

export const ProfileSection = () => {
  const {
    setValue,
    watch,
  } = useFormContext();

  const { profilePreview, handleImageClick, fileInputRef, profileFile, handleFileChange } = useUploadProfile();
  const username = watch('username');

  useEffect(() => {
    if (profileFile) {
      setValue('profileImage', profileFile.name);
      setValue('profileImagePath', profileFile.name);
      setValue('profileFile', profileFile); 
    }
  }, [profileFile, setValue]);

  // 컴포넌트 마운트 시 닉네임 자동 생성
  useEffect(() => {
    const randomNickname = generateRandomNickname();
    setValue('nickname', randomNickname);
  }, [setValue]);

  return (
    <section className='grid grid-cols-[1fr_3fr] items-center gap-5 w-full mt-6 mb-6'>
      <div className='relative w-20 h-20 rounded-full bg-[#F5F5F5]'>
        <ProfileImage imageSrc={profilePreview || null} className='w-full h-full object-cover' />
        <Image
          src='/icons/camera.svg'
          alt='프로필 업로드'
          width={24}
          height={24}
          className='absolute bottom-0 right-0 cursor-pointer z-10 border border-light-gray bg-white rounded-full'
          onClick={handleImageClick}
        />
        <CustomInput
          type='file'
          className='hidden'
          accept='image/*'
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <div className='relative font-bold'>
        <CustomInput
          label='이름'
          labelHtmlFor='username'
          placeholder='이름을 입력해주세요'
          className='login-input relative'
          value={username || ''}
          onChange={e => setValue('username', e.target.value)}
        />
      </div>
    </section>
  );
};
