"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Input from "../../_components/Input/Input";
import Notification from "./Notification";

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginFormClient() {
  // 로그인을 하기 위한 상태 관리
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ mode: "onChange" });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setSuccess("로그인에 성공했습니다!");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <section className="w-full max-w-md">
        <header>
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            로그인
          </h1>
        </header>

        {/* 성공 알림 */}
        {success && <Notification type="success" message={success} />}

        {/* 에러 알림 */}
        {error && <Notification type="error" message={error} />}
        
        {/* 아이디 & 비밀번호 입력 */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          {/* 아이디 */}
          <fieldset className="mb-4">
            <legend className="sr-only">아이디 입력</legend>
            <Input 
              type="text"
              label="이메일"
              labelHtmlFor="username"
              placeholder="아이디를 입력하세요"
              {...register("username", {
                required: "아이디를 입력하지 않았습니다.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "유효한 이메일 형식을 입력하세요.",
                },
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </fieldset>
          
          {/* 비밀번호 */}
          <fieldset className="mb-6">
            <legend className="sr-only">비밀번호 입력</legend>
            <Input 
              type="password"
              label="비밀번호"
              labelHtmlFor="password"
              placeholder="비밀번호를 입력하세요"
              {...register("password", {
                required: "비밀번호를 입력하지 않았습니다.",
                minLength: {
                  value: 6,
                  message: "비밀번호는 6자 이상이어야 합니다.",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </fieldset>
          
          {/* 로그인 버튼 */}
          <section className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  로그인 중...
                </div>
              ) : (
                "로그인"
              )}
            </button>
          </section>
          
          <section className="flex justify-center w-full text-sm text-black text-center mt-4">
            SNS 계정으로 로그인하기
          </section>
          
          {/* SNS 로그인 버튼 */}
          <section className="flex justify-evenly m-8">
            <button
              onClick={() => {
                signIn("kakao", {
                  callbackUrl: "/",
                  redirect: true,
                });
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-400 shadow transition-colors border border-gray-200 ml-2 hover:bg-amber-500"
              type="button"
            >
              <Image
                src="/kakaotalk.svg"
                alt="kakaotalk"
                width={20}
                height={20}
                className="rounded-full"
              />
            </button>
            <button
              onClick={() => {
                signIn("google", {
                  callbackUrl: "/",
                  redirect: true,
                });
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow transition-colors border border-gray-200 ml-2 hover:bg-gray-50"
              type="button"
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="rounded-full"
              />
            </button>
          </section>
          
          <footer className="flex justify-center w-full text-sm text-black text-center mt-4">
            아직 회원이 아니신가요?
            <Link href="/signup" className="text-blue-500 ml-3">
              회원가입
            </Link>
          </footer>
        </form>
      </section>
    </main>
  );
} 