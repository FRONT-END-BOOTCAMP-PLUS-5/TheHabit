'use client';

import React from 'react';
import { Notification } from '@/backend/notifications/domain/entities/Notification';
import { ProfileImage } from '@/app/_components/profile-images/ProfileImage';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification,
  onMarkAsRead 
}) => {
  const handleMarkAsRead = () => {
    if (!notification.isRead && notification.id) {
      onMarkAsRead(notification.id);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.isRead ? 'bg-[#ecfbcd]' : 'bg-white'
      }`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex-shrink-0">
          {notification.metadata?.fromUserProfileImg ? (
            <ProfileImage
              imageSrc={notification.metadata.fromUserProfileImg}
              wrapperWidth={10}
              wrapperHeight={10}
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">
                {notification.metadata?.fromUserNickname?.charAt(0) || 'S'}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 font-medium truncate">
            {notification.title}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {notification.createdAt && formatTime(notification.createdAt)}
          </p>
        </div>
        
        {!notification.isRead && (
          <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
        )}
      </div>
    </div>
  );
};