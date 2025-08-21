'use client';

import { ProfileSection } from '@/app/signup/components/ProfileSection';
import { SignupItem } from '@/public/consts/signupItem';
import CustomInput from '@/app/_components/inputs/CustomInput';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/app/_components/buttons/Button';
import '@ant-design/v5-patch-for-react-19';
import { CheckBox } from '@/app/signup/components/CheckBox';
import { useSignUp } from '@/libs/hooks/signup/useSignUp';
import { useState } from 'react';
import Image from 'next/image';
import eyeIcon from '@/public/icons/eye.svg';
import eyeOffIcon from '@/public/icons/eye_off.svg';

interface ISignupForm {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  profileImage: string | null;
  profileImagePath: string | null;
  profileFile: File | null;
}

export const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  const methods = useForm<ISignupForm>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      profileImage: null,
      profileImagePath: null,
      profileFile: null,
    },
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = methods;

  const { signUp, loading, error } = useSignUp();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const onSubmit = async (data: ISignupForm) => {
    try {
      // FormData로 데이터 전송
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('username', data.username);
      formData.append('nickname', data.nickname);
      
      if (data.profileFile) {
        formData.append('profileImage', data.profileFile);
      }

      await signUp(formData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-10 absolute top-1/6 left-1/2 -translate-x-1/2 w-11/12'
        onSubmit={handleSubmit(onSubmit)}
      >
        <ProfileSection />
        {SignupItem.map(item => (
          <div key={item.id} className='flex flex-col h-30 relative'>
            <Controller
              control={control}
              name={item.name}
              rules={{
                required: item.required ? `${item.label}을 입력하세요` : false,
                pattern: {
                  value: item.regEx,
                  message: item.errorMessage,
                },
                validate: value => {
                  if (item.validate) {
                    return item.validate(value, getValues);
                  }
                },
              }}
              render={({ field }) => {
                // 비밀번호 필드인 경우 눈 아이콘과 함께 렌더링
                if (item.name === 'password') {
                  return (
                    <div className='flex flex-col gap-2'>
                      {item.label && (
                        <label className='w-full p-1 text-secondary'>
                          {item.label}
                        </label>
                      )}
                      <div className='relative'>
                        <input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder={item.placeholder}
                          className='w-full h-16 login-input pr-12 px-3 py-2 text-secondary placeholder:text-secondary-grey border-2 border-primary-grey rounded-md focus:border-primary focus:outline-none'
                        />
                        <button
                          type='button'
                          onClick={togglePasswordVisibility}
                          className='absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-grey hover:text-secondary cursor-pointer'
                          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                        >
                          {showPassword ? (
                            <Image
                              src={eyeOffIcon}
                              alt='비밀번호 숨기기'
                              width='20'
                              height='20'
                              className='text-secondary-grey'
                            />
                          ) : (
                            <Image
                              src={eyeIcon}
                              alt='비밀번호 보기'
                              width='20'
                              height='20'
                              className='text-secondary-grey'
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                }

                // 비밀번호 확인 필드인 경우 눈 아이콘과 함께 렌더링
                if (item.name === 'passwordConfirm') {
                  return (
                    <div className='flex flex-col gap-2'>
                      {item.label && (
                        <label className='w-full p-1 text-secondary'>
                          {item.label}
                        </label>
                      )}
                      <div className='relative'>
                        <input
                          {...field}
                          type={showPasswordConfirm ? 'text' : 'password'}
                          placeholder={item.placeholder}
                          className='w-full h-16 login-input pr-12 px-3 py-2 text-secondary placeholder:text-secondary-grey border-2 border-primary-grey rounded-md focus:border-primary focus:outline-none'
                        />
                        <button
                          type='button'
                          onClick={togglePasswordConfirmVisibility}
                          className='absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-grey hover:text-secondary cursor-pointer'
                          aria-label={showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
                        >
                          {showPasswordConfirm ? (
                            <Image
                              src={eyeOffIcon}
                              alt='비밀번호 숨기기'
                              width='20'
                              height='20'
                              className='text-secondary-grey'
                            />
                          ) : (
                            <Image
                              src={eyeIcon}
                              alt='비밀번호 보기'
                              width='20'
                              height='20'
                              className='text-secondary-grey'
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                }

                // 일반 필드는 CustomInput 사용
                return (
                  <CustomInput
                    type={item.type}
                    {...field}
                    placeholder={item.placeholder}
                    label={item.label}
                    labelHtmlFor={item.name}
                    className='w-full h-16 login-input'
                    labelStyle='text-base font-bold'
                  />
                );
              }}
            />
            {errors[item.name] && (
              <p className='text-red-500 text-xs'>{errors[item.name]?.message}</p>
            )}
          </div>
        ))}
        <CheckBox />
        <Button className='login-button' htmlType='submit' disabled={loading}>
          {loading ? '회원가입 중...' : '회원가입'}
        </Button>
        {error && <p className='text-red-500 text-xs'>{error}</p>}
      </form>
    </FormProvider>
  );
};