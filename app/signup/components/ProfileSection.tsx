"use client";

import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import Input from "../../_components/Input/Input";
import Button from "../../_components/Button/Button";

interface ProfileSectionProps {
  nickNameRegister: UseFormRegisterReturn;
  nickNameError?: FieldError;
  onCheckNickname: () => void;
}

export default function ProfileSection({
  nickNameRegister,
  nickNameError,
  onCheckNickname,
}: ProfileSectionProps) {
  return (
    <section className="flex items-center mb-6">
      {/* avatar 프로필 들어갈 공간 */}
      <figure className="w-24 h-24 flex-shrink-0 rounded-full bg-amber-200 text-gray-900 flex items-center justify-center text-xs">
        <figcaption className="text-center">
          프로필 공간
          <br /> avatar 컴포넌트
          <br /> 추가하겠습니다.
        </figcaption>
      </figure>
      {/* 닉네임 영역 */}
      <article className="flex flex-col ml-8 flex-1">
        <header className="flex items-center justify-center">
          <Input
            label="닉네임"
            labelHtmlFor="nickName"
            placeholder="ex) 홍길동"
            maxLength={10}
            {...nickNameRegister}
          />
        {/* 닉네임 중복 확인*/}
          <Button type="primary" color="blue" onClick={onCheckNickname}>
            중복 확인
          </Button>
        </header>
        {nickNameError && (
          <p className="text-red-500 text-xs mt-1">{nickNameError.message}</p>
        )}
      </article>
    </section>
  );
}
