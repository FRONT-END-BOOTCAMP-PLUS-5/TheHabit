"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export const SignUpTitle = () => {
  const router = useRouter();

  return (
    <>
      <h1 className="text-4xl font-bold top-1/11 absolute left-1/2 -translate-x-1/2">
        회원가입
      </h1>
      <Image
        onClick={() => router.back()}
        src="/icons/back.svg"
        alt="뒤로가기"
        width={20}
        height={20}
        className="cursor-pointer absolute left-5 top-3"
      />
    </>
  );
};
