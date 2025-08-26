'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { NotificationList } from './_components/NotificationList';
import { PushSubscriptionToggle } from './_components/PushSubscriptionToggle';
import { Notification } from '@/backend/notifications/domains/entities/Notification';
import { LoadingSpinner } from '@/app/_components/loading/LoadingSpinner';
import { useRouter } from 'next/navigation';

const NotificationsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    fetchNotifications();
  }, [session, status, router]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      
      if (!response.ok) {
        throw new Error('알림 조회에 실패했습니다.');
      }

      const data = await response.json();
      
      if (data.success) {
        const notificationsWithDates = data.data.map((n: Notification & { createdAt: string }) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }));
        setNotifications(notificationsWithDates);
      } else {
        setError(data.error?.message || '알림 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('알림 조회 실패:', error);
      setError('알림을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, isRead: true }))
        );
      }
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-sm">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
          <h1 className="text-lg font-semibold text-gray-900">알림</h1>
        </div>
        
        <PushSubscriptionToggle />
        
        <NotificationList
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </div>
    </div>
  );
};

export default NotificationsPage;