"use client";

import { ProfileSection } from "@/app/signup/components/ProfileSection";
import { SignupItem } from "@/public/consts/signupItem";
import Input from "@/app/_components/Input/Input";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@/app/_components/Button/Button";
import "@ant-design/v5-patch-for-react-19";
import { CheckBox } from "@/app/signup/components/CheckBox";

interface ISignupForm {
  email: string;
  password: string;
  passwordConfirm: string;
  nickName: string;
  profileImage: string | null;
}

export const SignUpForm = () => {
  const methods = useForm<ISignupForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      nickName: "",
      profileImage: null,
    },
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = methods;

  const onSubmit = (data: ISignupForm) => {
    console.log(data);
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
        <Button className="login-button" htmlType="submit">
          회원가입
        </Button>
      </form>
    </FormProvider>
  );
};
