"use client";
import { useForm } from "react-hook-form";
import Input from "../_components/Input/Input";
import Password from "../_components/Input/Password";
import Agree from "../signup/components/Agree";

interface signUpFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  nickName: string;
  profileImg: string;
  agreeAll: boolean; // 전체 동의
  agreeRequired1: boolean; // 필수 1
  agreeRequired2: boolean; // 필수 2
  agreeOptional: boolean; // 선택
}

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<signUpFormData>();

  // 콘솔 로그 데이터 확인
  const onSubmit = (data: signUpFormData) => {
    console.log("폼 제출 데이터:", data);
    };

  // 닉네임 중복확인 (임시)  
  const handleCheckNickname = () => {
    alert("닉네임 중복 확인 기능은 아직 구현되지 않았습니다.");
    };

  // 전체 동의 처리
  const handleAgreeAll = (checked: boolean) => {
    setValue("agreeAll", checked);
    setValue("agreeRequired1", checked);
    setValue("agreeRequired2", checked);
    setValue("agreeOptional", checked);
  };

  // 정규 표현식
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*_-]).{8,}$/;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto mt-8"
        >
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            회원 가입
          </h1>
          <div className="w-full max-w-md">
            <div className="flex items-center mb-6">
              {/* avatar 프로필 들어갈 공간 */}
              <div className="w-24 h-24 flex-shrink-0 rounded-full bg-amber-200 text-gray-900 flex items-center justify-center text-xs">
                프로필 공간
                <br /> avatar 컴포넌트
                <br /> 추가하겠습니다.
              </div>
              {/* 닉네임 영역 */}
              <div className="flex flex-col ml-8 flex-1">
                <label
                  className="text-gray-700 text-sm font-bold mb-2"
                  htmlFor="nickName"
                >
                  닉네임
                </label>
                <div className="flex items-center">
                  <Input
                    placeholder="ex) 홍길동"
                    maxLength={10} // 글자수 제한 (예: 10자)
                    {...register("nickName", {
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
                  />
                  {/* 닉네임 중복 확인*/}
                  <button
                    type="button"
                    className="w-24 h-8 ml-2 px-3 py-1 text-xs  bg-blue-500 text-white rounded"
                    onClick={handleCheckNickname}
                  >
                    중복 확인
                  </button>
                </div>
                {errors.nickName && (
                  <p className="text-red-500 mt-1">{errors.nickName.message}</p>
                )}
              </div>
            </div>

            {/* 아이디 */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                아이디
              </label>
              <Input
                placeholder="ex) example@email.com"
                {...register("email", {
                  required: "이메일은 필수입니다.",
                  pattern: {
                    value: emailRegex,
                    message: "이메일 형식이 올바르지 않습니다.",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* 패스워드 */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                비밀번호
              </label>
              <Password
                placeholder="8자리 이상 대소문자 영어, 숫자, 특수문자 포함"
                {...register("password", {
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
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* 패스워드 확인*/}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                비밀번호 확인
              </label>
              <Password
                placeholder="비밀번호를 다시 입력하세요"
                {...register("passwordConfirm", {
                  required: "비밀번호 확인은 필수입니다.",
                  validate: (value) =>
                    value === watch("password") ||
                    "비밀번호가 일치하지 않습니다.",
                })}
              />
              {errors.passwordConfirm && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>
          </div>

          <Agree
            label="전체 약관 동의"
            name="agreeAll"
            control={control}
            onChange={handleAgreeAll}
          />
          <hr />
          <Agree
            label="[필수] 개인 정보 처리에 동의"
            name="agreeRequired1"
            control={control}
            required={true}
          />
          <Agree
            label="[필수] 약관 처리에 동의 해주세요"
            name="agreeRequired2"
            control={control}
            required={true}
          />
          <Agree
            label="(선택) 개인 정보 보호를 위한 이용자 동의"
            name="agreeOptional"
            control={control}
          />

          <button
            type="submit"
            className="w-full bg-green-400 text-white p-2 rounded hover:bg-green-600"
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}
