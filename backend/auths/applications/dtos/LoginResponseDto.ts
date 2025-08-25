export interface LoginResponseDto {
    readonly id: string; // 사용자 고유 ID (NextAuth에서 필요)
    readonly email: string; // 사용자 이메일
    readonly username: string; // 사용자명
    readonly nickname: string; // 닉네임
    readonly profileImg?: string | null; // 프로필 이미지
    readonly profileImgPath?: string | null; // 프로필 이미지 제목 추가함
};
