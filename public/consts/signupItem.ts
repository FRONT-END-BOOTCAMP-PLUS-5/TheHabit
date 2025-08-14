import { UseFormGetValues } from "react-hook-form";
import { Rex } from "@/public/consts/Rex";

interface ISignupForm {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  profileImage: string | null;
}

interface ISignupItem {
  id: number;
  label: string;
  name: "username" | "email" | "password" | "passwordConfirm";
  type: "text" | "email" | "password";
  placeholder: string;
  required: boolean;
  regEx: RegExp;
  errorMessage: string;
  validate?: (
    value: string,
    getValues: UseFormGetValues<ISignupForm>
  ) => string | undefined;
}

export const SignupItem: ISignupItem[] = [
  {
    id: 1,
    label: "이름",
    name: "username",
    type: "text",
    placeholder: "이름",
    required: true,
    regEx: Rex.username.korean,
    errorMessage: "이름을 입력해주세요",
  },
  {
    id: 2,
    label: "이메일",
    name: "email",
    type: "email",
    placeholder: "이메일",
    required: true,
    regEx: Rex.email.standard,
    errorMessage: "올바른 이메일 형식을 입력하세요",
  },
  {
    id: 3,
    label: "비밀번호",
    name: "password",
    type: "password",
    placeholder: "비밀번호",
    required: true,
    regEx: Rex.password.standard,
    errorMessage: "8-15자의 영문 대소문자, 숫자, 특수문자를 포함하세요",
  },
  {
    id: 4,
    label: "비밀번호 확인",
    name: "passwordConfirm",
    type: "password",
    placeholder: "비밀번호 확인",
    required: true,
    regEx: Rex.password.standard,
    errorMessage: "비밀번호를 확인해주세요",
    validate: (value: string, getValues: UseFormGetValues<ISignupForm>) => {
      if (value !== getValues("password")) {
        return "비밀번호가 일치하지 않습니다";
      }
    },
  },
];
