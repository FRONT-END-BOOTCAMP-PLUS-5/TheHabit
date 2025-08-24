import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscribePushNotification, unsubscribePushNotification } from '@/libs/api/notifications.api';
import { PushSubscriptionDto } from '@/backend/notifications/applications/dtos/PushSubscriptionDto';

/**
 * 푸시 알림 구독을 관리하는 훅
 * @returns 구독/구독해제 mutation들과 헬퍼 함수들
 */
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

      // 3. 서비스 워커 등록
      const registration = await navigator.serviceWorker.register('/push-sw.js');
      await navigator.serviceWorker.ready;

      // 4. VAPID 공개 키 (환경변수에서 가져와야 함)
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

      return subscription;
    } catch (error) {
      throw error;
    }
  };

  // 구독 해제
  const unsubscribeFromNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration('/push-sw.js');
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