import HealthIcon from '@/public/icons/icon_health.png';
import BookIcon from '@/public/icons/icon_study.svg';
import DevelopIcon from '@/public/icons/icon_develop.png';
import GuitarIcon from '@/public/icons/icon_guitar.png';

export const CATEGORY_CONFIG = [
  {
    name: '건강',
    id: 1,
    color: '#FFB347',
    textClass: 'text-[#FFB347]',
    src: HealthIcon,
    alt: '건강',
  },
  {
    name: '공부',
    id: 2,
    color: '#3B82F6',
    textClass: 'text-[#3B82F6]',
    src: BookIcon,
    alt: '공부',
  },
  {
    name: '자기개발',
    id: 3,
    color: '#F472B6',
    textClass: 'text-[#F472B6]',
    src: DevelopIcon,
    alt: '자기개발',
  },
  {
    name: '기타',
    id: 4,
    color: '#6A89CC',
    textClass: 'text-[#6A89CC]',
    src: GuitarIcon,
    alt: '기타',
  },
];

