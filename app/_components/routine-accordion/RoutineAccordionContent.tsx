"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/_components/buttons/Button";
import { Modal, Checkbox } from "antd";
import { CustomInput } from "@/app/_components/inputs/Input";
import { PhotoUploadModal } from "@/app/_components/routine-accordion/PhotoUploadModal";

interface RoutineDto {
  id: number;
  title: string;
  emoji: number;
  challengeId: number;
  createdAt: string;
  updatedAt: string;
}

interface RoutineCompletionDto {
  id: number;
  routineId: number;
  userId: string;
  photoUrl?: string;
  review?: string;
  createdAt: string;
}

interface RoutineAccordionContentProps {
  challengeId: number;
  challengeName: string;
}

const emojiMap: { [key: number]: string } = {
  1: "🏃", 2: "💧", 3: "📚", 4: "🧘", 5: "🏋️",
  6: "🥗", 7: "😴", 8: "🎵", 9: "✍️", 10: "🌱",
};

export function RoutineAccordionContent({ challengeId, challengeName }: RoutineAccordionContentProps) {
  const [routines, setRoutines] = useState<RoutineDto[]>([]);
  const [completions, setCompletions] = useState<RoutineCompletionDto[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 소감 작성 모달 상태
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineDto | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // 인증샷 업로드 모달 상태
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedRoutineForPhoto, setSelectedRoutineForPhoto] = useState<RoutineDto | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  // 루틴 목록 조회
  useEffect(() => {
    if (challengeId) {
      fetchRoutines();
      fetchCompletions();
    }
  }, [challengeId]);

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/routines?challengeId=${challengeId}`);
      
      if (response.ok) {
        const data = await response.json();
        setRoutines(data.data || []);
      } else {
        console.error('루틴 목록 조회 실패:', response.statusText);
      }
    } catch (error) {
      console.error('루틴 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletions = async () => {
    try {
      const response = await fetch(`/api/routine-completions?challengeId=${challengeId}`);
      
      if (response.ok) {
        const data = await response.json();
        setCompletions(data.data || []);
      } else {
        console.error('루틴 완료 현황 조회 실패:', response.statusText);
      }
    } catch (error) {
      console.error('루틴 완료 현황 조회 오류:', error);
    }
  };

  // 루틴 완료 여부 확인
  const isRoutineCompleted = (routineId: number) => {
    return completions.some(completion => completion.routineId === routineId);
  };

  // 루틴 체크박스 클릭 핸들러
  const handleRoutineCheck = (routine: RoutineDto, checked: boolean) => {
    if (checked) {
      // 체크된 경우 소감 작성 모달 열기
      setSelectedRoutine(routine);
      setReviewText("");
      setIsReviewModalOpen(true);
    } else {
      // 체크 해제된 경우 완료 취소
      handleRoutineUncheck(routine.id);
    }
  };

  // 루틴 완료 취소
  const handleRoutineUncheck = async (routineId: number) => {
    try {
      const completion = completions.find(c => c.routineId === routineId);
      if (completion) {
        const response = await fetch(`/api/routine-completions/${completion.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchCompletions();
        } else {
          console.error('루틴 완료 취소 실패:', response.statusText);
        }
      }
    } catch (error) {
      console.error('루틴 완료 취소 오류:', error);
    }
  };

  // 소감 작성 모달 제출
  const handleReviewSubmit = async () => {
    if (!selectedRoutine || !reviewText.trim()) {
      alert('소감을 입력해주세요.');
      return;
    }

    try {
      setReviewSubmitting(true);

      const response = await fetch('/api/routine-completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          routineId: selectedRoutine.id,
          review: reviewText,
          // photoUrl은 나중에 구현
        }),
      });

      if (response.ok) {
        await fetchCompletions();
        handleReviewModalClose();
      } else {
        console.error('루틴 완료 처리 실패:', response.statusText);
      }
    } catch (error) {
      console.error('루틴 완료 처리 오류:', error);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // 소감 작성 모달 닫기
  const handleReviewModalClose = () => {
    setIsReviewModalOpen(false);
    setSelectedRoutine(null);
    setReviewText("");
  };

  // 인증샷 업로드 모달 열기
  const handlePhotoUpload = (routine: RoutineDto) => {
    setSelectedRoutineForPhoto(routine);
    setIsPhotoModalOpen(true);
  };

  // 인증샷 업로드 처리
  const handlePhotoSubmit = async (photoUrl: string) => {
    if (!selectedRoutineForPhoto) return;

    try {
      setPhotoUploading(true);

      const completion = completions.find(c => c.routineId === selectedRoutineForPhoto.id);
      if (completion) {
        // 기존 완료 기록에 사진 URL 추가
        const response = await fetch(`/api/routine-completions/${completion.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            photoUrl: photoUrl,
          }),
        });

        if (response.ok) {
          await fetchCompletions();
        } else {
          console.error('인증샷 업로드 실패:', response.statusText);
        }
      }
    } catch (error) {
      console.error('인증샷 업로드 오류:', error);
    } finally {
      setPhotoUploading(false);
    }
  };

  // 인증샷 모달 닫기
  const handlePhotoModalClose = () => {
    setIsPhotoModalOpen(false);
    setSelectedRoutineForPhoto(null);
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        루틴 목록을 불러오는 중...
      </div>
    );
  }

  if (routines.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="mb-2">등록된 루틴이 없습니다.</p>
        <p className="text-sm">"{challengeName}" 챌린지에 루틴을 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          📋 오늘의 루틴
        </h4>
        
        <div className="space-y-3">
          {routines.map((routine) => {
            const isCompleted = isRoutineCompleted(routine.id);
            const completion = completions.find(c => c.routineId === routine.id);

            return (
              <div
                key={routine.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isCompleted}
                    onChange={(e) => handleRoutineCheck(routine, e.target.checked)}
                    className="text-lg"
                  />
                  
                  <span className="text-2xl">
                    {emojiMap[routine.emoji] || "🌱"}
                  </span>
                  
                  <div>
                    <p className={`font-medium ${isCompleted ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                      {routine.title}
                    </p>
                    {isCompleted && completion?.review && (
                      <p className="text-sm text-green-600 mt-1">
                        💭 {completion.review}
                      </p>
                    )}
                  </div>
                </div>

                {isCompleted && (
                  <div className="flex items-center space-x-2">
                    {completion?.photoUrl ? (
                      <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                        📸 인증완료
                      </span>
                    ) : (
                      <Button
                        type="link"
                        color="blue"
                        onClick={() => handlePhotoUpload(routine)}
                        className="text-xs"
                      >
                        📸 인증샷
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* 소감 작성 모달 */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{selectedRoutine && emojiMap[selectedRoutine.emoji]}</span>
            <span>루틴 완료 소감</span>
          </div>
        }
        open={isReviewModalOpen}
        onCancel={handleReviewModalClose}
        footer={[
          <Button key="cancel" onClick={handleReviewModalClose}>
            취소
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleReviewSubmit}
            style={{ opacity: reviewSubmitting ? 0.6 : 1 }}
          >
            {reviewSubmitting ? '저장 중...' : '완료'}
          </Button>,
        ]}
        width={400}
      >
        <div className="py-4">
          <p className="text-gray-600 mb-3">
            "<strong>{selectedRoutine?.title}</strong>" 루틴을 완료하셨네요! 🎉
          </p>
          <p className="text-gray-600 mb-4">
            오늘의 소감을 간단히 남겨주세요.
          </p>
          
          <CustomInput
            type="text"
            placeholder="예: 오늘도 열심히 했다! 내일도 화이팅!"
            value={reviewText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReviewText(e.target.value)}
            maxLength={100}
            style={{ minHeight: '80px' }}
          />
          
          <p className="text-xs text-gray-400 mt-2">
            최대 100자까지 입력할 수 있습니다.
          </p>
        </div>
      </Modal>

      {/* 인증샷 업로드 모달 */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={handlePhotoModalClose}
        onUpload={handlePhotoSubmit}
        routineTitle={selectedRoutineForPhoto?.title || ""}
        loading={photoUploading}
      />
    </div>
  );
}