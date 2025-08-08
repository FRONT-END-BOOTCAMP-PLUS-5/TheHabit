import { NextRequest, NextResponse } from "next/server";

// 루틴 완료 생성 (POST)
export async function POST(req: NextRequest) {
  try {
    const { routineId, review, photoUrl } = await req.json();

    if (!routineId) {
      return NextResponse.json(
        { error: "routineId는 필수입니다." },
        { status: 400 }
      );
    }

    // TODO: 실제 데이터베이스 연동 구현
    // 현재는 임시 응답
    const newCompletion = {
      id: Date.now(),
      routineId,
      userId: "temp-user-id", // 실제로는 인증된 사용자 ID 사용
      review,
      photoUrl,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newCompletion,
    });

  } catch (error) {
    console.error("루틴 완료 생성 오류:", error);
    return NextResponse.json(
      { error: "루틴 완료 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}

// 루틴 완료 목록 조회 (GET)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get("challengeId");

    if (!challengeId) {
      return NextResponse.json(
        { error: "challengeId는 필수입니다." },
        { status: 400 }
      );
    }

    // TODO: 실제 데이터베이스에서 루틴 완료 목록 조회
    // 현재는 임시 응답
    const completions = [
      // 임시 데이터 - 실제 구현에서는 데이터베이스에서 조회
    ];

    return NextResponse.json({
      success: true,
      data: completions,
    });

  } catch (error) {
    console.error("루틴 완료 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "루틴 완료 목록 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}