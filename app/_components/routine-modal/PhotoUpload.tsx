"use client";

import { useState, useRef } from "react";

interface PhotoUploadProps {
  routineTitle: string;
  onUpload: (photoUrl: string) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export function PhotoUpload({
  routineTitle,
  onUpload,
  onCancel,
  loading,
}: PhotoUploadProps) {
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
        // const uploadResponse = await axiosInstance.post('/api/upload', formData);
        // const photoUrl = uploadResponse.data.url;

        // 임시로 data URL 사용 (실제 환경에서는 실제 URL로 대체해야 함)
        const photoUrl = `uploaded_${Date.now()}.jpg`;

        await onUpload(photoUrl);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-sm w-full max-h-[80vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">사진 인증</h3>
          <button
            onClick={onCancel}
            disabled={uploading || loading}
            className="p-1 hover:bg-gray-100 rounded-full">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-medium">{routineTitle}</span> 루틴을 완료한
            증명 사진을 업로드해주세요.
          </p>

          {/* 미리보기 */}
          {previewUrl && (
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="미리보기"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}

          {/* 버튼들 */}
          <div className="space-y-3">
            {!selectedFile ? (
              <>
                <button
                  onClick={handleTakePhoto}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  카메라로 촬영
                </button>

                <button
                  onClick={handleSelectFromGallery}
                  className="w-full py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  갤러리에서 선택
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleUpload}
                  disabled={uploading || loading}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                  {uploading || loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      업로드 중...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      인증 완료
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  disabled={uploading || loading}
                  className="w-full py-3 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                  다시 선택
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            이미지 파일만 업로드 가능하며, 최대 5MB까지 지원됩니다.
          </p>
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
