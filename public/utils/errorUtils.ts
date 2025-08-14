// 에러 처리 유틸리티

export const showError = (message: string, error?: unknown) => {
  console.error(message, error);
  alert(message);
};

export const showSuccess = (message: string) => {
  alert(message);
};

export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  errorMessage: string
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    showError(errorMessage, error);
    return null;
  }
};

// 파일 업로드 관련 에러 메시지
export const FILE_UPLOAD_ERRORS = {
  INVALID_TYPE: '지원되는 이미지 형식: JPEG, PNG, GIF, WebP',
  SIZE_EXCEEDED: '파일 크기는 5MB 이하만 업로드 가능합니다.',
  UPLOAD_FAILED: '파일 업로드에 실패했습니다. 다시 시도해주세요.',
  NO_FILE_SELECTED: '파일을 선택해주세요.',
} as const;

// 루틴 관련 에러 메시지
export const ROUTINE_ERRORS = {
  NO_ROUTINE_SELECTED: '루틴을 선택해주세요.',
  NO_REVIEW_TEXT: '소감을 입력해주세요.',
  SUBMIT_FAILED: '제출에 실패했습니다. 다시 시도해주세요.',
  COMPLETION_SUCCESS: '루틴 완료가 제출되었습니다!',
} as const;