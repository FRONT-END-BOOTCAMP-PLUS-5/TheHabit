export const Rex = {
  // 이메일 관련 정규표현식
  email: {
    standard: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/,
  },

  // 비밀번호 관련 정규표현식
  password: {
    standard: /^(?=.*[^a-zA-Z0-9])(?=.*[a-zA-Z])(?=.*\d).{8,15}$/,
  },

  // 사용자명 관련 정규표현식
  username: {
    korean: /^[가-힣a-zA-Z]{2,20}$/,
  },

  // 닉네임 관련 정규표현식
  nickname: {
    standard: /^[가-힣a-zA-Z0-9]{2,20}$/,
  },
} as const;
