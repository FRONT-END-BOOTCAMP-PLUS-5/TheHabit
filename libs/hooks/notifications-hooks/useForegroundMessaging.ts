import { useEffect } from 'react';
import { onMessage, type MessagePayload } from 'firebase/messaging';
import { Toast } from '@/app/_components/toasts/Toast';
import { getFirebaseMessaging } from '@/libs/firebase/messaging';

const showForegroundNotification = async (payload: MessagePayload) => {
  const title = payload.notification?.title ?? payload.data?.title ?? 'TheHabit';
  const body = payload.notification?.body ?? payload.data?.body ?? '새 알림이 도착했습니다.';
  const redirectUrl = payload.data?.url ?? '/user/notifications';

  Toast.info(`${title}: ${body}`);

  if (
    typeof window === 'undefined' ||
    !('Notification' in window) ||
    Notification.permission !== 'granted'
  ) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body,
      icon: '/images/icons/manifest-192x192.png',
      data: { ...payload.data, url: redirectUrl },
    });
  } catch (error) {
    console.error('SW 알림 표시 실패, Notification API fallback:', error);

    const notification = new Notification(title, {
      body,
      icon: '/images/icons/manifest-192x192.png',
      data: payload.data,
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = redirectUrl;
      notification.close();
    };
  }
};

/** 앱이 포그라운드일 때 FCM 메시지 수신 — 알림 권한이 허용된 경우 전역에서 리스닝 */
export const useForegroundMessaging = () => {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('Notification' in window) ||
      Notification.permission !== 'granted'
    ) {
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const setup = async () => {
      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging || cancelled) {
          return;
        }

        unsubscribe = onMessage(messaging, payload => {
          console.log('FCM foreground 수신:', payload);
          void showForegroundNotification(payload);
        });
      } catch (error) {
        console.error('FCM foreground 리스너 등록 실패:', error);
      }
    };

    setup();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);
};
