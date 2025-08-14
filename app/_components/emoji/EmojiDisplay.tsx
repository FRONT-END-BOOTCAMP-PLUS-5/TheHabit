'use client';

import React from 'react';
import { EMOJI_MAP } from '@/public/consts/routineItem';

interface EmojiDisplayProps {
  emojiNumber: number;
  emojiMap?: { [key: number]: string }; // 선택적으로 커스텀 맵 사용 가능
  defaultEmoji?: string;
  className?: string;
}

export const EmojiDisplay: React.FC<EmojiDisplayProps> = ({
  emojiNumber,
  emojiMap = EMOJI_MAP, // 기본값으로 전역 이모지 맵 사용
  defaultEmoji = '🌱',
  className = '',
}) => {
  const emoji = emojiMap[emojiNumber] || defaultEmoji;

  return <span className={className}>{emoji}</span>;
};
