// 푸시 알림 전용 서비스 워커

self.addEventListener('push', event => {
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
    icon: '/icons/manifest-192x192.png',
    badge: '/icons/manifest-192x192.png',
    tag: data.tag || 'default',
    requireInteraction: true,
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: '확인',
        icon: '/icons/activeHome.svg'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/icons/icon_close.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '새 알림', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // 알림 클릭 시 앱으로 이동
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // 이미 열린 탭이 있으면 포커스
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // 열린 탭이 없으면 새로 열기
        if (clients.openWindow) {
          const targetUrl = event.notification.data?.url || '/';
          return clients.openWindow(targetUrl);
        }
      })
  );
});

self.addEventListener('notificationclose', event => {
  console.log('알림이 닫혔습니다:', event.notification.tag);
});