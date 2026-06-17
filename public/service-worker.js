// public/service-worker.js — 페이지에서 FCM SW 등록 (SW 파일 자체가 아님)
function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then(function (registration) {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch(function (error) {
        console.error('Service Worker registration failed:', error);
      });
  }
}
registerServiceWorker();