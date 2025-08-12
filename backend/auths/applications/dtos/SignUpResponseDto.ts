export interface SignUpResponseDto {
  readonly success: boolean; // 회원가입 성공 여부
  readonly message?: string; // 회원가입 성공/실패 메시지
  readonly user?: {
    readonly id: string; // 사용자 고유 ID
    readonly email: string; // 사용자 이메일
    readonly username: string; // 사용자명
    readonly nickname: string; // 닉네임
    readonly profileImg?: string | null; // 프로필 이미지 URL (선택)
  };
}