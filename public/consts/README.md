# 루틴 이모지 사용 가이드

## 📋 개요

루틴과 관련된 이모지 매핑과 유틸리티 함수들입니다.

## 🎯 사용법

### 1. EmojiDisplay 컴포넌트 (권장)

```typescript
import { EmojiDisplay } from "@/app/_components/emoji/EmojiDisplay";

// 기본 사용 (EMOJI_MAP 자동 사용)
<EmojiDisplay emojiNumber={1} className="text-2xl" />

// 커스텀 이모지 맵 사용
<EmojiDisplay
  emojiNumber={1}
  emojiMap={customEmojiMap}
  defaultEmoji="⭐"
/>
```

### 2. 유틸리티 함수 사용

```typescript
import {
  getEmojiByNumber,
  getAllEmojis,
  getEmojiNumbers,
  EMOJI_MAP,
} from 'public/consts/routineItem';

// 이모지 번호로 이모지 가져오기
const emoji = getEmojiByNumber(1); // "🏃"
const emojiWithDefault = getEmojiByNumber(999, '❓'); // "❓"

// 모든 이모지 목록
const allEmojis = getAllEmojis(); // ["🏃", "💧", "📚", ...]

// 사용 가능한 번호들
const numbers = getEmojiNumbers(); // [1, 2, 3, ...]

// 직접 매핑 객체 사용
const directEmoji = EMOJI_MAP[1]; // "🏃"
```

### 3. 다른 컴포넌트에서 활용

```typescript
// 루틴 생성 폼에서 이모지 선택기
import { getAllEmojis, getEmojiNumbers } from "public/consts/routineItem";

function RoutineEmojiPicker() {
  const emojiOptions = getEmojiNumbers().map(num => ({
    value: num,
    emoji: getEmojiByNumber(num)
  }));

  return (
    <div>
      {emojiOptions.map(option => (
        <button key={option.value}>
          {option.emoji}
        </button>
      ))}
    </div>
  );
}
```

## 🎨 사용 가능한 이모지 목록

| 번호 | 이모지 | 의미          |
| ---- | ------ | ------------- |
| 1    | 🏃     | 운동/달리기   |
| 2    | 💧     | 물 마시기     |
| 3    | 📚     | 독서/공부     |
| 4    | 🧘     | 명상/요가     |
| 5    | 🏋️     | 헬스/근력운동 |
| 6    | 🥗     | 건강한 식사   |
| 7    | 😴     | 수면          |
| 8    | 🎵     | 음악          |
| 9    | ✍️     | 글쓰기/일기   |
| 10   | 🌱     | 성장/습관     |

_... 총 20개의 이모지 매핑 제공_

## 🔧 확장 방법

새로운 이모지를 추가하려면 `EMOJI_MAP` 객체에 번호와 이모지를 추가하세요:

```typescript
export const EMOJI_MAP: { [key: number]: string } = {
  // ... 기존 매핑들
  21: '🎯', // 새로운 이모지 추가
  22: '🎨',
};
```
