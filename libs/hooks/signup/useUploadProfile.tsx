"use client";

import React, { useRef, useState } from "react";

export const useUploadProfile = () => {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePreview(imageUrl);
      setProfileFile(file); // 실제 파일도 저장
    }
  };

  const resetProfile = () => {
    setProfilePreview(null);
    setProfileFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    profilePreview,
    profileFile,
    handleImageClick,
    handleFileChange,
    fileInputRef,
    resetProfile,
  };
};
