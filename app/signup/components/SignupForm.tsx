'use client';

import { ProfileSection } from '@/app/signup/components/ProfileSection';
import { SignupItem } from '@/public/consts/signupItem';
import { CheckBoxItem } from '@/public/consts/checkBoxItem';
import CustomInput from '@/app/_components/inputs/CustomInput';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Button } from '@/app/_components/buttons/Button';
import { CheckBoxList } from '@/app/_components/checkboxes/Checkbox';
import { useSignUp } from '@/libs/hooks/signup/useSignUp';
import { useState } from 'react';

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
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
  
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

  const handleCheckboxChange = (checkedItems: { [key: number]: boolean }) => {
    setCheckedItems(checkedItems);
  };

  const isAllRequiredChecked = () => {
    const requiredItems = CheckBoxItem.filter(item => item.required);
    return requiredItems.every(item => checkedItems[item.id]);
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
    } catch (error) {
      console.error(error);
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
              <p className='text-xs text-red-500'>{errors[item.name]?.message}</p>
            )}
          </div>
        ))}
        <CheckBoxList onChange={handleCheckboxChange} />
        <Button className='login-button' htmlType='submit' disabled={loading || !isAllRequiredChecked()}>
          {loading ? '회원가입 중...' : '회원가입'}
        </Button>
        {error && <p className='text-xs text-red-500'>{error}</p>}
      </form>
    </FormProvider>
  );
};