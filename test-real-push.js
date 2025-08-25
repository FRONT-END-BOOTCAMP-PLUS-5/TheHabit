const { PrismaClient } = require('@prisma/client');
const webpush = require('web-push');
const prisma = new PrismaClient();

// VAPID 키 설정
webpush.setVapidDetails(
  'mailto:test@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function sendRealPushNotification() {
  try {
    console.log('🔍 최신 구독 데이터 조회...');
    
    // 가장 최근에 구독한 데이터 가져오기 (로그인한 사용자)
    const subscription = await prisma.pushSubscription.findFirst({
      where: { 
        userId: { not: null }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!subscription) {
      console.log('❌ 테스트할 구독이 없습니다. 먼저 /test-push에서 구독하세요.');
      return;
    }
    
    console.log('📱 테스트 대상:', {
      userId: subscription.userId,
      endpoint: subscription.endpoint.substring(0, 50) + '...',
      createdAt: subscription.createdAt
    });
    
    // 푸시 알림 페이로드
    const payload = {
      title: '🚀 서버에서 보낸 실제 푸시 알림!',
      body: 'Part 3 구현이 완벽하게 동작하고 있습니다! 🎉',
      icon: '/images/icons/notification-icon.png',
      badge: '/images/icons/badge-icon.png',
      tag: 'test-notification',
      data: {
        type: 'test',
        url: '/notifications',
        timestamp: Date.now()
      }
    };
    
    // Web Push 구독 객체 생성
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      }
    };
    
    console.log('🚀 실제 푸시 알림 발송 중...');
    console.log('📋 페이로드:', JSON.stringify(payload, null, 2));
    
    const result = await webpush.sendNotification(
      pushSubscription, 
      JSON.stringify(payload)
    );
    
    console.log('✅ 푸시 알림 발송 성공!');
    console.log('📊 응답 상태:', result.statusCode);
    console.log('📱 이제 브라우저에서 알림을 확인하세요!');
    
  } catch (error) {
    if (error.statusCode === 410) {
      console.log('⚠️ 만료된 구독입니다. 브라우저에서 다시 구독하세요.');
    } else if (error.statusCode === 400) {
      console.log('❌ 잘못된 구독 정보입니다:', error.body);
    } else {
      console.error('🚨 푸시 알림 발송 실패:');
      console.error('Status Code:', error.statusCode);
      console.error('Headers:', error.headers);
      console.error('Body:', error.body);
      console.error('Message:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

console.log('🧪 실제 푸시 알림 테스트 시작...');
console.log('📝 테스트 전 체크리스트:');
console.log('  1. 브라우저에서 /test-push 페이지 접속');
console.log('  2. 1-4번 버튼을 순서대로 클릭하여 구독 완료');
console.log('  3. 브라우저 탭을 그대로 두고 이 스크립트 실행');
console.log('');

sendRealPushNotification();