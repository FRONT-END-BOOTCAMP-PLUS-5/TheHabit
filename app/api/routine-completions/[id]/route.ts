import { NextRequest } from "next/server";
import { PrRoutineCompletionsRepository } from "../../../../backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository";
import { 
  createErrorResponse, 
  createSuccessResponse
} from "../../../../libs/utils/apiUtils";

const routineCompletionsRepository = new PrRoutineCompletionsRepository();

// 루틴 완료 수정 (PATCH)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { photoUrl, review } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "완료 ID는 필수입니다." },
        { status: 400 }
      );
    }

    // TODO: 실제 데이터베이스에서 루틴 완료 수정
    // 현재는 임시 응답
    const updatedCompletion = {
      id: parseInt(id),
      photoUrl,
      review,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedCompletion,
    });

  } catch (error) {
    console.error("루틴 완료 수정 오류:", error);
    return NextResponse.json(
      { error: "루틴 완료 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

// 루틴 완료 삭제 (DELETE)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return createErrorResponse("유효하지 않은 완료 ID입니다.", 400);
    }

    const completionId = parseInt(id);
    const success = await routineCompletionsRepository.delete(completionId);
    
    if (!success) {
      return createErrorResponse("루틴 완료를 찾을 수 없습니다.", 404);
    }

    return createSuccessResponse({ message: "루틴 완료가 삭제되었습니다." });

  } catch (error) {
    console.error("루틴 완료 삭제 오류:", error);
    return createErrorResponse("루틴 완료 삭제에 실패했습니다.");
  }
}