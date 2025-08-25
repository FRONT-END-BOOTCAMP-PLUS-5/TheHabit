const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simulateFollowNotification() {
  try {
    console.log('👥 팔로우 알림 테스트 시작...');
    
    // 1. 사용자 2명 조회 (팔로우 할 사람, 팔로우 받을 사람)
    const users = await prisma.user.findMany({
      take: 2,
      select: {
        id: true,
        nickname: true
      }
    });
    
    if (users.length < 2) {
      console.log('❌ 테스트를 위해 최소 2명의 사용자가 필요합니다.');
      return;
    }
    
    const [follower, followee] = users;
    console.log('👤 팔로우 하는 사람:', follower.nickname, `(${follower.id})`);
    console.log('👤 팔로우 받는 사람:', followee.nickname, `(${followee.id})`);
    
    // 2. 팔로우 받을 사람의 푸시 구독 확인
    const subscription = await prisma.pushSubscription.findFirst({
      where: { userId: followee.id }
    });
    
    if (!subscription) {
      console.log(`❌ ${followee.nickname}님이 푸시 알림을 구독하지 않았습니다.`);
      console.log('💡 먼저 해당 사용자로 로그인하여 /test-push에서 구독하세요.');
      return;
    }
    
    console.log('✅ 푸시 구독이 확인되었습니다.');
    
    // 3. 팔로우 API 호출 시뮬레이션
    console.log('🚀 팔로우 API 호출 중...');
    
    const response = await fetch('http://localhost:3000/api/friends/following/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fromUserId: follower.id,
        toUserId: followee.id
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ 팔로우 성공!');
      console.log('📱 푸시 알림이 발송되었습니다!');
      console.log('💬 알림 내용: "' + follower.nickname + '님이 당신을 팔로우했습니다!"');
      console.log('');
      console.log('🔍 브라우저 또는 운영체제 알림을 확인하세요!');
    } else {
      console.log('❌ 팔로우 실패:', result.error?.message);
    }
    
  } catch (error) {
    console.error('🚨 테스트 중 오류:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

simulateFollowNotification();