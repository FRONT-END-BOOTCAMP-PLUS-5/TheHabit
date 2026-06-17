importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyAmbrfcXgsUjAtABXmpKt6Qg_3gCNYLTcU',
  authDomain: 'miniprojext-8206f.firebaseapp.com',
  projectId: 'miniprojext-8206f',
  storageBucket: 'miniprojext-8206f.firebasestorage.app',
  messagingSenderId: '267555140660',
  appId: '1:267555140660:web:4b0384399affdedeea8661',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw] background 수신:', payload);

  const title = payload.notification?.title ?? payload.data?.title ?? 'TheHabit';
  const body = payload.notification?.body ?? payload.data?.body ?? '새 알림이 도착했습니다.';

  return self.registration.showNotification(title, {
    body,
    icon: '/images/icons/manifest-192x192.png',
    data: { ...payload.data, url: payload.data?.url ?? '/user/notifications' },
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url = event.notification.data?.url ?? '/user/notifications';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
