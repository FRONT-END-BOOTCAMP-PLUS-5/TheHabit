import { GetRoutineReviewListUsecase } from "@/backend/feedbacks/applications/usecases/GetRoutineReviewListUsecase";
import { PrFeedBackRepository } from "@/backend/feedbacks/infrastructures/repositories/PrFeedBackRepository";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  try {
    const feedbackRepo = new PrFeedBackRepository();
    const feedBackUseCase = new GetRoutineReviewListUsecase(feedbackRepo);
    const result = await feedBackUseCase.execute(body);

    if (!result) {
      return NextResponse.json(
        { error: "피드백 데이터 저장에 실패했습니다." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "피드백 데이터가 저장되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
