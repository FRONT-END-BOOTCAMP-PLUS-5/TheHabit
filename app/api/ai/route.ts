import { AddAiResponseUsecase } from '@/backend/ai/application/usecases/AddAiResponseUsecase';
import { AiRequestDto } from '@/backend/ai/application/dtos/AiRequestDto';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { NextRequest, NextResponse } from 'next/server';
import { AiRepository } from '@/backend/ai/infrastructure/repositories/AiRepository';
import { OpenAIProvider, GeminiProvider } from '@/app/user/feedback/_components/AiProvider';
import { AI_PROVIDER } from '@/public/consts/AiProvider';

interface AiRequestBody {
  aiResponseContent: string;
  provider?: string;
}

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body: AiRequestBody = await request.json();

    if (!body || !body.aiResponseContent || typeof body.aiResponseContent !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'aiResponseContent 필드가 필요합니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const providerName = body.provider ?? AI_PROVIDER.OPENAI; // 'openai' | 'gemini'
    const provider =
      providerName === AI_PROVIDER.GEMINI
        ? new GeminiProvider(process.env.GOOGLE_API_KEY)
        : new OpenAIProvider(process.env.OPEN_AI_KEY);
    const aiRepository = new AiRepository(provider);
    const addAiResponseUsecase = new AddAiResponseUsecase(aiRepository);

    const result = await addAiResponseUsecase.execute({
      aiResponseContent: body.aiResponseContent,
    });

    const successResponse: ApiResponse<AiRequestDto> = {
      success: true,
      data: {
        aiResponseContent: result.aiResponseContent,
      },
      message: 'aiResponseContent 저장에 성공했습니다.',
    };
    return NextResponse.json(successResponse);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(error.message, { status: 500 });
    }

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'aiResponseContent 저장에 실패했습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};
