import { GPTRequestDto } from '@/backend/gpt/applications/dtos/GPTRequestDto';
import { AddGPTResponseUsecase } from '@/backend/gpt/applications/usecases/AddGPTResponseUsecase';
import { GPTRepository } from '@/backend/gpt/infrastructures/repositories/GPTRepository';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { NextRequest, NextResponse } from 'next/server';

interface GPTRequestBody {
  gptResponseContent: string;
}

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body: GPTRequestBody = await request.json();

    if (!body || !body.gptResponseContent || typeof body.gptResponseContent !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'gptRequestContent 필드가 필요합니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const gptRepository = new GPTRepository();
    const addGPTResponseUsecase = new AddGPTResponseUsecase(gptRepository);

    const result = await addGPTResponseUsecase.execute({
      gptResponseContent: body.gptResponseContent,
    });

    const successResponse: ApiResponse<GPTRequestDto> = {
      success: true,
      data: {
        gptResponseContent: result.gptResponseContent,
      },
      message: 'gptResponseContent 저장에 성공했습니다.',
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
        message: 'gptResponseContent 저장에 실패했습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};
