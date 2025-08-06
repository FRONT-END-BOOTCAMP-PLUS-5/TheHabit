"use client";

import { useState, useEffect } from "react";
import { axiosInstance } from "@/libs/axios/axiosInstance";

interface ChallengeDto {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  color: string;
  userId: string;
  categoryId: number;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/api/challenges");
      setChallenges(response.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: { status?: number; data?: { message?: string } };
          message?: string;
        };
        setError(
          `HTTP error! status: ${axiosError.response?.status} - ${
            axiosError.response?.data?.message || axiosError.message
          }`
        );
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "시간 미설정";
    return new Date(timeString).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">챌린지 목록 테스트</h1>

      {/* API 테스트 버튼 */}
      <div className="mb-6">
        <button
          onClick={fetchChallenges}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "로딩 중..." : "API 다시 호출"}
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>오류:</strong> {error}
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">데이터를 불러오는 중...</p>
        </div>
      )}

      {/* 챌린지 목록 */}
      {!loading && !error && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            챌린지 개수: {challenges.length}개
          </h2>

          {challenges.length === 0 ? (
            <p className="text-gray-500">등록된 챌린지가 없습니다.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    borderLeftColor: challenge.color,
                    borderLeftWidth: "4px",
                  }}
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {challenge.name}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">기간:</span>{" "}
                      {formatDate(challenge.startDate)} ~{" "}
                      {formatDate(challenge.endDate)}
                    </div>

                    <div>
                      <span className="font-medium">시간:</span>{" "}
                      {formatTime(challenge.startTime)} ~{" "}
                      {formatTime(challenge.endTime)}
                    </div>

                    <div>
                      <span className="font-medium">색상:</span>
                      <span
                        className="inline-block w-4 h-4 rounded ml-2"
                        style={{ backgroundColor: challenge.color }}
                      ></span>
                    </div>

                    <div>
                      <span className="font-medium">카테고리 ID:</span>{" "}
                      {challenge.categoryId}
                    </div>

                    <div>
                      <span className="font-medium">사용자 ID:</span>
                      <span className="text-xs font-mono bg-gray-100 px-1 rounded">
                        {challenge.userId}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* API 응답 데이터 (개발용) */}
      {process.env.NODE_ENV === "development" && challenges.length > 0 && (
        <details className="mt-8">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            API 응답 데이터 보기 (개발용)
          </summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify(challenges, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
