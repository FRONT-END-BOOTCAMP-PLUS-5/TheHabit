export interface LoginResponseDto {
    readonly success: boolean; // 로그인 성공 여부
    readonly message?: string; // 로그인 실패 시 에러 메시지
    readonly user?: {
        readonly id: string; // 사용자 고유 ID (NextAuth에서 필요)
        readonly email: string; // 사용자 이메일
        readonly username: string; // 사용자명
        readonly nickname: string; // 닉네임
        readonly profileImg?: string | null; // 프로필 이미지
    };
}
