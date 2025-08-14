"use client";

import { ProfileSection } from "@/app/signup/components/ProfileSection";
import { SignupItem } from "@/public/consts/signupItem";
import Input from "@/app/_components/inputs/Input";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@/app/_components/buttons/Button";
import "@ant-design/v5-patch-for-react-19";
import { CheckBox } from "@/app/signup/components/CheckBox";
import { useSignUp } from "@/libs/hooks/signup/useSignUp";

interface ISignupForm {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  profileImage: string | null;
}

export const SignUpForm = () => {
  const methods = useForm<ISignupForm>({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      nickname: "",
      profileImage: null,
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
      await signUp(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-10 absolute top-1/6 left-1/2 -translate-x-1/2 w-11/12"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ProfileSection />
        {SignupItem.map((item) => (
          <div key={item.id} className="flex flex-col h-30 relative">
            <Controller
              control={control}
              name={item.name}
              rules={{
                required: item.required ? `${item.label}을 입력하세요` : false,
                pattern: {
                  value: item.regEx,
                  message: item.errorMessage,
                },
                validate: (value) => {
                  if (item.validate) {
                    return item.validate(value, getValues);
                  }
                },
              }}
              render={({ field }) => (
                <Input
                  type={item.type}
                  {...field}
                  placeholder={item.placeholder}
                  label={item.label}
                  labelHtmlFor={item.name}
                  className="w-full h-16 login-input"
                  labelStyle="text-base font-bold"
                />
              )}
            />
            {errors[item.name] && (
              <p className="text-red-500 text-xs">
                {errors[item.name]?.message}
              </p>
            )}
          </div>
        ))}
        <CheckBox />
        <Button
          className="login-button"
          htmlType="submit"
          disabled={loading}
        >
          {loading ? "회원가입 중..." : "회원가입"}
        </Button>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </form>
    </FormProvider>
  );
};
