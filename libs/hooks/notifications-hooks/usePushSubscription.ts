import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  subscribePushNotification,
  unsubscribePushNotification,
} from '@/libs/api/notifications.api';
import { PushSubscriptionDto } from '@/backend/notifications/application/dtos/PushSubscriptionDto';

export const usePushSubscription = () => {
  const queryClient = useQueryClient();

  // 구독 mutation
  const subscribeMutation = useMutation<
    {
      success: boolean;
      data?: PushSubscriptionDto;
      message?: string;
      error?: { code: string; message: string };
    },
    Error,
    { endpoint: string; p256dh: string; auth: string }
  >({
    mutationFn: subscribePushNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // 구독 해제 mutation
  const unsubscribeMutation = useMutation<
    {
      success: boolean;
      data?: null;
      message?: string;
      error?: { code: string; message: string };
    },
    Error,
    { endpoint: string }
  >({
    mutationFn: unsubscribePushNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // 브라우저가 푸시 알림을 지원하는지 확인
  const isPushSupported = () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  };

  // 알림 권한 요청
  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      throw new Error('이 브라우저는 알림을 지원하지 않습니다.');
    }

    const permission = await Notification.requestPermission();
    return permission;
  };

  // 서비스 워커 등록 및 구독
  const subscribeToNotifications = async () => {
    try {
      // 1. 푸시 지원 여부 확인
      if (!isPushSupported()) {
        throw new Error('이 브라우저는 푸시 알림을 지원하지 않습니다.');
      }

      // 2. 알림 권한 요청
      const permission = await requestNotificationPermission();
      if (permission !== 'granted') {
        throw new Error('알림 권한이 거부되었습니다.');
      }

      // 3. 서비스 워커 등록 및 준비 대기 (예전 sw.js 등록 정리)
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations
          .filter(reg => {
            const scriptUrl =
              reg.active?.scriptURL || reg.installing?.scriptURL || reg.waiting?.scriptURL || '';
            return scriptUrl.endsWith('/sw.js');
          })
          .map(reg => reg.unregister())
      );

      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;

      // 서비스 워커가 활성 상태가 될 때까지 추가 대기
      if (registration.active === null) {
        await new Promise(resolve => {
          const checkActive = () => {
            if (registration.active) {
              resolve(void 0);
            } else {
              setTimeout(checkActive, 100);
            }
          };
          checkActive();
        });
      }

      // 4. VAPID 공개 키
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error('VAPID 공개 키가 설정되지 않았습니다.');
      }

      // 5. 푸시 구독 생성
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });

      // 6. 구독 정보를 서버에 전송
      const subscriptionJson = subscription.toJSON();
      await subscribeMutation.mutateAsync({
        endpoint: subscriptionJson.endpoint!,
        p256dh: subscriptionJson.keys!.p256dh!,
        auth: subscriptionJson.keys!.auth!,
      });

      console.log('📤 서버 구독 등록 완료, 구독 객체 반환');
      return subscription;
    } catch (error) {
      throw error;
    }
  };

  // 구독 해제
  const unsubscribeFromNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error('서비스 워커를 찾을 수 없습니다.');
      }

      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        throw new Error('활성 구독을 찾을 수 없습니다.');
      }

      // 서버에서 구독 해제
      const subscriptionJson = subscription.toJSON();
      await unsubscribeMutation.mutateAsync({
        endpoint: subscriptionJson.endpoint!,
      });

      // 브라우저에서 구독 해제
      await subscription.unsubscribe();
    } catch (error) {
      throw error;
    }
  };

  return {
    // Mutations
    subscribeMutation,
    unsubscribeMutation,

    // Helper functions
    isPushSupported,
    requestNotificationPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications,

    // States
    isSubscribing: subscribeMutation.isPending,
    isUnsubscribing: unsubscribeMutation.isPending,
    subscribeError: subscribeMutation.error,
    unsubscribeError: unsubscribeMutation.error,
  };
};
