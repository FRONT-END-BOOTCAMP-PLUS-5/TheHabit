'use client';

import { useState, useEffect } from 'react';
import { usePushSubscription } from '@/libs/hooks/notifications-hooks';

export const NotificationSettings = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  const {
    subscribeToNotifications,
    unsubscribeFromNotifications,
    isPushSupported,
    isSubscribing,
    isUnsubscribing,
    subscribeError,
    unsubscribeError,
  } = usePushSubscription();

  useEffect(() => {
    const supported = isPushSupported();
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
      checkSubscriptionStatus();
    }
  }, [isPushSupported]);

  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration('/push-sw.js');
      
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('구독 상태 확인 실패:', error);
      setIsSubscribed(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      await subscribeToNotifications();
      setIsSubscribed(true);
      setPermission('granted');
    } catch (error) {
      console.error('구독 실패:', error);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribeFromNotifications();
      setIsSubscribed(false);
    } catch (error) {
      console.error('구독 해제 실패:', error);
    }
  };

  if (!isSupported) {
    return (
      <div className='p-4 bg-gray-100 rounded-lg'>
        <h3 className='text-lg font-semibold mb-2'>알림 설정</h3>
        <p className='text-gray-600'>이 브라우저는 푸시 알림을 지원하지 않습니다.</p>
      </div>
    );
  }

  return (
    <div className='p-5 bg-white border rounded-lg'>
      <div className='flex items-center justify-between'>
        <div>
          <h4 className='font-semibold text-[16px]'>푸시 알림</h4>
          <p className='text-[13px] text-[#CCC]'>루틴 시간과 친구 활동 알림을 받아보세요</p>
        </div>

        <div className='flex items-center gap-2'>
          {permission === 'denied' && (
            <span className='text-xs text-red-500 mr-2'>
              브라우저 설정에서 알림을 허용해주세요
            </span>
          )}

          {/* iOS 스타일 토글 스위치 */}
          <button
            onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
            disabled={isSubscribing || isUnsubscribing || permission === 'denied'}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isSubscribed ? 'bg-[#34A853]' : 'bg-gray-200'
            } ${(isSubscribing || isUnsubscribing) ? 'opacity-50' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isSubscribed ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {subscribeError && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg mt-4'>
          <p className='text-sm text-red-600'>구독 실패: {subscribeError.message}</p>
        </div>
      )}

      {unsubscribeError && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg mt-4'>
          <p className='text-sm text-red-600'>구독 해제 실패: {unsubscribeError.message}</p>
        </div>
      )}
    </div>
  );
};
