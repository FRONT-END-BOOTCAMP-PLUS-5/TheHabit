/**
 * 간단한 API 테스트 - curl 명령어를 사용한 테스트
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const API_BASE = 'http://localhost:3001/api';

async function testAPI(method: string, endpoint: string, data?: any) {
  try {
    let curlCommand = `curl -s -X ${method} "${API_BASE}${endpoint}"`;

    if (data) {
      curlCommand += ` -H "Content-Type: application/json" -d '${JSON.stringify(data)}'`;
    }

    console.log(`\n🔍 테스트: ${method} ${endpoint}`);
    console.log(`명령어: ${curlCommand}`);

    const { stdout, stderr } = await execAsync(curlCommand);

    if (stderr) {
      console.log(`❌ 에러: ${stderr}`);
      return;
    }

    try {
      const response = JSON.parse(stdout);
      console.log(`✅ 응답:`, response);
      return response;
    } catch (e) {
      console.log(`✅ 응답 (Raw):`, stdout);
      return stdout;
    }
  } catch (error) {
    console.log(`❌ 실행 에러:`, error);
  }
}

async function main() {
  console.log('🚀 Simple API 테스트 시작');
  console.log('서버: http://localhost:3001');

  // 1. 기본 연결 확인
  console.log('\n=== 1. 서버 연결 확인 ===');
  await execAsync(`curl -s http://localhost:3001`).then(
    () => console.log('✅ 서버 연결 확인'),
    error => console.log('❌ 서버 연결 실패:', error.message)
  );

  // 2. 루틴 목록 조회 (GET)
  console.log('\n=== 2. 루틴 목록 조회 ===');
  await testAPI('GET', '/routines');

  // 3. 챌린지별 루틴 조회
  console.log('\n=== 3. 챌린지별 루틴 조회 ===');
  await testAPI('GET', '/routines?challengeId=1');

  // 4. 사용자별 루틴 조회
  console.log('\n=== 4. 사용자별 루틴 조회 ===');
  await testAPI('GET', '/routines?userId=test-user');

  // 5. 존재하지 않는 루틴 조회
  console.log('\n=== 5. 존재하지 않는 루틴 조회 ===');
  await testAPI('GET', '/routines/99999');

  // 6. 잘못된 루틴 생성 요청 (필수 필드 누락)
  console.log('\n=== 6. 잘못된 루틴 생성 요청 ===');
  await testAPI('POST', '/routines', { routineTitle: '테스트 루틴' });

  console.log('\n🎉 Simple API 테스트 완료');
}

main().catch(console.error);
