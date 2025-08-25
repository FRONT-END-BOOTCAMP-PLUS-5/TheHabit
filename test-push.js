const { PrismaClient } = require('@prisma/client');
const webpush = require('web-push');
const prisma = new PrismaClient();

// VAPID 키 설정
webpush.setVapidDetails(
  'mailto:test@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function testPushNotification() {
  try {
    console.log('🔍 구독 데이터 조회...');
    
    // 첫 번째 구독 가져오기
    const subscription = await prisma.pushSubscription.findFirst({
      where: { userId: { not: null } }
    });
    
    if (!subscription) {
      console.log('❌ 테스트할 구독이 없습니다.');
      return;
    }
    
    console.log('📱 테스트 대상:', {
      userId: subscription.userId,
      endpoint: subscription.endpoint.substring(0, 50) + '...'
    });
    
    // 푸시 알림 페이로드
    const payload = {
      title: '🧪 TheHabit 테스트 알림',
      body: 'Part 3 구현 테스트 중입니다!',
      icon: '/images/icons/manifest-192x192.png',
      badge: '/images/icons/manifest-192x192.png'
    };
    
    // Web Push 구독 객체 생성
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      }
    };
    
    console.log('🚀 푸시 알림 발송 중...');
    const result = await webpush.sendNotification(
      pushSubscription, 
      JSON.stringify(payload)
    );
    
    console.log('✅ 푸시 알림 발송 성공!');
    console.log('📊 응답 상태:', result.statusCode);
    
  } catch (error) {
    if (error.statusCode === 410) {
      console.log('⚠️ 만료된 구독입니다. DB에서 제거해야 합니다.');
    } else {
      console.error('🚨 푸시 알림 발송 실패:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testPushNotification();