"use client";

import Image from "next/image";
import Input from "@/app/_components/Input/Input";
import { Controller, useFormContext } from "react-hook-form";
import ProfileImage from "@/app/_components/ProfileImage/ProfileImage";
import { useUploadProfile } from "@/app/signup/hooks/useUploadProfile";
import { useEffect } from "react";

export default function ProfileSection() {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const {
    profilePreview,
    handleImageClick,
    handleFileChange,
    fileInputRef,
    profileFile,
  } = useUploadProfile();

  useEffect(() => {
    if (profileFile) {
      setValue("profileImage", profileFile);
    }
  }, [profileFile]);

  return (
    <section className="grid grid-cols-[1fr_3fr] items-center gap-5 w-full">
      <div className="relative w-20 h-20 rounded-full bg-[#F5F5F5]">
        <ProfileImage
          imageSrc={profilePreview || null}
          className="w-full h-full object-cover"
        />
        <Image
          src="/icons/camera.svg"
          alt="프로필 업로드"
          width={24}
          height={24}
          className="absolute bottom-0 right-0 cursor-pointer z-10 border border-light-gray bg-white rounded-full"
          onClick={handleImageClick}
        />
        <input
          type="file"
          className="hidden"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <Controller
        control={control}
        name="nickName"
        rules={{
          required: "닉네임을 입력해주세요",
          pattern: {
            value: /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,10}$/,
            message:
              "닉네임은 한글, 영문, 숫자를 포함해 2자 이상 10자여야 합니다",
          },
        }}
        render={({ field }) => (
          <div className="relative">
            <Input
              label="닉네임"
              labelHtmlFor="nickName"
              placeholder="ex) 홍길동"
              className="login-input relative"
              {...field}
            />
            {errors.nickName && (
              <p className="text-red-500 text-xs absolute left-0">
                {errors.nickName?.message?.toString()}
              </p>
            )}
          </div>
        )}
      />
    </section>
  );
}
