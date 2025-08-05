"use client";

import { useForm } from "react-hook-form";
import ProfileSection from "./ProfileSection";
import AccountSection from "./AccountSection";
import AgreementSection from "./AgreementSection";

interface signUpFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  nickName: string;
  profileImg: string;
  CheckBoxAll: boolean; // 전체 동의
  CheckBoxRequired1: boolean; // 필수 1
  CheckBoxRequired2: boolean; // 필수 2
  CheckBoxOptional: boolean; // 선택
}

export default function SignUpFormClient() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<signUpFormData>({ mode: "onChange" });

  // 콘솔 로그 데이터 확인
  const onSubmit = (data: signUpFormData) => {
    console.log("폼 제출 데이터:", data);
  };

  // 닉네임 중복확인 (임시)  
  const handleCheckNickname = () => {
    alert("닉네임 중복 확인 기능은 아직 구현되지 않았습니다.");
  };

  // 전체 동의 처리
  const handleCheckBoxAll = (checked: boolean) => {
    const checkBoxFields: (keyof signUpFormData)[] = [
      "CheckBoxAll",
      "CheckBoxRequired1",
      "CheckBoxRequired2",
      "CheckBoxOptional",
    ];
    checkBoxFields.forEach((field) => setValue(field, checked));
  };

  // 정규 표현식(이메일, 비밀번호)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*_-]).{8,}$/;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-8"
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        회원 가입
      </h1>
      
      <div className="w-full max-w-md">
        {/* 프로필 섹션 */}
        <ProfileSection
          nickNameRegister={register("nickName", {
            required: "닉네임은 필수입니다.",
            minLength: {
              value: 2,
              message: "닉네임은 2자 이상이어야 합니다.",
            },
            maxLength: {
              value: 10,
              message: "닉네임은 10자 이하여야 합니다.",
            },
            pattern: {
              value: /^[가-힣a-zA-Z0-9]+$/,
              message: "닉네임은 한글, 영문, 숫자만 가능합니다.",
            },
            // 중복 확인은 보통 서버에 요청해야 하므로 예시로 async validate 사용
            validate: async (value) => {
              // 실제로는 API 호출 필요
              // 예시: 이미 사용 중인 닉네임 배열
              const usedNicknames = ["홍길동", "테스트"];
              if (usedNicknames.includes(value)) {
                return "이미 사용 중인 닉네임입니다.";
              }
              return true;
            },
          })}
          nickNameError={errors.nickName}
          onCheckNickname={handleCheckNickname}
        />

        {/* 계정 정보 섹션 */}
        <AccountSection
          emailRegister={register("email", {
            required: "이메일은 필수입니다.",
            pattern: {
              value: emailRegex,
              message: "이메일 형식이 올바르지 않습니다.",
            },
          })}
          emailError={errors.email}
          passwordRegister={register("password", {
            required: "비밀번호는 필수입니다.",
            minLength: {
              value: 8,
              message: "비밀번호는 8자 이상이어야 합니다.",
            },
            pattern: {
              value: passwordRegex,
              message: "비밀번호는 문자,숫자,특수문자를 포함해야 합니다.",
            },
          })}
          passwordError={errors.password}
          passwordConfirmRegister={register("passwordConfirm", {
            required: "비밀번호 확인은 필수입니다.",
            validate: (value) =>
              value === watch("password") ||
              "비밀번호가 일치하지 않습니다.",
          })}
          passwordConfirmError={errors.passwordConfirm}
        />
      </div>

      {/* 동의 항목 섹션 */}
      <AgreementSection
        control={control}
        handleCheckBoxAll={handleCheckBoxAll}
      />

      <button
        type="submit"
        className="w-full bg-green-400 text-white p-2 rounded hover:bg-green-600"
      >
        가입하기
      </button>
    </form>
  );
} 