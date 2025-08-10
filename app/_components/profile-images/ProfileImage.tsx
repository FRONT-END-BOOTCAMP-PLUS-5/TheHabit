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
        <div className="w-20 h-20 rounded-full overflow-hidden border-primary border-2">
          <Image
            src={imageSrc}
            alt="프로필"
            layout="responsive"
            width={120}
            height={120}
            className={"w-full h-full object-cover"}
          />
        </div>
      )}
    </>
  );
};
