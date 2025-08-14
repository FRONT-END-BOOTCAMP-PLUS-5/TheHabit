export interface SignUpRequestDto {
  readonly email: string; // 사용자 이메일 (필수)
  readonly password: string; // 사용자 비밀번호 (필수)
  readonly username: string; // 사용자명 (필수)
  readonly nickname: string; // 닉네임 (필수)
  readonly profileImg?: string | null; // 프로필 이미지 URL (선택)
  readonly profileImgPath?: string | null; // 프로필 이미지 경로 (선택)
}
