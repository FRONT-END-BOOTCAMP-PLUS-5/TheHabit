export interface LoginResponseDto {
    readonly id: string; // 사용자 고유 ID (NextAuth에서 필요)
    readonly email: string; // 사용자 이메일
    readonly nickname: string; // 사용자프로필 이미지 제목 추가함
};
