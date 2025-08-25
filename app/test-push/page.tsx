'use client';

import { useState } from 'react';

export default function TestPushPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    setLogs(prev => [...prev, logMessage]);
    console.log(logMessage);
  };

  const checkNotificationSupport = () => {
    if ('Notification' in window) {
      addLog('✅ 브라우저가 알림을 지원합니다');
      addLog(`현재 권한: ${Notification.permission}`);
    } else {
      addLog('❌ 브라우저가 알림을 지원하지 않습니다');
    }

    if ('serviceWorker' in navigator) {
      addLog('✅ Service Worker를 지원합니다');
    } else {
      addLog('❌ Service Worker를 지원하지 않습니다');
    }

    if ('PushManager' in window) {
      addLog('✅ Push API를 지원합니다');
    } else {
      addLog('❌ Push API를 지원하지 않습니다');
    }
  };

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      addLog(`알림 권한: ${permission}`);

      if (permission === 'granted') {
        addLog('✅ 알림 권한이 허용되었습니다');
      } else if (permission === 'denied') {
        addLog('❌ 알림 권한이 거부되었습니다');
      } else {
        addLog('⏳ 알림 권한이 보류 상태입니다');
      }
    } catch (error) {
      addLog(`❌ 권한 요청 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const registerServiceWorker = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;
        addLog('✅ Service Worker 등록 성공');
        addLog(`Scope: ${registration.scope}`);
        return registration;
      }
    } catch (error) {
      addLog(`❌ Service Worker 등록 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration('/sw.js');
      if (!registration) {
        addLog('❌ Service Worker가 등록되지 않았습니다');
        return;
      }

      const vapidPublicKey = 'BBi1jqUqvyk3Aba94TeJKCslEt6Ex-Bs_dlyLmANtC6odleLD0a4CaDAn1UwZtg2pKbBsk8lz07unNIxcMgerH4';

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      addLog('✅ 푸시 구독 성공');
      addLog(`Endpoint: ${subscription.endpoint.substring(0, 50)}...`);

      // 서버에 구독 정보 전송
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')!))),
          auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')!)))
        })
      });

      const result = await response.json();
      if (result.success) {
        addLog('✅ 서버 구독 등록 성공');
      } else {
        addLog(`❌ 서버 구독 등록 실패: ${result.error?.message || 'Unknown error'}`);
      }

      return subscription;
    } catch (error) {
      addLog(`❌ 구독 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const sendTestNotification = async () => {
    try {
      // 직접 브라우저 알림 테스트
      if (Notification.permission === 'granted') {
        const notification = new Notification('🧪 테스트 알림', {
          body: 'TheHabit 로컬 테스트 알림입니다!',
          icon: '/images/icons/manifest-192x192.png',
        });

        notification.onclick = function() {
          addLog('📱 알림이 클릭되었습니다');
          notification.close();
        };

        addLog('✅ 테스트 알림 발송됨');
      } else {
        addLog('❌ 알림 권한이 없습니다');
      }
    } catch (error) {
      addLog(`❌ 테스트 알림 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🔔 푸시 알림 테스트</h1>

      <div className="space-y-4 mb-8">
        <button 
          onClick={checkNotificationSupport}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          1. 브라우저 지원 확인
        </button>
        <button 
          onClick={requestPermission}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          2. 알림 권한 요청
        </button>
        <button 
          onClick={registerServiceWorker}
          className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
        >
          3. Service Worker 등록
        </button>
        <button 
          onClick={subscribeUser}
          className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
        >
          4. 푸시 구독
        </button>
        <button 
          onClick={sendTestNotification}
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
        >
          5. 테스트 알림 발송
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">실행 로그:</h3>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm font-mono">
              {log}
            </div>
          ))}
        </div>
        {logs.length > 0 && (
          <button 
            onClick={() => setLogs([])}
            className="mt-2 bg-gray-500 text-white px-3 py-1 rounded text-sm"
          >
            로그 지우기
          </button>
        )}
      </div>
    </div>
  );
}