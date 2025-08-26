'use client';

import { ProfileSection } from '@/app/signup/components/ProfileSection';
import { SignupItem } from '@/public/consts/signupItem';
import CustomInput from '@/app/_components/inputs/CustomInput';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/app/_components/buttons/Button';
import { useSignUp } from '@/libs/hooks/signup/useSignUp';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
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
      // 회원가입 성공 후 로그인 페이지로 이동
      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className='flex flex-col gap-4 w-11/12 mx-auto pt-10' onSubmit={handleSubmit(onSubmit)}>
        <ProfileSection />
        {SignupItem.map(item => (
          <div key={item.id} className='flex flex-col h-30 relative font-bold'>
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
                return (
                  <CustomInput
                    type={item.type}
                    {...field}
                    placeholder={item.placeholder}
                    label={item.label}
                    labelHtmlFor={item.name}
                    className='w-full h-16 login-input'
                  />
                );
              }}
            />
            {errors[item.name] && (
              <p className='text-xs text-red-500'>{errors[item.name]?.message}</p>
            )}
          </div>
        ))}
        <Button className='signup-button h-11 mt-4 mb-20' buttonType='primary' disabled={loading}>
          {loading ? '회원가입 중...' : '회원가입'}
        </Button>
        {error && <p className='text-xs text-red-500'>{error}</p>}
      </form>
    </FormProvider>
  );
};
