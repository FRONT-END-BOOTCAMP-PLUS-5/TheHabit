import { firebaseApp } from '@/firebase';
import { getMessaging, getToken, isSupported, type Messaging } from 'firebase/messaging';

const FCM_SW_PATH = '/firebase-messaging-sw.js';

let messagingInstance: Messaging | null = null;

const getServiceWorkerRegistration = async (): Promise<ServiceWorkerRegistration> => {
  const registration = await navigator.serviceWorker.register(FCM_SW_PATH);
  await navigator.serviceWorker.ready;
  return registration;
};

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const supported = await isSupported();
    if (!supported) {
      return null;
    }

    if (!messagingInstance) {
      await getServiceWorkerRegistration();
      messagingInstance = getMessaging(firebaseApp);
    }

    return messagingInstance;
  } catch (error) {
    console.error('Firebase Messaging 초기화 실패:', error);
    return null;
  }
};

export const registerFcmToken = async (): Promise<string | null> => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    return null;
  }

  const vapidKey =
    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!vapidKey) {
    throw new Error(
      'NEXT_PUBLIC_FIREBASE_VAPID_KEY가 없습니다. Firebase Console Web Push 인증서 키를 설정하세요.'
    );
  }

  try {
    const registration = await getServiceWorkerRegistration();

    return await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (
      message.includes('token-subscribe-failed') ||
      message.includes('authentication credential')
    ) {
      throw new Error(
        'FCM 토큰 발급 실패: Firebase Console의 Web Push VAPID 키와 API 설정을 확인하세요. (NEXT_PUBLIC_FIREBASE_VAPID_KEY)'
      );
    }

    throw error;
  }
};
