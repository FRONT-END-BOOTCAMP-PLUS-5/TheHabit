"use client";
import React from 'react';

interface ArrowBackIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

const ArrowBack = ({
  width = 24,
  height = 24,
  color = 'currentColor',
  className = '',
  onClick
}: ArrowBackIconProps) => (
  <svg
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    className={`size-6 ${className}`}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5"
    />
  </svg>
);

export default ArrowBack; 
