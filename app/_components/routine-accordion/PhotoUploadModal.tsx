"use client";

import { useState, useRef } from "react";
import { Modal, Upload } from "antd";
import { Button } from "@/app/_components/buttons/Button";
import { CameraOutlined, PictureOutlined } from "@ant-design/icons";

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (photoUrl: string) => Promise<void>;
  routineTitle: string;
  loading?: boolean;
}

export function PhotoUploadModal({
  isOpen,
  onClose,
  onUpload,
  routineTitle,
  loading = false,
}: PhotoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("파일 크기는 5MB 이하만 업로드 가능합니다.");
      return;
    }

    setSelectedFile(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 파일 업로드 처리
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("사진을 선택해주세요.");
      return;
    }

    setUploading(true);

    try {
      // 실제 구현에서는 파일을 서버에 업로드하고 URL을 받아야 함
      // 현재는 임시로 Base64 데이터 URL 사용
      const reader = new FileReader();
      reader.onload = async () => {
        // 실제 구현에서는 여기서 서버 업로드 API를 호출
        // const formData = new FormData();
        // formData.append('photo', selectedFile);
        // const uploadResponse = await fetch('/api/upload/photo', {
        //   method: 'POST',
        //   body: formData,
        // });
        // const { photoUrl } = await uploadResponse.json();

        // 임시로 파일명 사용 (실제 환경에서는 실제 URL로 대체해야 함)
        const photoUrl = `uploaded_${Date.now()}.jpg`;

        await onUpload(photoUrl);
        handleModalClose();
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("사진 업로드 실패:", error);
      alert("사진 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  };

  // 카메라 촬영 (모바일)
  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  // 갤러리에서 선택
  const handleSelectFromGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  // 모달 닫기
  const handleModalClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <span>📸</span>
          <span>인증샷 업로드</span>
        </div>
      }
      open={isOpen}
      onCancel={handleModalClose}
      footer={null}
      width={400}
      styles={{
        body: { padding: '20px' }
      }}
    >
      <div>
        <p className="text-gray-600 mb-4">
          "<strong>{routineTitle}</strong>" 루틴을 완료한 증명 사진을 업로드해주세요.
        </p>

        {/* 미리보기 */}
        {previewUrl && (
          <div className="mb-4">
            <img
              src={previewUrl}
              alt="미리보기"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}

        {/* 버튼들 */}
        <div className="space-y-3">
          {!selectedFile ? (
            <>
              <Button
                type="primary"
                color="blue"
                onClick={handleTakePhoto}
                className="w-full h-12 flex items-center justify-center space-x-2"
              >
                <CameraOutlined style={{ fontSize: '18px' }} />
                <span>카메라로 촬영</span>
              </Button>

              <Button
                type="default"
                onClick={handleSelectFromGallery}
                className="w-full h-12 flex items-center justify-center space-x-2"
              >
                <PictureOutlined style={{ fontSize: '18px' }} />
                <span>갤러리에서 선택</span>
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <Button
                type="primary"
                color="green"
                onClick={handleUpload}
                className="w-full h-12"
                style={{ opacity: uploading || loading ? 0.6 : 1 }}
              >
                {uploading || loading ? "업로드 중..." : "인증 완료"}
              </Button>

              <Button
                type="default"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="w-full h-10"
                style={{ opacity: uploading || loading ? 0.6 : 1 }}
              >
                다시 선택
              </Button>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          이미지 파일만 업로드 가능하며, 최대 5MB까지 지원됩니다.
        </p>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Modal>
  );
}