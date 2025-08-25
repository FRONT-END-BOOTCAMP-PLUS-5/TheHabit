const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function manualFollowTest() {
  try {
    console.log('🔍 사용자 목록 조회...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nickname: true,
        _count: {
          select: {
            completions: true // 푸시 구독 대신 완료된 루틴 개수로 활성 사용자 확인
          }
        }
      },
      take: 5
    });
    
    console.log('👥 사용자 목록:');
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.nickname} (${user.id.substring(0, 8)}...)`);
    });
    
    if (users.length < 2) {
      console.log('❌ 테스트를 위해 최소 2명의 사용자가 필요합니다.');
      return;
    }
    
    console.log('');
    console.log('📋 팔로우 알림 테스트 방법:');
    console.log('');
    console.log('1️⃣ 먼저 팔로우 받을 사용자로 로그인하여 /test-push에서 푸시 구독');
    console.log('2️⃣ 그 다음 아래 curl 명령어로 팔로우 실행:');
    console.log('');
    
    const [follower, followee] = users;
    
    console.log('🌟 추천 테스트:');
    console.log(`   팔로우 하는 사람: ${follower.nickname}`);
    console.log(`   팔로우 받는 사람: ${followee.nickname}`);
    console.log('');
    
    const curlCommand = `curl -X POST http://localhost:3000/api/friends/following/test \\
  -H "Content-Type: application/json" \\
  -d '{
    "fromUserId": "${follower.id}",
    "toUserId": "${followee.id}"
  }'`;
    
    console.log('📋 실행할 명령어:');
    console.log(curlCommand);
    console.log('');
    console.log('💡 결과:');
    console.log(`   - ${followee.nickname}님에게 "${follower.nickname}님이 당신을 팔로우했습니다!" 알림 발송`);
    console.log('   - 브라우저나 운영체제 알림으로 표시됨');
    
  } catch (error) {
    console.error('🚨 오류:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

manualFollowTest();