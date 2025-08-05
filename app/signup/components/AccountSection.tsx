"use client";

import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import Input from "../../_components/Input/Input";
import Password from "../../_components/Input/Password";

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
    <>
      {/* 아이디 */}
      <div className="mb-4">
        <Input
          label="아이디"
          labelHtmlFor="email"
          placeholder="ex) example@email.com"
          {...emailRegister}
        />
        {emailError && (
          <p className="text-red-500 text-xs mt-1">{emailError.message}</p>
        )}
      </div>
      {/* 패스워드 */}
      <div className="mb-4">
        <Password
          label="비밀번호"
          labelHtmlFor="password"
          placeholder="8자리 이상 대소문자 영어, 숫자, 특수문자 포함"
          {...passwordRegister}
        />
        {passwordError && (
          <p className="text-red-500 text-xs mt-1">{passwordError.message}</p>
        )}
      </div>
      {/* 패스워드 확인*/}
      <div className="mb-4">
        <Password
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
      </div>
    </>
  );
}
