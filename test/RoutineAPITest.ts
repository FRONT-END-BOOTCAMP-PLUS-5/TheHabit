/**
 * Routine API 전체 기능 테스트
 * CRUD 모든 기능을 체계적으로 테스트합니다.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const API_BASE = 'http://localhost:3001/api';

interface TestResult {
  endpoint: string;
  method: string;
  success: boolean;
  status?: number;
  data?: any;
  error?: string;
}

let testResults: TestResult[] = [];

async function makeRequest(method: string, endpoint: string, data?: any): Promise<TestResult> {
  try {
    let curlCommand = `curl -s -w "\\n%{http_code}" -X ${method} "${API_BASE}${endpoint}"`;

    if (data) {
      curlCommand += ` -H "Content-Type: application/json" -d '${JSON.stringify(data)}'`;
    }

    console.log(`\n🔍 ${method} ${endpoint}`);
    if (data) console.log(`📄 데이터:`, JSON.stringify(data, null, 2));

    const { stdout, stderr } = await execAsync(curlCommand);

    if (stderr) {
      const result: TestResult = {
        endpoint,
        method,
        success: false,
        error: stderr,
      };
      console.log(`❌ 네트워크 에러: ${stderr}`);
      return result;
    }

    // 응답과 상태코드 분리
    const lines = stdout.trim().split('\n');
    const statusCode = parseInt(lines[lines.length - 1]);
    const responseBody = lines.slice(0, -1).join('\n');

    let parsedResponse;
    try {
      parsedResponse = responseBody ? JSON.parse(responseBody) : null;
    } catch (e) {
      parsedResponse = responseBody;
    }

    const result: TestResult = {
      endpoint,
      method,
      success: statusCode >= 200 && statusCode < 300,
      status: statusCode,
      data: parsedResponse,
    };

    if (result.success) {
      console.log(`✅ 성공 (${statusCode})`);
      if (parsedResponse) {
        console.log(
          `📋 응답:`,
          typeof parsedResponse === 'string'
            ? parsedResponse
            : JSON.stringify(parsedResponse, null, 2)
        );
      }
    } else {
      console.log(`❌ 실패 (${statusCode})`);
      console.log(
        `📋 응답:`,
        typeof parsedResponse === 'string'
          ? parsedResponse
          : JSON.stringify(parsedResponse, null, 2)
      );
    }

    return result;
  } catch (error) {
    const result: TestResult = {
      endpoint,
      method,
      success: false,
      error: String(error),
    };
    console.log(`❌ 실행 에러:`, error);
    return result;
  }
}

async function testRoutinesCRUD() {
  console.log('\n' + '='.repeat(60));
  console.log('               ROUTINE API CRUD 테스트');
  console.log('='.repeat(60));

  let createdRoutineId: number | null = null;

  // 1. CREATE - 루틴 생성 (잘못된 데이터)
  console.log('\n=== 1. CREATE 테스트 - 잘못된 데이터 ===');
  let result = await makeRequest('POST', '/routines', {
    routineTitle: '테스트 루틴',
    // challengeId, emoji 누락
  });
  testResults.push(result);

  // 2. CREATE - 루틴 생성 (존재하지 않는 challengeId)
  console.log('\n=== 2. CREATE 테스트 - 존재하지 않는 challengeId ===');
  result = await makeRequest('POST', '/routines', {
    routineTitle: '존재하지 않는 챌린지 루틴',
    alertTime: '2024-12-01T07:00:00Z',
    emoji: 1,
    challengeId: 99999,
  });
  testResults.push(result);

  // 3. READ - 전체 루틴 목록 조회
  console.log('\n=== 3. READ 테스트 - 전체 루틴 목록 ===');
  result = await makeRequest('GET', '/routines');
  testResults.push(result);

  // 4. READ - 챌린지별 루틴 조회
  console.log('\n=== 4. READ 테스트 - 챌린지별 루틴 ===');
  result = await makeRequest('GET', '/routines?challengeId=1');
  testResults.push(result);

  // 5. READ - 사용자별 루틴 조회
  console.log('\n=== 5. READ 테스트 - 사용자별 루틴 ===');
  result = await makeRequest('GET', '/routines?userId=88b3e620-52d9-4a5c-bb2b-1dfc9a2d1a10');
  testResults.push(result);

  // 6. READ - 존재하지 않는 루틴 조회
  console.log('\n=== 6. READ 테스트 - 존재하지 않는 루틴 ===');
  result = await makeRequest('GET', '/routines/99999');
  testResults.push(result);

  // 7. READ - 잘못된 ID 형식
  console.log('\n=== 7. READ 테스트 - 잘못된 ID 형식 ===');
  result = await makeRequest('GET', '/routines/invalid-id');
  testResults.push(result);

  // 8. UPDATE - 존재하지 않는 루틴 수정
  console.log('\n=== 8. UPDATE 테스트 - 존재하지 않는 루틴 ===');
  result = await makeRequest('PUT', '/routines/99999', {
    routineTitle: '수정된 루틴',
    emoji: 2,
  });
  testResults.push(result);

  // 9. UPDATE - 잘못된 ID 형식
  console.log('\n=== 9. UPDATE 테스트 - 잘못된 ID 형식 ===');
  result = await makeRequest('PUT', '/routines/invalid-id', {
    routineTitle: '수정된 루틴',
  });
  testResults.push(result);

  // 10. DELETE - 존재하지 않는 루틴 삭제
  console.log('\n=== 10. DELETE 테스트 - 존재하지 않는 루틴 ===');
  result = await makeRequest('DELETE', '/routines/99999');
  testResults.push(result);

  // 11. DELETE - 잘못된 ID 형식
  console.log('\n=== 11. DELETE 테스트 - 잘못된 ID 형식 ===');
  result = await makeRequest('DELETE', '/routines/invalid-id');
  testResults.push(result);
}

async function testRoutineCompletionsAPI() {
  console.log('\n' + '='.repeat(60));
  console.log('           ROUTINE COMPLETIONS API 테스트');
  console.log('='.repeat(60));

  // 1. 루틴 완료 - 존재하지 않는 루틴
  console.log('\n=== 1. 루틴 완료 - 존재하지 않는 루틴 ===');
  let result = await makeRequest('POST', '/routines/99999/complete', {
    userId: 'test-user-12345',
    proofImgUrl: 'https://example.com/proof.jpg',
  });
  testResults.push(result);

  // 2. 루틴 완료 - 필수 필드 누락
  console.log('\n=== 2. 루틴 완료 - 필수 필드 누락 ===');
  result = await makeRequest('POST', '/routines/1/complete', {
    proofImgUrl: 'https://example.com/proof.jpg',
    // userId 누락
  });
  testResults.push(result);

  // 3. 루틴 완료 - 잘못된 루틴 ID 형식
  console.log('\n=== 3. 루틴 완료 - 잘못된 ID 형식 ===');
  result = await makeRequest('POST', '/routines/invalid-id/complete', {
    userId: 'test-user-12345',
    proofImgUrl: 'https://example.com/proof.jpg',
  });
  testResults.push(result);

  // 4. 루틴 완료 목록 조회 - 존재하지 않는 루틴
  console.log('\n=== 4. 완료 목록 조회 - 존재하지 않는 루틴 ===');
  result = await makeRequest('GET', '/routines/99999/complete');
  testResults.push(result);

  // 5. 루틴 완료 목록 조회 - 사용자 필터
  console.log('\n=== 5. 완료 목록 조회 - 사용자 필터 ===');
  result = await makeRequest('GET', '/routines/1/complete?userId=test-user-12345');
  testResults.push(result);

  // 6. 루틴 완료 목록 조회 - 잘못된 ID 형식
  console.log('\n=== 6. 완료 목록 조회 - 잘못된 ID 형식 ===');
  result = await makeRequest('GET', '/routines/invalid-id/complete');
  testResults.push(result);
}

function analyzeTestResults() {
  console.log('\n' + '='.repeat(70));
  console.log('                     테스트 결과 분석');
  console.log('='.repeat(70));

  const totalTests = testResults.length;
  const successfulTests = testResults.filter(r => r.success).length;
  const failedTests = totalTests - successfulTests;

  console.log(`📊 총 테스트 수: ${totalTests}`);
  console.log(`✅ 성공: ${successfulTests}`);
  console.log(`❌ 실패: ${failedTests}`);
  console.log(`📈 성공률: ${Math.round((successfulTests / totalTests) * 100)}%`);

  console.log('\n=== 상세 결과 ===');

  // 상태코드별 분류
  const statusCodes = new Map<number, number>();
  testResults.forEach(result => {
    if (result.status) {
      statusCodes.set(result.status, (statusCodes.get(result.status) || 0) + 1);
    }
  });

  console.log('\n📈 HTTP 상태코드 분포:');
  Array.from(statusCodes.entries())
    .sort()
    .forEach(([code, count]) => {
      const emoji = code >= 200 && code < 300 ? '✅' : code >= 400 && code < 500 ? '⚠️' : '❌';
      console.log(`  ${emoji} ${code}: ${count}회`);
    });

  console.log('\n📋 각 테스트 결과:');
  testResults.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    const statusCode = result.status ? ` (${result.status})` : '';
    console.log(
      `${(index + 1).toString().padStart(2)}. ${status} ${result.method} ${result.endpoint}${statusCode}`
    );

    if (!result.success && result.error) {
      console.log(`    🔍 에러: ${result.error}`);
    }

    // 예상된 실패인지 확인
    if (!result.success && result.status) {
      if (result.status === 400 || result.status === 404) {
        console.log(`    ℹ️  예상된 에러 (올바른 에러 처리)`);
      } else if (result.status === 500) {
        console.log(`    ⚠️  서버 에러 (데이터베이스 문제 가능성)`);
      }
    }
  });

  console.log('\n' + '='.repeat(70));
}

async function main() {
  console.log('🚀 Routine API 전체 기능 테스트 시작');
  console.log('서버: http://localhost:3001');

  // 서버 연결 확인
  try {
    const healthCheck = await execAsync(`curl -s http://localhost:3001`);
    console.log('✅ 서버 연결 확인');
  } catch (error) {
    console.log("❌ 서버 연결 실패. 'bun run dev'로 서버를 시작해주세요.");
    return;
  }

  // 테스트 실행
  await testRoutinesCRUD();
  await testRoutineCompletionsAPI();

  // 결과 분석
  analyzeTestResults();
}

main().catch(console.error);
