"use client";

import { useState } from "react";
import {
  useGetAllChallenges,
  useGetChallengeById,
  useGetChallengesByCategory,
  useCreateChallenge,
  useUpdateChallenge,
  useDeleteChallenge,
} from "@/libs/hooks/challenges-hooks";
import { AddChallengeRequestDto } from "@/backend/challenges/applications/dtos/AddChallengeDto";

interface ChallengeDto {
  id: number;
  name: string;
  created_at: string; // startDate → created_at
  end_at: string; // endDate → end_at
  startTime: string | null;
  endTime: string | null;
  color: string;
  userId: string;
  categoryId: number;
}

interface CreateChallengeForm {
  name: string;
  created_at: string;
  end_at: string;
  startTime: string;
  endTime: string;
  color: string;
  categoryId: number;
}

export default function ChallengesPage() {
  // 카테고리별 조회 상태
  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  // 특정 챌린지 조회 상태
  const [selectedChallenge, setSelectedChallenge] =
    useState<ChallengeDto | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number>(1);

  // 수정 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<CreateChallengeForm>({
    name: "",
    created_at: "",
    end_at: "",
    startTime: "",
    endTime: "",
    color: "#3B82F6",
    categoryId: 1,
  });

  // 챌린지 생성 폼 상태
  const [formData, setFormData] = useState<CreateChallengeForm>({
    name: "",
    created_at: new Date().toISOString().split("T")[0],
    end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30일 후
    startTime: "06:00",
    endTime: "07:00",
    color: "#3B82F6",
    categoryId: 1,
  });

  // Tanstack Query 훅들 사용
  const {
    data: challenges = [],
    isLoading: loading,
    error: challengesError,
    refetch: refetchChallenges,
  } = useGetAllChallenges();

  const {
    data: categoryChallengesData,
    isLoading: categoryLoading,
    error: categoryError,
    refetch: refetchCategoryChallenges,
  } = useGetChallengesByCategory(selectedCategory);

  const {
    data: challengeDetailData,
    isLoading: detailLoading,
    error: detailError,
    refetch: refetchChallengeDetail,
  } = useGetChallengeById(selectedChallengeId, selectedChallengeId > 0);

  const createChallengeMutation = useCreateChallenge();
  const updateChallengeMutation = useUpdateChallenge();
  const deleteChallengeMutation = useDeleteChallenge();

  // 카테고리별 챌린지 데이터 추출
  const categoryChallenges = categoryChallengesData?.data || [];

  // 특정 챌린지 데이터 추출
  const challengeDetail = challengeDetailData?.data;

  // 챌린지 생성
  const createChallenge = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData: AddChallengeRequestDto = {
      id: 0, // 서버에서 생성
      ...formData,
      created_at: new Date(formData.created_at).toISOString(),
      end_at: new Date(formData.end_at).toISOString(),
      startTime: formData.startTime
        ? new Date(`2000-01-01T${formData.startTime}`).toISOString()
        : null,
      endTime: formData.endTime
        ? new Date(`2000-01-01T${formData.endTime}`).toISOString()
        : null,
    };

    createChallengeMutation.mutate(requestData, {
      onSuccess: () => {
        // 폼 초기화
        setFormData({
          name: "",
          created_at: new Date().toISOString().split("T")[0],
          end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          startTime: "06:00",
          endTime: "07:00",
          color: "#3B82F6",
          categoryId: 1,
        });
      },
    });
  };

  // 챌린지 수정
  const updateChallenge = async (id: number) => {
    const requestData = {
      ...editFormData,
      created_at: new Date(editFormData.created_at).toISOString(),
      end_at: new Date(editFormData.end_at).toISOString(),
      startTime: editFormData.startTime
        ? new Date(`2000-01-01T${editFormData.startTime}`).toISOString()
        : null,
      endTime: editFormData.endTime
        ? new Date(`2000-01-01T${editFormData.endTime}`).toISOString()
        : null,
    };

    updateChallengeMutation.mutate(
      { id, data: requestData },
      {
        onSuccess: () => {
          setIsEditMode(false);
        },
      }
    );
  };

  // 챌린지 삭제
  const deleteChallenge = async (id: number) => {
    if (!confirm("정말로 이 챌린지를 삭제하시겠습니까?")) {
      return;
    }

    deleteChallengeMutation.mutate(id, {
      onSuccess: () => {
        setSelectedChallenge(null);
        setIsEditMode(false);
      },
    });
  };

  // 특정 챌린지 조회
  const fetchChallengeById = async (id: number) => {
    setSelectedChallengeId(id);
    // useGetChallengeById 훅이 자동으로 실행됩니다
  };

  // 카테고리 변경
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value, 10);
    setSelectedCategory(categoryId);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChallengeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.value, 10);
    setSelectedChallengeId(id);
  };

  // 챌린지 상세 정보가 변경될 때 수정 폼 데이터 업데이트
  const handleChallengeDetailChange = () => {
    if (challengeDetail) {
      setSelectedChallenge(challengeDetail);
      setEditFormData({
        name: challengeDetail.name,
        created_at: challengeDetail.created_at.split("T")[0],
        end_at: challengeDetail.end_at.split("T")[0],
        startTime: challengeDetail.startTime
          ? new Date(challengeDetail.startTime).toTimeString().slice(0, 5)
          : "",
        endTime: challengeDetail.endTime
          ? new Date(challengeDetail.endTime).toTimeString().slice(0, 5)
          : "",
        color: challengeDetail.color,
        categoryId: challengeDetail.categoryId,
      });
    }
  };

  // challengeDetail이 변경될 때마다 실행
  if (challengeDetail && selectedChallenge?.id !== challengeDetail.id) {
    handleChallengeDetailChange();
  }

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

  const renderChallengeCard = (challenge: ChallengeDto) => (
    <div
      key={challenge.id}
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
      style={{
        borderLeftColor: challenge.color,
        borderLeftWidth: "4px",
      }}
    >
      <h3 className="font-semibold text-lg mb-2">{challenge.name}</h3>

      <div className="space-y-2 text-sm text-gray-600">
        <div>
          <span className="font-medium">기간:</span>{" "}
          {formatDate(challenge.created_at)} ~ {formatDate(challenge.end_at)}
        </div>

        <div>
          <span className="font-medium">시간:</span>{" "}
          {formatTime(challenge.startTime)} ~ {formatTime(challenge.endTime)}
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

      {/* 챌린지 액션 버튼 */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => fetchChallengeById(challenge.id)}
          className="bg-blue-500 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
        >
          상세보기
        </button>
        <button
          onClick={() => {
            fetchChallengeById(challenge.id);
            setIsEditMode(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-700 text-white text-xs px-2 py-1 rounded"
        >
          수정
        </button>
        <button
          onClick={() => deleteChallenge(challenge.id)}
          disabled={deleteChallengeMutation.isPending}
          className="bg-red-500 hover:bg-red-700 text-white text-xs px-2 py-1 rounded disabled:opacity-50"
        >
          {deleteChallengeMutation.isPending ? "삭제중..." : "삭제"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">챌린지 관리 테스트</h1>

      {/* 챌린지 생성 폼 */}
      <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">새 챌린지 생성</h2>

        <form onSubmit={createChallenge} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                챌린지 이름 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 매일 운동하기"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                색상
              </label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작 날짜 *
              </label>
              <input
                type="date"
                name="created_at"
                value={formData.created_at}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료 날짜 *
              </label>
              <input
                type="date"
                name="end_at"
                value={formData.end_at}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작 시간
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료 시간
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리 ID
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>운동</option>
                <option value={2}>학습</option>
                <option value={3}>독서</option>
                <option value={4}>기타</option>
              </select>
            </div>
          </div>

          {/* 성공/에러 메시지 */}
          {createChallengeMutation.isSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              챌린지가 성공적으로 생성되었습니다!
            </div>
          )}

          {createChallengeMutation.isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>오류:</strong>{" "}
              {createChallengeMutation.error?.message ||
                "챌린지 생성에 실패했습니다."}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createChallengeMutation.isPending}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {createChallengeMutation.isPending ? "생성 중..." : "챌린지 생성"}
            </button>

            <button
              type="button"
              onClick={() => refetchChallenges()}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? "로딩 중..." : "목록 새로고침"}
            </button>
          </div>
        </form>
      </div>

      {/* 특정 챌린지 조회/수정/삭제 */}
      <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">특정 챌린지 관리</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            챌린지 ID
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={selectedChallengeId}
              onChange={handleChallengeIdChange}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            <button
              onClick={() => fetchChallengeById(selectedChallengeId)}
              disabled={detailLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {detailLoading ? "조회중..." : "조회"}
            </button>
          </div>
        </div>

        {/* 상세 조회 결과 */}
        {challengeDetail && !isEditMode && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-lg mb-4">챌린지 상세 정보</h3>
            {renderChallengeCard(challengeDetail)}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsEditMode(true)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded"
              >
                수정 모드
              </button>
            </div>
          </div>
        )}

        {/* 수정 모드 */}
        {challengeDetail && isEditMode && (
          <div className="border rounded-lg p-4 bg-yellow-50">
            <h3 className="font-semibold text-lg mb-4">챌린지 수정</h3>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    챌린지 이름 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    색상
                  </label>
                  <input
                    type="color"
                    name="color"
                    value={editFormData.color}
                    onChange={handleEditInputChange}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    시작 날짜 *
                  </label>
                  <input
                    type="date"
                    name="created_at"
                    value={editFormData.created_at}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    종료 날짜 *
                  </label>
                  <input
                    type="date"
                    name="end_at"
                    value={editFormData.end_at}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    시작 시간
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={editFormData.startTime}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    종료 시간
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={editFormData.endTime}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리 ID
                  </label>
                  <select
                    name="categoryId"
                    value={editFormData.categoryId}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>운동</option>
                    <option value={2}>학습</option>
                    <option value={3}>독서</option>
                    <option value={4}>기타</option>
                  </select>
                </div>
              </div>

              {/* 수정 성공/에러 메시지 */}
              {updateChallengeMutation.isSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  챌린지가 성공적으로 수정되었습니다!
                </div>
              )}

              {updateChallengeMutation.isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <strong>오류:</strong>{" "}
                  {updateChallengeMutation.error?.message ||
                    "챌린지 수정에 실패했습니다."}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => updateChallenge(challengeDetail.id)}
                  disabled={updateChallengeMutation.isPending}
                  className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {updateChallengeMutation.isPending
                    ? "수정중..."
                    : "수정 완료"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 에러 메시지 */}
        {detailError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>오류:</strong>{" "}
            {detailError.message || "챌린지 조회에 실패했습니다."}
          </div>
        )}

        {/* 삭제 성공/에러 메시지 */}
        {deleteChallengeMutation.isSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            챌린지가 성공적으로 삭제되었습니다!
          </div>
        )}

        {deleteChallengeMutation.isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>오류:</strong>{" "}
            {deleteChallengeMutation.error?.message ||
              "챌린지 삭제에 실패했습니다."}
          </div>
        )}
      </div>

      {/* 카테고리별 챌린지 조회 */}
      <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">카테고리별 챌린지 조회</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리 선택
          </label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>운동</option>
            <option value={2}>학습</option>
            <option value={3}>독서</option>
            <option value={4}>기타</option>
          </select>
        </div>

        {/* 카테고리별 에러 메시지 */}
        {categoryError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>오류:</strong>{" "}
            {categoryError.message || "카테고리별 조회에 실패했습니다."}
          </div>
        )}

        {/* 카테고리별 로딩 상태 */}
        {categoryLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">카테고리별 데이터를 불러오는 중...</p>
          </div>
        )}

        {/* 카테고리별 챌린지 목록 */}
        {!categoryLoading && !categoryError && (
          <div>
            <p className="text-gray-600 mb-4">
              카테고리 {selectedCategory}의 챌린지: {categoryChallenges.length}
              개
            </p>

            {categoryChallenges.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                해당 카테고리에 등록된 챌린지가 없습니다.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryChallenges.map(renderChallengeCard)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 전체 챌린지 목록 */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">전체 챌린지 목록</h2>

        {/* 에러 메시지 */}
        {challengesError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>오류:</strong>{" "}
            {challengesError.message || "챌린지 목록 조회에 실패했습니다."}
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
        {!loading && !challengesError && (
          <div>
            <p className="text-gray-600 mb-4">
              총 {challenges.length}개의 챌린지가 있습니다.
            </p>

            {challenges.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                등록된 챌린지가 없습니다.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {challenges.map(renderChallengeCard)}
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
    </div>
  );
}
