import { NextResponse } from "next/server";

// 예시: 실제로는 DB 연결 및 유저 생성 로직이 필요합니다.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username, nickname } = body;

    // 필수값 체크
    if (!email || !password || !username || !nickname) {
      return NextResponse.json(
        {
          success: false,
          message: "필수 입력 사항이 입력되지 않았습니다.",
        },
        { status: 400 }
      );
    }

    // 이메일 형식 검증 (간단 예시)
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegEx.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "이메일 형식이 올바르지 않습니다.",
        },
        { status: 400 }
      );
    }

    // TODO: DB에서 이메일 중복 체크 및 비밀번호 해싱, 유저 생성
    // 예시 응답 (실제 DB 연동 필요)
    const newUser = {
      id: "생성된_유저_ID",
      email,
      username,
      nickname,
      profileImg: null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "회원가입이 성공적으로 완료되었습니다.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "회원가입 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
