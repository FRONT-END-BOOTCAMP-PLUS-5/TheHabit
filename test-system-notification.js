// macOS 알림 시스템 테스트
const { exec } = require('child_process');

console.log('🔍 macOS 알림 시스템 테스트...');

// 1. osascript를 사용한 시스템 알림
console.log('📤 macOS 시스템 알림 발송...');

const command = `osascript -e 'display notification "이것은 시스템 알림 테스트입니다!" with title "TheHabit 테스트"'`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ 시스템 알림 실패:', error.message);
    console.log('💡 다른 방법으로 테스트해보겠습니다...');
    testTerminalNotification();
  } else {
    console.log('✅ 시스템 알림 발송됨!');
    console.log('📱 macOS 알림 센터(우상단)를 확인하세요!');
  }
});

function testTerminalNotification() {
  console.log('🔔 터미널 벨 소리 테스트...');
  process.stdout.write('\x07'); // 벨 소리
  console.log('🔊 "벨" 소리가 들렸나요?');
}

// 5초 후 추가 테스트
setTimeout(() => {
  console.log('');
  console.log('📋 Chrome 알림 설정 재확인 방법:');
  console.log('1. 시스템 환경설정 → 알림');
  console.log('2. "Google Chrome"과 "Google Chrome Helper (Alerts)" 둘 다 찾기');
  console.log('3. 둘 다 알림 허용 체크');
  console.log('4. 알림 스타일을 "배너" 또는 "경고"로 설정');
  console.log('5. "잠금 화면에 표시" 체크');
  console.log('');
  console.log('💡 Chrome을 완전히 종료 후 재시작해보세요!');
}, 5000);