"use client";

import React from "react";
import Input from "@/app/_components/Input/Input";
import { Button } from "@/app/_components/Button/Button";
import { LoginItem } from "@/public/consts/loginItem";
import { useForm, Controller } from "react-hook-form";
import "@ant-design/v5-patch-for-react-19";
import Link from "next/link";
import { SocialLogin } from "./SocialLogin";

interface ILoginForm {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({
    mode: "onChange", // 실시간 validation
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 디버깅: 현재 에러 상태 확인

  const onSubmit = (data: ILoginForm) => {
    console.log("✅ 폼 제출 성공:", data);
  };

  const onError = (errors: any) => {
    console.log("❌ 폼 검증 실패:", errors);
  };

  return (
    <fieldset className="flex flex-col w-10/12 h-11/12 relative">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-10 h-11/12 absolute w-full top-1/16"
      >
        {LoginItem.map((item) => (
          <div key={item.id} className="flex flex-col h-1/9">
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
              render={({ field }) => (
                <Input
                  {...field}
                  type={item.type}
                  placeholder={item.placeholder}
                  label={item.label}
                  className="w-full h-16 login-input"
                  labelStyle="text-base font-bold"
                />
              )}
            />
            {errors[item.name] && (
              <p className="text-red-500 text-sm">
                {errors[item.name]?.message}
              </p>
            )}
          </div>
        ))}
        <Link className="text-md text-right" href="/">
          비밀번호 찾기
        </Link>
        <Button htmlType="submit" className="login-button">
          로그인
        </Button>
      </form>
      <SocialLogin />
    </fieldset>
  );
};
