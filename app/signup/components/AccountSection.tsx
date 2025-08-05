"use client";

import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import Input from "../../_components/Input/Input";

interface AccountSectionProps {
  emailRegister: UseFormRegisterReturn;
  emailError?: FieldError;
  passwordRegister: UseFormRegisterReturn;
  passwordError?: FieldError;
  passwordConfirmRegister: UseFormRegisterReturn;
  passwordConfirmError?: FieldError;
}

export default function AccountSection({
  emailRegister,
  emailError,
  passwordRegister,
  passwordError,
  passwordConfirmRegister,
  passwordConfirmError,
}: AccountSectionProps) {
  return (
    <section>
      {/* 아이디 */}
      <fieldset className="mb-4">
        <legend className="sr-only">아이디 입력</legend>
        <Input
          type="email"
          label="아이디"
          labelHtmlFor="email"
          placeholder="ex) example@email.com"
          {...emailRegister}
        />
        {emailError && (
          <p className="text-red-500 text-xs mt-1">{emailError.message}</p>
        )}
      </fieldset>
      {/* 패스워드 */}
      <fieldset className="mb-4">
        <legend className="sr-only">비밀번호 입력</legend>
        <Input
          type="password"
          label="비밀번호"
          labelHtmlFor="password"
          placeholder="8자리 이상 대소문자 영어, 숫자, 특수문자 포함"
          {...passwordRegister}
        />
        {passwordError && (
          <p className="text-red-500 text-xs mt-1">{passwordError.message}</p>
        )}
      </fieldset>
      {/* 패스워드 확인*/}
      <fieldset className="mb-4">
        <legend className="sr-only">비밀번호 확인 입력</legend>
        <Input
          type="password"
          label="비밀번호 확인"
          labelHtmlFor="passwordConfirm"
          placeholder="비밀번호를 다시 입력하세요"
          {...passwordConfirmRegister}
        />
        {passwordConfirmError && (
          <p className="text-red-500 text-xs mt-1">
            {passwordConfirmError.message}
          </p>
        )}
      </fieldset>
    </section>
  );
}
