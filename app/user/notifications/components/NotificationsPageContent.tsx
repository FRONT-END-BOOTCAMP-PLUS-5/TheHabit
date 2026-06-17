'use client';

import React, { useState } from 'react';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'routine_alert',
    title: '오늘의 루틴을 실천할 시간이에요!',
    message: '아침 스트레칭 10분',
    time: '5분 전',
    isRead: false,
  },
  {
    id: 2,
    type: 'follow',
    title: '새로운 팔로워',
    message: 'habit_user님이 회원님을 팔로우했어요.',
    time: '2시간 전',
    isRead: false,
  },
  {
    id: 3,
    type: 'routine_completion',
    title: '루틴 완료',
    message: '독서 30분 루틴을 완료했어요.',
    time: '어제',
    isRead: true,
  },
];

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  follow: { label: '팔로우', className: 'bg-blue-50 text-blue-600' },
  routine_completion: { label: '루틴', className: 'bg-lime-50 text-lime-700' },
  routine_alert: { label: '알림', className: 'bg-amber-50 text-amber-700' },
};

export const NotificationsPageContent = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [pushEnabled, setPushEnabled] = useState(false);

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
  const filtered =
    activeTab === 'unread' ? MOCK_NOTIFICATIONS.filter(n => !n.isRead) : MOCK_NOTIFICATIONS;

  const handlePushToggleClick = async () => {
    setPushEnabled(prev => !prev);
    if (!('Notification' in window)) {
      alert('이 브라우저는 푸시 알림을 지원하지 않습니다.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      alert('알림 권한이 허용되었습니다.');
    } else {
      alert('알림 권한이 거부되었습니다.');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 pb-6'>
      <div className='w-full max-w-lg mx-auto bg-white min-h-screen shadow-sm'>
        {/* 헤더 */}
        <header className='sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-bold text-gray-900'>알림</h1>
              {unreadCount > 0 && (
                <p className='text-xs text-gray-500 mt-0.5'>읽지 않은 알림 {unreadCount}개</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type='button'
                className='text-xs font-semibold text-primary hover:opacity-80 transition-opacity'
              >
                모두 읽음
              </button>
            )}
          </div>
        </header>

        {/* 푸시 알림 설정 */}
        <div className='mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-r from-lime-50 to-white border border-lime-100 shadow-sm'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-lg'>
                🔔
              </div>
              <div>
                <h3 className='text-sm font-bold text-gray-900'>푸시 알림</h3>
                <p className='text-xs text-gray-500 mt-0.5'>
                  루틴·팔로우 알림을 실시간으로 받아보세요
                </p>
              </div>
            </div>
            <button
              type='button'
              role='switch'
              aria-checked={pushEnabled}
              onClick={handlePushToggleClick}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
                pushEnabled ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  pushEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 탭 */}
        <div className='flex mt-4 border-b border-gray-100'>
          {(['all', 'unread'] as const).map(tab => (
            <button
              key={tab}
              type='button'
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === tab ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {tab === 'all' ? '전체' : '읽지 않음'}
              {tab === 'unread' && unreadCount > 0 && (
                <span className='ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-primary rounded-full'>
                  {unreadCount}
                </span>
              )}
              {activeTab === tab && (
                <span className='absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full' />
              )}
            </button>
          ))}
        </div>

        {/* 알림 목록 */}
        {filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-center px-6'>
            <span className='text-4xl mb-3'>🔔</span>
            <p className='font-medium text-gray-700'>읽지 않은 알림이 없어요</p>
            <p className='text-sm text-gray-400 mt-1'>새 소식이 오면 여기에 표시됩니다</p>
          </div>
        ) : (
          <ul>
            {filtered.map(item => {
              const badge = TYPE_BADGE[item.type] ?? {
                label: '알림',
                className: 'bg-gray-50 text-gray-600',
              };

              return (
                <li key={item.id}>
                  <button
                    type='button'
                    className={`w-full text-left p-4 border-b border-gray-100 transition-colors hover:bg-gray-50/80 ${
                      !item.isRead ? 'bg-[#f7fce8]' : 'bg-white'
                    }`}
                  >
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                        <span className='text-sm font-bold text-gray-500'>
                          {item.title.charAt(0)}
                        </span>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                          {!item.isRead && <span className='w-1.5 h-1.5 rounded-full bg-primary' />}
                        </div>
                        <p className='text-sm font-semibold text-gray-900 mt-1 truncate'>
                          {item.title}
                        </p>
                        <p className='text-sm text-gray-600 mt-0.5 line-clamp-2'>{item.message}</p>
                        <p className='text-xs text-gray-400 mt-2'>{item.time}</p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
