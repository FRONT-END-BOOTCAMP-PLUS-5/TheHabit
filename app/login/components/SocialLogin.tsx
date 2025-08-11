import Image from "next/image";
import React from "react";

export const SocialLogin = () => {
  return (
    <div className="flex flex-col w-full gap-3">
      <h3 className="text-xl text-center">SNS 계정으로 로그인하기</h3>
      <div className="flex flex-row gap-10 justify-center">
        <Image
          src="/icons/google.svg"
          alt="google 로그인"
          width={60}
          height={60}
          className="cursor-pointer hover:scale-110 transition-all duration-300"
        />
        <Image
          src="/icons/kakao.svg"
          alt="kakao 로그인"
          width={60}
          height={60}
          className="cursor-pointer hover:scale-110 transition-all duration-300"
        />
      </div>
    </div>
  );
};
