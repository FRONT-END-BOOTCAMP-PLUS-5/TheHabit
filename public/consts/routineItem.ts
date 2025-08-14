// 이모지 매핑 상수
export const EMOJI_MAP: { [key: number]: string } = {
  1: '🏃',
  2: '💧',
  3: '📚',
  4: '🧘',
  5: '🏋️',
  6: '🥗',
  7: '😴',
  8: '🎵',
  9: '✍️',
  10: '🌱',
  11: '💪',
  12: '🍖',
  13: '😊',
  14: '📱',
  15: '🎮',
  16: '🏀',
  17: '🍕',
  18: '😴',
  19: '🧠',
  20: '❤️',
};

// UI 메시지 상수
export const UI_MESSAGES = {
  LOADING: '루틴 목록을 불러오는 중...',
  ERROR: {
    LOAD_ROUTINES: '루틴 목록을 불러오는데 실패했습니다.',
    COMPLETE_ROUTINE: '루틴 완료 처리에 실패했습니다.',
    UNKNOWN: '알 수 없는 오류',
  },
  SUCCESS: {
    ROUTINE_COMPLETED: '✅ 완료됨',
    PHOTO_VERIFIED: '📸 인증완료',
  },
  PLACEHOLDER: {
    REVIEW: '예: 오늘도 열심히 했다! 내일도 화이팅!',
  },
  MODAL: {
    REVIEW_TITLE: '루틴 완료 소감',
    REVIEW_DESCRIPTION: '오늘의 소감을 간단히 남겨주세요.',
    PHOTO_UPLOAD_PREPARING: '인증샷 업로드 기능은 준비 중입니다.',
  },
} as const;

// 폼 제한 상수
export const FORM_LIMITS = {
  REVIEW_MAX_LENGTH: 100,
} as const;

// 이모지 유틸리티 함수들
export const getEmojiByNumber = (
  emojiNumber: number,
  defaultEmoji: string = '🌱',
): string => {
  return EMOJI_MAP[emojiNumber] || defaultEmoji;
};

export const getAllEmojis = (): string[] => {
  return Object.values(EMOJI_MAP);
};

export const getEmojiNumbers = (): number[] => {
  return Object.keys(EMOJI_MAP).map(Number);
};
