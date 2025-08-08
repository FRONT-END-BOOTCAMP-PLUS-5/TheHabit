"use client";
import React from 'react';
import Plus from '@/app/_components/Icons/Plus';
import Bell from '@/app/_components/Icons/Bell';
import ArrowBack from '@/app/_components/Icons/ArrowBack';
import Trash from '@/app/_components/Icons/Trash';
import Question from '@/app/_components/Icons/Question';
import Hamburger from '@/app/_components/Icons/Hamburger';
import Close from '@/app/_components/Icons/Close';
import Eye from '@/app/_components/Icons/Eye';
import EyeSlash from '@/app/_components/Icons/EyeSlash';
import Image from '@/app/_components/Icons/Image';
import Search from '@/app/_components/Icons/Search';

interface IconProps {
  name: 'plus' | 'bell' | 'arrowBack' | 'trash' | 'question' | 'hamburger' | 'close' | 'eye' | 'eyeSlash' | 'image' | 'search';
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
  variant?: 'outline' | 'filled' | 'active';
}

const Icon: React.FC<IconProps> = ({
  name,
  width = 24,
  height = 24,
  color = 'currentColor',
  className = '',
  onClick,
//   variant = 'outline'
}) => {
  const iconComponents = {
    plus: Plus,
    bell: Bell,
    arrowBack: ArrowBack,
    trash: Trash,
    question: Question,
    hamburger: Hamburger,
    close: Close,
    eye: Eye,
    eyeSlash: EyeSlash,
    image: Image,
    search: Search,
  };

  const IconComponent = iconComponents[name as keyof typeof iconComponents];

  if (IconComponent) {
    return (
      <IconComponent
        width={width}
        height={height}
        color={color}
        className={className}
        onClick={onClick}
      />
    );
  }

  // 기본 Plus 아이콘 (fallback)
  return (
    <Plus
      width={width}
      height={height}
      color={color}
      className={className}
      onClick={onClick}
    />
  );
};

export default Icon; 