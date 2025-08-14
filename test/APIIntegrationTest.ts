/**
 * API 통합 테스트
 * 실제 Next.js 서버를 통해 API 엔드포인트를 테스트합니다.
 */

const API_BASE_URL = 'http://localhost:3001/api';

interface TestResult {
  test: string;
  success: boolean;
  data?: any;
  error?: string;
}

const testResults: TestResult[] = [];

async function makeAPIRequest(method: string, endpoint: string, body?: any): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    throw new Error(`API 요청 실패: ${error}`);
  }
}

async function testRoutinesAPI() {
  console.log('\n=== 루틴 API 테스트 시작 ===');

  // 1. GET /api/routines - 전체 루틴 조회
  try {
    console.log('1. 전체 루틴 목록 조회 테스트');
    const response = await makeAPIRequest('GET', '/routines');

    if (response.ok) {
      console.log('✅ 전체 루틴 조회 성공');
      console.log(`- 상태코드: ${response.status}`);
      console.log(`- 루틴 개수: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`);
      testResults.push({ test: 'GET /api/routines', success: true, data: response.data });
    } else {
      console.log('❌ 전체 루틴 조회 실패');
      console.log(`- 상태코드: ${response.status}`);
      console.log(`- 에러: ${JSON.stringify(response.data)}`);
      testResults.push({ test: 'GET /api/routines', success: false, error: response.data });
    }
  } catch (error) {
    console.log('❌ 전체 루틴 조회 중 예외 발생:', error);
    testResults.push({ test: 'GET /api/routines', success: false, error: String(error) });
  }

  // 2. POST /api/routines - 루틴 생성
  try {
    console.log('\n2. 루틴 생성 테스트');
    const routineData = {
      routineTitle: 'API 테스트 루틴',
      alertTime: '2024-12-01T07:00:00Z',
      emoji: 1,
      challengeId: 1,
    };

    const response = await makeAPIRequest('POST', '/routines', routineData);

    if (response.ok) {
      console.log('✅ 루틴 생성 성공');
      console.log(`- 상태코드: ${response.status}`);
      console.log(`- 생성된 루틴 ID: ${response.data?.id}`);
      console.log(`- 루틴 제목: ${response.data?.routineTitle}`);
      testResults.push({ test: 'POST /api/routines', success: true, data: response.data });

      // 생성된 루틴 ID를 저장해서 다른 테스트에서 사용
      (global as any).testRoutineId = response.data?.id;
    } else {
      console.log('❌ 루틴 생성 실패');
      console.log(`- 상태코드: ${response.status}`);
      console.log(`- 에러: ${JSON.stringify(response.data)}`);
      testResults.push({ test: 'POST /api/routines', success: false, error: response.data });
    }
  } catch (error) {
    console.log('❌ 루틴 생성 중 예외 발생:', error);
    testResults.push({ test: 'POST /api/routines', success: false, error: String(error) });
  }

  // 3. GET /api/routines/[id] - 특정 루틴 조회
  const testRoutineId = (global as any).testRoutineId;
  if (testRoutineId) {
    try {
      console.log(`\n3. 특정 루틴 조회 테스트 (ID: ${testRoutineId})`);
      const response = await makeAPIRequest('GET', `/routines/${testRoutineId}`);

      if (response.ok) {
        console.log('✅ 특정 루틴 조회 성공');
        console.log(`- 상태코드: ${response.status}`);
        console.log(`- 루틴 제목: ${response.data?.routineTitle}`);
        testResults.push({
          test: `GET /api/routines/${testRoutineId}`,
          success: true,
          data: response.data,
        });
      } else {
        console.log('❌ 특정 루틴 조회 실패');
        console.log(`- 상태코드: ${response.status}`);
        console.log(`- 에러: ${JSON.stringify(response.data)}`);
        testResults.push({
          test: `GET /api/routines/${testRoutineId}`,
          success: false,
          error: response.data,
        });
      }
    } catch (error) {
      console.log('❌ 특정 루틴 조회 중 예외 발생:', error);
      testResults.push({
        test: `GET /api/routines/${testRoutineId}`,
        success: false,
        error: String(error),
      });
    }
  }

  // 4. PUT /api/routines/[id] - 루틴 수정
  if (testRoutineId) {
    try {
      console.log(`\n4. 루틴 수정 테스트 (ID: ${testRoutineId})`);
      const updateData = {
        routineTitle: '수정된 API 테스트 루틴',
        emoji: 2,
        alertTime: '2024-12-01T08:00:00Z',
      };

      const response = await makeAPIRequest('PUT', `/routines/${testRoutineId}`, updateData);

      if (response.ok) {
        console.log('✅ 루틴 수정 성공');
        console.log(`- 상태코드: ${response.status}`);
        console.log(`- 수정된 루틴 제목: ${response.data?.routineTitle}`);
        testResults.push({
          test: `PUT /api/routines/${testRoutineId}`,
          success: true,
          data: response.data,
        });
      } else {
        console.log('❌ 루틴 수정 실패');
        console.log(`- 상태코드: ${response.status}`);
        console.log(`- 에러: ${JSON.stringify(response.data)}`);
        testResults.push({
          test: `PUT /api/routines/${testRoutineId}`,
          success: false,
          error: response.data,
        });
      }
    } catch (error) {
      console.log('❌ 루틴 수정 중 예외 발생:', error);
      testResults.push({
        test: `PUT /api/routines/${testRoutineId}`,
        success: false,
        error: String(error),
      });
    }
  }
}

