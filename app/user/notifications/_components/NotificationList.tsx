'use client';

import React, { useState } from 'react';
import { NotificationItem } from './NotificationItem';
import { Notification } from '@/backend/notifications/domains/entities/Notification';
import NoneSearchData from '@/app/_components/none/NoneSearchData';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredNotifications = showUnreadOnly
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (notifications.length === 0) {
    return (
      <NoneSearchData>
        <p>알림이 없습니다.</p>
      </NoneSearchData>
    );
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between p-4 bg-gray-50 border-b'>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              showUnreadOnly
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            {showUnreadOnly ? '읽지 않음' : '전체'}
          </button>
          {unreadCount > 0 && (
            <span className='text-xs text-gray-500'>읽지 않은 알림 {unreadCount}개</span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className='text-sm text-blue-600 hover:text-blue-800 transition-colors'
          >
            모두 읽음
          </button>
        )}
      </div>

      <div className='max-h-[500px] overflow-y-auto'>
        {filteredNotifications.length === 0 ? (
          <div className='p-8 text-center'>
            <p className='text-gray-500 text-sm'>
              {showUnreadOnly ? '읽지 않은 알림이 없어요' : '알림이 없어요'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};
