// 간단한 Service Worker (PWA 우회용)
console.log('🚀 Simple Push Service Worker 로드됨');

self.addEventListener('install', () => {
  console.log('📦 Simple Push Service Worker 설치됨');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ Simple Push Service Worker 활성화됨');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('🔔 푸시 이벤트 수신:', event);
  
  if (!event.data) {
    console.log('푸시 이벤트에 데이터가 없습니다.');
    return;
  }

  let data = {};
  try {
    data = event.data.json();
  } catch (error) {
    console.error('푸시 데이터 파싱 실패:', error);
    data = { title: '새 알림', body: event.data.text() };
  }

  const options = {
    body: data.body || '새 알림이 도착했습니다.',
    icon: '/images/icons/notification-icon.png',
    badge: '/images/icons/badge-icon.png',
    tag: data.tag || 'default',
    requireInteraction: true,
    data: data.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '새 알림', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // 알림 클릭 시 앱으로 이동
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        if (self.clients.openWindow) {
          const targetUrl = event.notification.data?.url || '/';
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('알림이 닫혔습니다:', event.notification.tag);
});