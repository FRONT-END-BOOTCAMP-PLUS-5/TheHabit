interface ICheckBoxItem {
  id: number;
  label: string;
  required: boolean;
}

export const CheckBoxItem: ICheckBoxItem[] = [
  {
    id: 1,
    label: '정보 제3자 동의를 체크 해주세요',
    required: true,
  },
  {
    id: 2,
    label: '개인 정보 수집 동의를 체크 해주세요',
    required: true,
  },
];
