'use client';

import React, { useState } from 'react';
import { NotificationItem } from './NotificationItem';
import { Notification } from '@/backend/notifications/domain/entities/Notification';
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
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const filteredNotifications = activeTab === 'unread'
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
      <div className='bg-white border-b border-gray-200'>
        <div className='flex'>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 border-b-2 border-transparent'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 py-3 text-center font-medium relative transition-colors ${
              activeTab === 'unread'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 border-b-2 border-transparent'
            }`}
          >
            읽지 않음
            {unreadCount > 0 && (
              <span className='ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-4 flex items-center justify-center'>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        
        {unreadCount > 0 && (
          <div className='px-4 py-2 bg-gray-50 border-b'>
            <button
              onClick={onMarkAllAsRead}
              className='text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium'
            >
              모두 읽음 처리
            </button>
          </div>
        )}
      </div>

      <div className='max-h-[500px] overflow-y-auto'>
        {filteredNotifications.length === 0 ? (
          <div className='p-8 text-center'>
            <p className='text-gray-500 text-sm'>
              {activeTab === 'unread' ? '읽지 않은 알림이 없어요' : '알림이 없어요'}
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
