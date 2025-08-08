"use client";
import React from 'react';

interface QuestionIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

const Question = ({
  width = 24,
  height = 24,
  color = 'currentColor',
  className = '',
  onClick
}: QuestionIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="2"
    />
    <path
      d="M9.09 9C9.3251 8.33167 9.78918 7.76811 10.4 7.40921C11.0108 7.0503 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52252 14.2151 8.06383C14.6713 8.60514 14.9211 9.30196 14.92 10C14.92 12 11.92 13 11.92 13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 17H12.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Question; 