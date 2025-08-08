import Image from "next/image";
import React from "react";

export const ProfileImage = ({
  imageSrc,
  className,
}: {
  imageSrc?: string | null;
  className?: string;
}) => {
  return (
    <>
      {imageSrc && (
        <Image
          src={imageSrc}
          alt="프로필"
          width={80}
          height={80}
          className={`rounded-full ${className}`}
        />
      )}
    </>
  );
};
