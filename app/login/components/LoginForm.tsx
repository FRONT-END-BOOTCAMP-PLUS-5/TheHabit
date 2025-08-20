'use client';

import React, { useState } from 'react';
import Input from '@/app/_components/inputs/Input';
import { Button } from '@/app/_components/buttons/Button';
import { LoginItem } from '@/public/consts/loginItem';
import { useForm, Controller } from 'react-hook-form';
import '@ant-design/v5-patch-for-react-19';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SocialLogin } from '@/app/login/components/SocialLogin';
import { signIn, useSession } from 'next-auth/react';

interface ILoginForm {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('🔍 LoginForm 렌더링 - 현재 세션:', session);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<ILoginForm>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 폼 값 실시간 감시
  const watchedValues = watch();
  console.log('👀 폼 값 실시간 감시:', watchedValues);
  console.log('❌ 폼 에러 상태:', errors);
  console.log('✅ 폼 유효성:', isValid);

  // 이미 로그인된 경우 메인 페이지로 리다이렉트
  React.useEffect(() => {
    console.log('🔄 useEffect 실행 - 세션 변경 감지:', session);
    if (session) {
      console.log('🚀 이미 로그인됨, 메인 페이지로 리다이렉트');
      router.push('/');
    }
  }, [session, router]);

  const onSubmit = async (data: ILoginForm) => {
    console.log('🚀 로그인 시도 시작');
    console.log('📝 폼 데이터:', data);
    console.log('🔍 폼 에러:', errors);
    console.log('✅ 폼 유효성:', isValid);
    setError(null);
    setIsLoading(true);

    try {
      console.log('📡 NextAuth signIn 호출 시작');
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // 자동 리다이렉트 방지
      });

      console.log('📊 NextAuth signIn 결과:', result);

      if (result?.error) {
        console.error('❌ 로그인 실패:', result.error);
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (result?.ok) {
        console.log('✅ 로그인 성공!');
        console.log('🎯 메인 페이지로 이동 중...');
        router.push('/');
      } else {
        console.log('⚠️ 예상치 못한 결과:', result);
        setError('로그인 처리 중 예상치 못한 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('❌ 로그인 중 오류 발생:', error);
      setError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      console.log('🏁 로그인 프로세스 완료');
    }
  };

  const onError = (errors: unknown) => {
    if (typeof errors === 'object' && errors instanceof Error) {
      console.log('Error 타입입니다:', errors.message);
    } else {
      console.log('Error 타입이 아닙니다:', errors);
    }
    console.log('❌ 폼 검증 실패');
    console.log('🔍 검증 오류 상세:', errors);
    console.log('📝 사용자에게 오류 메시지 표시');
  };

  console.log('🎨 LoginForm 렌더링 완료 - isLoading:', isLoading, 'error:', error);

  return (
    <fieldset className='flex flex-col w-10/12 h-11/12'>
      <form onSubmit={handleSubmit(onSubmit, onError)} className='flex flex-col gap-6 mb-8'>
        {LoginItem.map(item => {
          console.log(`🏷️ ${item.name} 필드 렌더링:`, item);
          return (
            <div key={item.id} className='flex flex-col'>
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
                render={({ field, fieldState }) => {
                  console.log(`🎯 ${item.name} 필드 상태:`, fieldState);
                  return (
                    <Input
                      {...field}
                      type={item.type}
                      placeholder={item.placeholder}
                      label={item.label}
                      className='w-full h-16 login-input'
                      labelStyle='text-base font-bold'
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
        <Button htmlType='submit' className='login-button' disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </form>
      <SocialLogin />
    </fieldset>
  );
};
