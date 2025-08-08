export interface LoginItemType {
  id: number;
  name: "email" | "password";
  type: "text" | "password";
  placeholder: string;
  label: string;
  labelHtmlFor: string;
  errorMessage: string;
  regEx: RegExp;
  requiredMessage: string;
}

export const LoginItem: LoginItemType[] = [
  {
    id: 1,
    name: "email",
    type: "text",
    placeholder: "이메일을 입력하세요",
    label: "이메일",
    labelHtmlFor: "email",
    errorMessage: "이메일을 입력하세요",
    regEx: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{5,15}$/,
    requiredMessage: "이메일을 입력하세요",
  },
  {
    id: 2,
    name: "password",
    type: "password",
    placeholder: "비밀번호를 입력하세요",
    label: "비밀번호",
    labelHtmlFor: "password",
    errorMessage: "비밀번호를 입력하세요",
    regEx: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
    requiredMessage: "비밀번호를 입력하세요",
  },
];
