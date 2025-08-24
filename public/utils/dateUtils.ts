// 한국어로 포맷된 날짜 문자열 가져오기
export const getKoreanDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const day = today.getDay();

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[day];

  return `${year}년 ${month}월 ${date}일 ${dayName}요일`;
};

// 선택된 날짜를 한국어로 포맷하는 함수
export const getKoreanDateFromDate = (selectedDate: Date): string => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const date = selectedDate.getDate();
  const day = selectedDate.getDay();

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[day];

  return `${year}년 ${month}월 ${date}일 ${dayName}요일`;
};

// 문자 T를 기준으로 제거해서 앞부분 예를들어 2025-08-18T~ 현재 데이터가 이렇게 나오는데
// 이때 T앞부분만을 가져오는 경우가 필요할때가 있음 ㅇㅈ?, ㅇ ㅇㅈ 내가 필요해
// 그렇기때문에 해당 함수를 제작함
export const getYearAndMonthAndDay = (date: string): string => {
  const formatDate = date.split('T')[0];
  return formatDate;
}