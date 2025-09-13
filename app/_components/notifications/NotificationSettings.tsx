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
      // 초기 로딩 시에만 체크
      checkSubscriptionStatus();
    }
  }, []); // 의존성 배열 비움 - 초기 로딩 시에만 실행

  const checkSubscriptionStatus = async () => {
    try {
      // Service Worker가 준비될 때까지 기다림
      await navigator.serviceWorker.ready;

      const registration = await navigator.serviceWorker.getRegistration('/sw.js');

      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          console.log('🔍 브라우저 구독 발견, 서버와 동기화 확인 중...');
          // 서버에서도 구독이 유효한지 확인
          try {
            const response = await fetch('/api/notifications/check-subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ endpoint: subscription.endpoint }),
            });
            const data = await response.json();
            console.log('✅ 서버 구독 상태:', data.isSubscribed);

            if (!data.isSubscribed) {
              console.log('⚠️ 서버와 불일치 - 브라우저 구독 제거');
              await subscription.unsubscribe();
              setIsSubscribed(false);
            } else {
              console.log('🎉 구독 상태 동기화 완료!');
              setIsSubscribed(true);
            }
          } catch (error) {
            console.error('🚨 서버 확인 실패:', error);
            setIsSubscribed(false);
          }
        } else {
          console.log('❌ 브라우저 구독 없음');
          setIsSubscribed(false);
        }
      } else {
        console.log('❌ Service Worker 등록 없음');
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('구독 상태 확인 실패:', error);
      setIsSubscribed(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      console.log('🔔 구독 시작...');
      const subscription = await subscribeToNotifications();
      console.log('✅ 구독 성공, 상태를 true로 설정');
      setIsSubscribed(true);
      setPermission('granted');
      console.log('subscription', subscription);

      // 구독 성공 - 서버 API가 성공했으므로 상태는 true
      console.log('🎉 구독 완료!');
    } catch (error) {
      console.error('구독 실패:', error);
      setIsSubscribed(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      console.log('🔕 구독 해제 시작...');

      // 먼저 브라우저 구독 제거
      const registration = await navigator.serviceWorker.getRegistration('/sw.js');
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          console.log('✅ 브라우저 구독 해제 완료');
        }
      }

      // 서버에서도 구독 제거 시도 (실패해도 무관)
      try {
        await unsubscribeFromNotifications();
        console.log('✅ 서버 구독 해제 완료');
      } catch (serverError) {
        console.log(
          '⚠️ 서버 구독 해제 실패 (무관):',
          serverError instanceof Error ? serverError.message : '알 수 없는 오류'
        );
      }

      console.log('✅ 구독 해제 완료, 상태 false로 설정');
      setIsSubscribed(false);
    } catch (error) {
      console.error('구독 해제 실패:', error);
      // 에러가 발생해도 프론트엔드 상태는 초기화
      setIsSubscribed(false);
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
            <span className='text-xs text-red-500 mr-2'>브라우저 설정에서 알림을 허용해주세요</span>
          )}

          {/* iOS 스타일 토글 스위치 */}
          <button
            onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
            disabled={isSubscribing || isUnsubscribing || permission === 'denied'}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isSubscribed ? 'bg-[#34A853]' : 'bg-gray-200'
            } ${isSubscribing || isUnsubscribing ? 'opacity-50' : ''}`}
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
