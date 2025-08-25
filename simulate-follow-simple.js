const { PrismaClient } = require('@prisma/client');
const webpush = require('web-push');
const prisma = new PrismaClient();

// VAPID 키 설정
webpush.setVapidDetails(
  'mailto:test@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function simulateFollowNotification() {
  try {
    console.log('👥 팔로우 알림 시뮬레이션...');
    
    // 1. 최신 구독자 정보 가져오기
    const subscription = await prisma.pushSubscription.findFirst({
      where: { userId: { not: null } },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!subscription) {
      console.log('❌ 구독자가 없습니다.');
      return;
    }
    
    // 2. 별도 쿼리로 사용자 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { id: subscription.userId },
      select: { nickname: true }
    });
    
    const followerNickname = 'bankai';
    const followedUser = user?.nickname || '사용자';
    
    console.log(`📱 "${followerNickname}"님이 "${followedUser}"님을 팔로우 (시뮬레이션)`);
    
    // 3. 팔로우 알림 페이로드 (실제 API와 동일)
    const payload = {
      title: '새로운 팔로워',
      body: `${followerNickname}님이 당신을 팔로우했습니다!`,
      icon: '/images/icons/notification-icon.png',
      data: {
        type: 'follow',
        userId: 'follower-user-id'
      }
    };
    
    // 4. 푸시 알림 발송
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      }
    };
    
    console.log('🚀 팔로우 알림 발송 중...');
    console.log('📋 알림 내용:', `"${payload.body}"`);
    
    const result = await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload)
    );
    
    console.log('✅ 팔로우 알림 발송 성공!');
    console.log('📊 응답 상태:', result.statusCode);
    console.log('📱 브라우저에서 팔로우 알림을 확인하세요!');
    
  } catch (error) {
    console.error('🚨 팔로우 알림 발송 실패:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

simulateFollowNotification();