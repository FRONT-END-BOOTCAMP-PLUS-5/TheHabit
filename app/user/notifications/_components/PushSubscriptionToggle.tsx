'use client';

import React, { useState, useEffect } from 'react';

export const PushSubscriptionToggle: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsEnabled(!!subscription);
    } catch (error) {
      console.error('구독 상태 확인 실패:', error);
    }
  };

  const toggleSubscription = async () => {
    setIsLoading(true);
    
    try {
      if (isEnabled) {
        await unsubscribe();
      } else {
        await subscribe();
      }
    } catch (error) {
      console.error('구독 토글 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribe = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('이 브라우저는 푸시 알림을 지원하지 않습니다.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('알림 권한이 필요합니다.');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    });

    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });

    setIsEnabled(true);
  };

  const unsubscribe = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });
    }

    setIsEnabled(false);
  };

  return (
    <div className="p-4 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">푸시 알림</h3>
          <p className="text-sm text-gray-500 mt-1">
            새로운 알림을 실시간으로 받아보세요
          </p>
        </div>
        
        <button
          onClick={toggleSubscription}
          disabled={isLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
            isEnabled ? 'bg-green-500' : 'bg-gray-200'
          } ${isLoading ? 'opacity-50' : ''}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};