import React from "react";

export default function LoginFormSkeleton() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <section className="w-full max-w-md">
        {/* 제목 스켈레톤 */}
        <header className="mb-8">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse mx-auto w-32"></div>
        </header>

        {/* 폼 컨테이너 스켈레톤 */}
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          {/* 이메일 입력 필드 스켈레톤 */}
          <div className="mb-4">
            {/* 라벨 스켈레톤 */}
            <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
            {/* 입력 필드 스켈레톤 */}
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* 비밀번호 입력 필드 스켈레톤 */}
          <div className="mb-6">
            {/* 라벨 스켈레톤 */}
            <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
            {/* 입력 필드 스켈레톤 */}
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* 로그인 버튼 스켈레톤 */}
          <div className="mb-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* SNS 로그인 텍스트 스켈레톤 */}
          <div className="flex justify-center mb-4">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>

          {/* SNS 로그인 버튼들 스켈레톤 */}
          <div className="flex justify-evenly mb-4">
            {/* 카카오 버튼 스켈레톤 */}
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            {/* 구글 버튼 스켈레톤 */}
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* 회원가입 링크 스켈레톤 */}
          <div className="flex justify-center">
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
        </div>
      </section>
    </main>
  );
} 