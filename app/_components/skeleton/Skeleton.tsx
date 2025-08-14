'use client';

import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

// 기본 스켈레톤 컴포넌트
export const Skeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '', 
  rounded = 'md' 
}: SkeletonProps) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div 
      className={`bg-gray-200 animate-pulse ${width} ${height} ${roundedClasses[rounded]} ${className}`}
    />
  );
};

// 텍스트 스켈레톤
export const TextSkeleton = ({ lines = 1, className = '' }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, index) => (
      <Skeleton 
        key={index} 
        width={index === lines - 1 ? 'w-3/4' : 'w-full'} 
        height="h-4" 
      />
    ))}
  </div>
);

// 아바타 스켈레톤
export const AvatarSkeleton = ({ size = 'medium', className = '' }: { size?: 'small' | 'medium' | 'large'; className?: string }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <Skeleton 
      width={sizeClasses[size]} 
      height={sizeClasses[size]} 
      rounded="full" 
      className={className}
    />
  );
};

// 버튼 스켈레톤
export const ButtonSkeleton = ({ width = 'w-20', className = '' }: { width?: string; className?: string }) => (
  <Skeleton width={width} height="h-8" rounded="md" className={className} />
);

// 카드 스켈레톤
export const CardSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`p-4 border border-gray-200 rounded-lg bg-white ${className}`}>
    <div className="flex items-center space-x-3 mb-3">
      <AvatarSkeleton size="medium" />
      <div className="flex-1">
        <TextSkeleton lines={2} />
      </div>
      <ButtonSkeleton />
    </div>
    <TextSkeleton lines={3} />
  </div>
);

// 리스트 아이템 스켈레톤
export const ListItemSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg border bg-white border-gray-200 ${className}`}>
    <div className="flex items-center space-x-3">
      <Skeleton width="w-5" height="h-5" />
      <AvatarSkeleton size="medium" />
      <div className="space-y-2">
        <Skeleton width="w-24" height="h-4" />
        <Skeleton width="w-16" height="h-3" />
      </div>
    </div>
    <ButtonSkeleton width="w-16" />
  </div>
);

// 리스트 스켈레톤
export const ListSkeleton = ({ 
  items = 3, 
  title = true, 
  className = '' 
}: { 
  items?: number; 
  title?: boolean; 
  className?: string 
}) => (
  <div className={`border-t border-gray-200 bg-gray-50 ${className}`}>
    <div className="p-4">
      {title && <Skeleton width="w-32" height="h-6" className="mb-4" />}
      <div className="space-y-3">
        {[...Array(items)].map((_, index) => (
          <ListItemSkeleton key={index} />
        ))}
      </div>
    </div>
  </div>
);