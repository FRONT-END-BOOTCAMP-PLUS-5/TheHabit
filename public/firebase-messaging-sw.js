importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

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

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification.title + " (onBackgroundMessage)";
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://avatars.githubusercontent.com/sasha1107",
  };

  self.registration.showNotification(title, notificationOptions);
});