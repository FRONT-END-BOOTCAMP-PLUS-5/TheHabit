// 한국어로 포맷된 날짜 문자열 가져오기
export const getKoreanDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const day = today.getDay();

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[day];

  return `${year}년 ${month}월 ${date}일 ${dayName}요일`;
};

// 선택된 날짜를 한국어로 포맷하는 함수
export const getKoreanDateFromDate = (selectedDate: Date): string => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const date = selectedDate.getDate();
  const day = selectedDate.getDay();

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[day];

  return `${year}년 ${month}월 ${date}일 ${dayName}요일`;
}; 