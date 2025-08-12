import { GetFeedBackUsecase } from "@/backend/feedbacks/applications/usecases/GetFeedBackUseacse";
import { PrFeedBackRepository } from "@/backend/feedbacks/infrastructures/repositories/PrFeedBackRepository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ id: number }> }
) => {
  const { id } = await context.params;

  try {
    const feedBackRepo = new PrFeedBackRepository();
    const feedBackUseCase = new GetFeedBackUsecase(feedBackRepo);
    const result = await feedBackUseCase.execute(Number(id));
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "다시 조회해주세요" }, { status: 400 });
  }
};
