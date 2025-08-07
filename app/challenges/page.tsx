"use client";

import { useState, useEffect } from "react";
import { axiosInstance } from "@/libs/axios/axiosInstance";

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
  const [challenges, setChallenges] = useState<ChallengeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // 카테고리별 조회 상태
  const [categoryChallenges, setCategoryChallenges] = useState<ChallengeDto[]>(
    []
  );
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  // 특정 챌린지 조회 상태
  const [selectedChallenge, setSelectedChallenge] =
    useState<ChallengeDto | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
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
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // 삭제 상태
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

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

  const fetchChallengesByCategory = async (categoryId: number) => {
    setCategoryLoading(true);
    setCategoryError(null);

    try {
      const response = await axiosInstance.get(
        `/api/challenges/categories/${categoryId}`
      );

      if (response.data.success) {
        setCategoryChallenges(response.data.data || []);
      } else {
        setCategoryError(
          response.data.error?.message || "카테고리별 조회에 실패했습니다."
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        setCategoryError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: {
            status?: number;
            data?: { message?: string; error?: { message?: string } };
          };
          message?: string;
        };
        setCategoryError(
          axiosError.response?.data?.error?.message ||
            axiosError.response?.data?.message ||
            axiosError.message ||
            "카테고리별 조회에 실패했습니다."
        );
      } else {
        setCategoryError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setCategoryLoading(false);
    }
  };

  const fetchChallengeById = async (id: number) => {
    setDetailLoading(true);
    setDetailError(null);
    setSelectedChallenge(null);

    try {
      const response = await axiosInstance.get(`/api/challenges/${id}`);

      if (response.data.success) {
        setSelectedChallenge(response.data.data);
        // 수정 폼 데이터 설정
        setEditFormData({
          name: response.data.data.name,
          created_at: response.data.data.created_at.split("T")[0],
          end_at: response.data.data.end_at.split("T")[0],
          startTime: response.data.data.startTime
            ? new Date(response.data.data.startTime).toTimeString().slice(0, 5)
            : "",
          endTime: response.data.data.endTime
            ? new Date(response.data.data.endTime).toTimeString().slice(0, 5)
            : "",
          color: response.data.data.color,
          categoryId: response.data.data.categoryId,
        });
      } else {
        setDetailError(
          response.data.error?.message || "챌린지 조회에 실패했습니다."
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        setDetailError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: {
            status?: number;
            data?: { message?: string; error?: { message?: string } };
          };
          message?: string;
        };
        setDetailError(
          axiosError.response?.data?.error?.message ||
            axiosError.response?.data?.message ||
            axiosError.message ||
            "챌린지 조회에 실패했습니다."
        );
      } else {
        setDetailError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const updateChallenge = async (id: number) => {
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);

    try {
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

      const response = await axiosInstance.put(
        `/api/challenges/${id}`,
        requestData
      );

      if (response.data.success) {
        setEditSuccess("챌린지가 성공적으로 수정되었습니다!");
        setIsEditMode(false);
        // 목록 새로고침
        fetchChallenges();
        fetchChallengesByCategory(selectedCategory);
        // 상세 정보 새로고침
        fetchChallengeById(id);
      } else {
        setEditError(
          response.data.error?.message || "챌린지 수정에 실패했습니다."
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        setEditError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: {
            status?: number;
            data?: { message?: string; error?: { message?: string } };
          };
          message?: string;
        };
        setEditError(
          axiosError.response?.data?.error?.message ||
            axiosError.response?.data?.message ||
            axiosError.message ||
            "챌린지 수정에 실패했습니다."
        );
      } else {
        setEditError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setEditLoading(false);
    }
  };

  const deleteChallenge = async (id: number) => {
    if (!confirm("정말로 이 챌린지를 삭제하시겠습니까?")) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      const response = await axiosInstance.delete(`/api/challenges/${id}`);

      if (response.data.success) {
        setDeleteSuccess("챌린지가 성공적으로 삭제되었습니다!");
        setSelectedChallenge(null);
        setIsEditMode(false);
        // 목록 새로고침
        fetchChallenges();
        fetchChallengesByCategory(selectedCategory);
      } else {
        setDeleteError(
          response.data.error?.message || "챌린지 삭제에 실패했습니다."
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        setDeleteError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: {
            status?: number;
            data?: { message?: string; error?: { message?: string } };
          };
          message?: string;
        };
        setDeleteError(
          axiosError.response?.data?.error?.message ||
            axiosError.response?.data?.message ||
            axiosError.message ||
            "챌린지 삭제에 실패했습니다."
        );
      } else {
        setDeleteError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const createChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess(null);

    try {
      const requestData = {
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

      const response = await axiosInstance.post("/api/challenges", requestData);

      if (response.data.success) {
        setCreateSuccess("챌린지가 성공적으로 생성되었습니다!");
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
        // 챌린지 목록 새로고침
        fetchChallenges();
        // 카테고리별 목록도 새로고침
        fetchChallengesByCategory(selectedCategory);
      } else {
        setCreateError(
          response.data.error?.message || "챌린지 생성에 실패했습니다."
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        setCreateError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: {
            status?: number;
            data?: { message?: string; error?: { message?: string } };
          };
          message?: string;
        };
        setCreateError(
          axiosError.response?.data?.error?.message ||
            axiosError.response?.data?.message ||
            axiosError.message ||
            "챌린지 생성에 실패했습니다."
        );
      } else {
        setCreateError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setCreateLoading(false);
    }
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value, 10);
    setSelectedCategory(categoryId);
    fetchChallengesByCategory(categoryId);
  };

  const handleChallengeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.value, 10);
    setSelectedChallengeId(id);
  };

  useEffect(() => {
    fetchChallenges();
    fetchChallengesByCategory(selectedCategory);
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
          onClick={() => {
            setSelectedChallengeId(challenge.id);
            fetchChallengeById(challenge.id);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
        >
          상세보기
        </button>
        <button
          onClick={() => {
            setSelectedChallengeId(challenge.id);
            fetchChallengeById(challenge.id);
            setIsEditMode(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-700 text-white text-xs px-2 py-1 rounded"
        >
          수정
        </button>
        <button
          onClick={() => deleteChallenge(challenge.id)}
          disabled={deleteLoading}
          className="bg-red-500 hover:bg-red-700 text-white text-xs px-2 py-1 rounded disabled:opacity-50"
        >
          {deleteLoading ? "삭제중..." : "삭제"}
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
          {createSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {createSuccess}
            </div>
          )}

          {createError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>오류:</strong> {createError}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {createLoading ? "생성 중..." : "챌린지 생성"}
            </button>

            <button
              type="button"
              onClick={fetchChallenges}
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
        {selectedChallenge && !isEditMode && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-lg mb-4">챌린지 상세 정보</h3>
            {renderChallengeCard(selectedChallenge)}

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
        {selectedChallenge && isEditMode && (
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
              {editSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {editSuccess}
                </div>
              )}

              {editError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <strong>오류:</strong> {editError}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => updateChallenge(selectedChallenge.id)}
                  disabled={editLoading}
                  className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {editLoading ? "수정중..." : "수정 완료"}
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
            <strong>오류:</strong> {detailError}
          </div>
        )}

        {/* 삭제 성공/에러 메시지 */}
        {deleteSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {deleteSuccess}
          </div>
        )}

        {deleteError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>오류:</strong> {deleteError}
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
            <strong>오류:</strong> {categoryError}
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
