export interface LoginRequestDto {
  readonly email: string; // 사용자 이메일
  readonly password: string; // 사용자 비밀번호
  // readonly rememberMe?: boolean; // 로그인 상태 유지 여부(추후 기능 추가용도)
}
