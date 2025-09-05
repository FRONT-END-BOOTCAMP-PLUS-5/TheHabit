'use client';

import React, { useState, useEffect } from 'react';
import CustomInput from '@/app/_components/inputs/CustomInput';
import { Button } from '@/app/_components/buttons/Button';
import { LoginItem } from '@/public/consts/loginItem';
import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SocialLogin } from '@/app/login/_components/SocialLogin';
import { signIn } from 'next-auth/react';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import { AxiosError } from 'axios';
import Toast from '@/app/_components/toasts/Toast';

interface ILoginForm {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const router = useRouter();
  const { userInfo, isLoading: isUserInfoLoading } = useGetUserInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 이미 로그인된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    const nickname = userInfo?.nickname;
    if (userInfo && !isUserInfoLoading) {
      router.push(`/user/dashboard/${nickname}`);
    }
  }, [userInfo, isUserInfoLoading, router]);

  const onSubmit = async (data: ILoginForm) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // 자동 리다이렉트 방지
      });
      console.log('result', result);
      if (result?.error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (result?.ok) {
        Toast.success('로그인 성공! 🎉');
        setTimeout(() => {
          router.push(`/user/dashboard/${userInfo?.nickname}`);
        }, 3000);
      } else {
        setError('로그인 처리 중 예상치 못한 오류가 발생했습니다.');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data.message);
      }
      setError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors: unknown) => {
    if (typeof errors === 'object' && errors instanceof Error) {
    } else {
    }
  };

  return (
    <fieldset className='flex flex-col w-10/12 h-11/12'>
      <form onSubmit={handleSubmit(onSubmit, onError)} className='flex flex-col gap-6 mb-8'>
        {LoginItem.map(item => {
          return (
            <div key={item.id} className='flex flex-col font-bold'>
              <Controller
                name={item.name}
                control={control}
                rules={{
                  required: item.required ? `${item.label}을 입력하세요` : false,
                  pattern: {
                    value: item.regEx,
                    message: item.errorMessage,
                  },
                }}
                render={({ field }) => {
                  return (
                    <CustomInput
                      {...field}
                      type={item.type}
                      placeholder={item.placeholder}
                      label={item.label}
                      className='w-full h-16 login-input'
                    />
                  );
                }}
              />
              {errors[item.name] && (
                <p className='text-red-500 text-sm'>{errors[item.name]?.message}</p>
              )}
            </div>
          );
        })}

        {/* 에러 메시지 표시 */}
        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}

        <Link className='text-md text-right' href='/'>
          비밀번호 찾기
        </Link>
        <Button buttonType='primary' className='login-button h-11' disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </form>
      <SocialLogin />
      <p className='text-md text-center gap-2 flex justify-center mt-6'>
        아직 회원이 아니신가요?
        <Link href='/signup' className='text-[#34A853] font-bold'>
          회원가입
        </Link>
      </p>
    </fieldset>
  );
};
