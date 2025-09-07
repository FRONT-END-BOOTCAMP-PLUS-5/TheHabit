import HealthIcon from '@/public/icons/icon_health.png';
import BookIcon from '@/public/icons/icon_study.svg';
import DevelopIcon from '@/public/icons/icon_develop.png';
import GuitarIcon from '@/public/icons/icon_guitar.png';

export const NONE_USER_CATEGORY_CONFIG = [
  {
    name: 'ex)매일 10분 러닝',
    id: 1,
    color: '#FFB347',
    textClass: 'text-[#FFB347]',
    src: HealthIcon,
    alt: '건강 아이콘',
    detailName: '건강',
  },
  {
    name: 'ex)매일 10분 자바스크립트 공부',
    id: 2,
    color: '#3B82F6',
    textClass: 'text-[#3B82F6]',
    src: BookIcon,
    alt: '공부 아이콘',
    detailName: '공부',
  },
  {
    name: 'ex)매일 10분 독서',
    id: 3,
    color: '#F472B6',
    textClass: 'text-[#F472B6]',
    src: DevelopIcon,
    alt: '자기개발 아이콘',
    detailName: '자기계발',
  },
  {
    name: 'ex)매일 10분 일상 생활',
    id: 4,
    color: '#6A89CC',
    textClass: 'text-[#6A89CC]',
    src: GuitarIcon,
    alt: '기타 아이콘',
    detailName: '기타',
  },
];

