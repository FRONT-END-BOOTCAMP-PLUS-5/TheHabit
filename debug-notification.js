const { PrismaClient } = require('@prisma/client');
const webpush = require('web-push');
const prisma = new PrismaClient();

webpush.setVapidDetails(
  'mailto:test@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function debugNotification() {
  try {
    console.log('🔍 알림 디버깅 시작...');
    console.log('');
    
    // 구독 정보 확인
    const subscription = await prisma.pushSubscription.findFirst({
      where: { userId: { not: null } },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!subscription) {
      console.log('❌ 구독 정보가 없습니다.');
      return;
    }
    
    console.log('✅ 구독 정보 확인됨');
    console.log('   Endpoint:', subscription.endpoint.substring(0, 50) + '...');
    console.log('   생성시간:', subscription.createdAt);
    console.log('');
    
    // 테스트 알림 발송
    console.log('📤 테스트 알림 발송 중...');
    console.log('');
    console.log('🚨 중요: 알림을 받으려면');
    console.log('   1. 브라우저 탭을 다른 탭으로 전환하거나');
    console.log('   2. 브라우저를 최소화하거나'); 
    console.log('   3. 다른 애플리케이션으로 전환하세요');
    console.log('');
    console.log('⏰ 5초 후 알림 발송...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const payload = {
      title: '🧪 DEBUG: 알림 테스트',
      body: '지금 이 알림이 보이면 성공입니다!',
      icon: '/images/icons/notification-icon.png',
      tag: 'debug-test',
      requireInteraction: true
    };
    
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      }
    };
    
    const result = await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload)
    );
    
    console.log('✅ 알림 발송 완료!');
    console.log('   상태 코드:', result.statusCode);
    console.log('');
    console.log('📱 이제 화면을 확인하세요:');
    console.log('   - macOS: 화면 우상단 알림');
    console.log('   - Windows: 화면 우하단 알림');
    console.log('   - 브라우저: 브라우저 상단 알림');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugNotification();