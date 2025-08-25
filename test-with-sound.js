const { PrismaClient } = require('@prisma/client');
const webpush = require('web-push');
const { exec } = require('child_process');
const prisma = new PrismaClient();

webpush.setVapidDetails(
  'mailto:test@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function testWithSound() {
  try {
    console.log('🎵 소리와 함께 푸시 알림 테스트...');
    
    const subscription = await prisma.pushSubscription.findFirst({
      where: { userId: { not: null } },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!subscription) {
      console.log('❌ 구독 정보 없음');
      return;
    }
    
    // 1. 소리로 알림 (시스템 벨)
    console.log('🔊 시스템 벨 소리...');
    process.stdout.write('\x07');
    
    // 2. 터미널에 큰 글씨로 표시
    console.log('\n'.repeat(5));
    console.log('🚨'.repeat(20));
    console.log('    🎯 PUSH 알림 발송 중!    ');
    console.log('🚨'.repeat(20));
    console.log('\n');
    
    // 3. 실제 푸시 알림 발송
    const payload = {
      title: '🧪 TEST: 알림 확인용',
      body: 'TheHabit 푸시 알림이 정상 발송되었습니다!',
      icon: '/images/icons/notification-icon.png'
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
    
    console.log('✅ 푸시 알림 발송 완료! (상태:', result.statusCode, ')');
    
    // 4. macOS 시스템 알림으로도 발송
    exec(`osascript -e 'display notification "푸시 알림이 발송되었습니다!" with title "TheHabit 테스트"'`);
    
    console.log('');
    console.log('📋 확인 사항:');
    console.log('1. 벨 소리가 들렸나요?');
    console.log('2. macOS 우상단에 시스템 알림이 떴나요?');
    console.log('3. Chrome 푸시 알림이 추가로 떴나요?');
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testWithSound();