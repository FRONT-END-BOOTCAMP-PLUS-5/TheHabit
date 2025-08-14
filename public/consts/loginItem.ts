import { Rex } from "@/public/consts/Rex";

interface ILoginItem {
  id: number;
  label: string;
  name: "email" | "password";
  type: "text" | "password";
  placeholder: string;
  required: boolean;
  regEx: RegExp;
  errorMessage: string;
}

export const LoginItem: ILoginItem[] = [
  {
    id: 1,
    label: "아이디",
    name: "email",
    type: "text",
    placeholder: "이메일",
    required: true,
    regEx: Rex.email.standard,
    errorMessage: "올바른 이메일 형식을 입력하세요",
  },
  {
    id: 2,
    label: "비밀번호",
    name: "password",
    type: "password",
    placeholder: "비밀번호",
    required: true,
    regEx: Rex.password.standard,
    errorMessage: "8-15자의 영문 대소문자, 숫자, 특수문자를 포함하세요",
  },
];
