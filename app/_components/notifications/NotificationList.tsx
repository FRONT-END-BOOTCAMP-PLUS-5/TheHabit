'use client';

import { useState } from 'react';

interface Notification {
  id: string;
  type: 'follow' | 'routine_completion';
  message: string;
  from?: string;
  createdAt: string;
  isRead: boolean;
}

export const NotificationList = () => {
  // 임시 데이터 - Part 3에서 실제 데이터로 교체
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'follow',
      message: '김철수님이 회원님을 팔로우했습니다',
      from: '김철수',
      createdAt: '2025-08-23T10:30:00Z',
      isRead: false
    },
    {
      id: '2', 
      type: 'routine_completion',
      message: '이영희님이 "아침 운동하기" 루틴을 완료했습니다',
      from: '이영희',
      createdAt: '2025-08-23T09:15:00Z',
      isRead: true
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return '👥';
      case 'routine_completion':
        return '✅';
      default:
        return '🔔';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
  };

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-5 border-b">
        <h2 className="font-bold text-[19px]">
          📋 받은 알림
        </h2>
      </div>

      <div className="divide-y">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">🔕</div>
            <p className="font-semibold text-[16px]">아직 받은 알림이 없습니다</p>
            <p className="text-[13px] text-[#CCC] mt-2">친구들과 소통하며 알림을 받아보세요!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 ${!notification.isRead ? 'bg-gray-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] ${
                    !notification.isRead ? 'font-semibold' : 'text-[#333]'
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-[13px] text-[#CCC] mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-[#34A853] rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-4 border-t text-center">
          <button className="text-[13px] text-[#CCC] hover:text-[#34A853] font-semibold">
            모든 알림 읽음으로 표시
          </button>
        </div>
      )}
    </div>
  );
};