async function testRoutineCompletionsAPI() {
  console.log('\n=== 루틴 완료 API 테스트 시작 ===');

  const testRoutineId = (global as any).testRoutineId;
  if (!testRoutineId) {
    console.log('❌ 테스트 루틴 ID가 없어서 루틴 완료 테스트를 건너뜁니다.');
    return;
  }

  // 1. POST /api/routines/[id]/complete - 루틴 완료 처리
  try {
    console.log(`\n1. 루틴 완료 처리 테스트 (루틴 ID: ${testRoutineId})`);
    const completionData = {
      userId: 'test-api-user-12345',
      proofImgUrl: 'https://example.com/api-test-proof.jpg',
    };

    const response = await makeAPIRequest(
      'POST',
      `/routines/${testRoutineId}/complete`,
      completionData
    );

    if (response.ok) {
      console.log('✅ 루틴 완료 처리 성공');
      console.log(`- 상태코드: ${response.status}`);
      console.log(`- 완료 기록 ID: ${response.data?.id}`);
      testResults.push({
        test: `POST /api/routines/${testRoutineId}/complete`,
        success: true,
        data: response.data,
      });

      // 생성된 완료 기록 ID를 저장
      (global as any).testCompletionId = response.data?.id;
    } else {
      console.log('❌ 루틴 완료 처리 실패');
      console.log(`- 상태코드: ${response.status}`);
      console.log(`- 에러: ${JSON.stringify(response.data)}`);
      testResults.push({
        test: `POST /api/routines/${testRoutineId}/complete`,
        success: false,
        error: response.data,
      });
    }
  } catch (error) {
    console.log('❌ 루틴 완료 처리 중 예외 발생:', error);
    testResults.push({
      test: `POST /api/routines/${testRoutineId}/complete`,
      success: false,
      error: String(error),
    });
  }

  // 2. GET /api/routines/[id]/complete - 루틴 완료 목록 조회
  try {
    console.log(`\n2. 루틴 완료 목록 조회 테스트 (루틴 ID: ${testRoutineId})`);
    const response = await makeAPIRequest('GET', `/routines/${testRoutineId}/complete`);

    if (response.ok) {
      console.log('✅ 루틴 완료 목록 조회 성공');
      console.log(`- 상태코드: ${response.status}`);
      console.log(
        `- 완료 기록 개수: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`
      );
      testResults.push({
        test: `GET /api/routines/${testRoutineId}/complete`,
        success: true,
        data: response.data,
      });
    } else {
      console.log('❌ 루틴 완료 목록 조회 실패');
      console.log(`- 상태코드: ${response.status}`);
      console.log(`- 에러: ${JSON.stringify(response.data)}`);
      testResults.push({
        test: `GET /api/routines/${testRoutineId}/complete`,
        success: false,
        error: response.data,
      });
    }
  } catch (error) {
    console.log('❌ 루틴 완료 목록 조회 중 예외 발생:', error);
    testResults.push({
      test: `GET /api/routines/${testRoutineId}/complete`,
      success: false,
      error: String(error),
    });
  }

  // 3. 특정 사용자의 완료 기록 조회
  try {
    console.log(`\n3. 특정 사용자의 루틴 완료 기록 조회 테스트`);
    const response = await makeAPIRequest(
      'GET',
      `/routines/${testRoutineId}/complete?userId=test-api-user-12345`
    );

    if (response.ok) {
      console.log('✅ 특정 사용자의 완료 기록 조회 성공');
      console.log(`- 상태코드: ${response.status}`);
      console.log(
        `- 완료 기록 개수: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`
      );
      testResults.push({
        test: `GET /api/routines/${testRoutineId}/complete?userId=test-api-user-12345`,
        success: true,
        data: response.data,
      });
    } else {
      console.log('❌ 특정 사용자의 완료 기록 조회 실패');
      console.log(`- 상태코드: ${response.status}`);
      console.log(`- 에러: ${JSON.stringify(response.data)}`);
      testResults.push({
        test: `GET /api/routines/${testRoutineId}/complete?userId=test-api-user-12345`,
        success: false,
        error: response.data,
      });
    }
  } catch (error) {
    console.log('❌ 특정 사용자의 완료 기록 조회 중 예외 발생:', error);
    testResults.push({
      test: `GET /api/routines/${testRoutineId}/complete?userId=test-api-user-12345`,
      success: false,
      error: String(error),
    });
  }
}

function printTestSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('           API 테스트 결과 요약');
  console.log('='.repeat(50));

  const successCount = testResults.filter(r => r.success).length;
  const totalCount = testResults.length;

  console.log(`총 테스트 수: ${totalCount}`);
  console.log(`성공: ${successCount}`);
  console.log(`실패: ${totalCount - successCount}`);
  console.log(`성공률: ${totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0}%`);

  console.log('\n상세 결과:');
  testResults.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.test}`);
    if (!result.success && result.error) {
      console.log(`   에러: ${result.error}`);
    }
  });

  console.log('\n' + '='.repeat(50));
}

async function main() {
  console.log('🚀 API 통합 테스트를 시작합니다...');
  console.log('서버가 http://localhost:3000에서 실행 중이어야 합니다.');

  // 서버 연결 확인
  try {
    const healthCheck = await fetch(`${API_BASE_URL.replace('/api', '')}`);
    if (!healthCheck.ok) {
      throw new Error('서버 응답 불량');
    }
    console.log('✅ 서버 연결 확인됨');
  } catch (error) {
    console.log("❌ 서버에 연결할 수 없습니다. 'bun run dev'로 서버를 시작해주세요.");
    console.log('에러:', error);
    return;
  }

  // API 테스트 실행
  await testRoutinesAPI();
  await testRoutineCompletionsAPI();

  // 결과 요약 출력
  printTestSummary();
}

// Node.js 환경에서 실행
if (typeof window === 'undefined') {
  main().catch(console.error);
}

export { main as runAPITests };
