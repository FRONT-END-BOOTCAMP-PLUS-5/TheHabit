"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/app/_components/buttons/Button";
import { CameraOutlined, PictureOutlined } from "@ant-design/icons";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // MB
  preview?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = "image/*",
  maxSize = 5,
  preview = true,
  className = "",
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (accept.startsWith("image/") && !file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`파일 크기는 ${maxSize}MB 이하만 업로드 가능합니다.`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // 미리보기 생성
    if (preview && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  const handleSelectFromGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
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
      {!selectedFile ? (
        <>
          {accept.startsWith("image/") && (
            <Button
              type="primary"
              color="blue"
              onClick={handleTakePhoto}
              className="w-full h-12 flex items-center justify-center space-x-2"
            >
              <CameraOutlined style={{ fontSize: "18px" }} />
              <span>카메라로 촬영</span>
            </Button>
          )}

          <Button
            type="default"
            onClick={handleSelectFromGallery}
            className="w-full h-12 flex items-center justify-center space-x-2"
          >
            <PictureOutlined style={{ fontSize: "18px" }} />
            <span>파일 선택</span>
          </Button>
        </>
      ) : (
        <Button
          type="default"
          onClick={resetFile}
          className="w-full h-10"
        >
          다시 선택
        </Button>
      )}

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-400 text-center">
        {accept.startsWith("image/") ? "이미지 파일만" : "파일"} 업로드 가능하며, 최대 {maxSize}MB까지 지원됩니다.
      </p>
    </div>
  );
};