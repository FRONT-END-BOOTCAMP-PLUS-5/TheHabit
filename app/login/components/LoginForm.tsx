"use client";

import React, { useState } from "react";
import Input from "@/app/_components/inputs/Input";
import { Button } from "@/app/_components/buttons/Button";
import { LoginItem } from "@/public/consts/loginItem";
import { useForm, Controller } from "react-hook-form";
import "@ant-design/v5-patch-for-react-19";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SocialLogin } from "@/app/login/components/SocialLogin";

interface ILoginForm {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILoginForm>({
    mode: "onChange", // 실시간 validation
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 디버깅: 현재 에러 상태 확인
  console.log("🔍 폼 상태:", { errors, isValid });

  const onSubmit = async (data: ILoginForm) => {
    console.log("🚀 로그인 시도 시작");
    console.log("📧 입력된 이메일:", data.email);
    console.log("🔑 입력된 비밀번호:", data.password);

    setIsLoading(true);

    try {
      // 여기에 실제 로그인 API 호출 로직을 추가할 수 있습니다
      console.log("📡 로그인 API 호출 중...");

      // 임시로 1초 대기 (실제 API 호출 시에는 제거)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("✅ 로그인 성공!");
      console.log("🎯 메인 페이지로 이동 중...");

      // 로그인 성공 시 메인 페이지로 이동
      router.push("/");
    } catch (error) {
      console.error("❌ 로그인 실패:", error);
      console.log("🔄 로그인 페이지에 머무름");
    } finally {
      setIsLoading(false);
      console.log("🏁 로그인 프로세스 완료");
    }
  };

  const onError = (errors: any) => {
    console.log("❌ 폼 검증 실패");
    console.log("🔍 검증 오류 상세:", errors);
    console.log("📝 사용자에게 오류 메시지 표시");
  };

  return (
    <fieldset className="flex flex-col w-10/12 h-11/12">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-6 mb-8"
      >
        {LoginItem.map((item) => (
          <div key={item.id} className="flex flex-col">
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
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </form>
      <SocialLogin />
    </fieldset>
  );
};
