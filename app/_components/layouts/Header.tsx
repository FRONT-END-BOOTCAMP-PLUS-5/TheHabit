"use client";

import Link from "next/link";
import Image from "next/image";
import FireIcon from "@/public/icons/icon_fire.png";
import { useModalStore } from "@/libs/stores/modalStore";

//TODO : 최장 스트릭 정보 가져오기
const Header: React.FC = () => {
  const { openModal } = useModalStore();

  const handleOpenModal = () => {
    openModal(
      <div className="text-center py-8">
        <h2 className="text-xl font-bold mb-4">연속 스트릭 21일 달성중</h2>
        <p className="text-gray-600">여기 모달 내용 추가해주세요 강현님.</p>
      </div>
    );
  };
  return (
    <header className="w-full flex justify-between items-center py-4">
      <div className="flex flex-3 items-center justify-center" />
      <h1 className={"text-3xl font-black text-primary flex-3"}>
        <Link href="/">The:Habit</Link>
      </h1>
      <button
        className="flex flex-2 items-center justify-end gap-1 pr-4 cursor-pointer"
        onClick={handleOpenModal}
      >
v
        <Image src={FireIcon} alt="fire" width={24} height={24} />
        <div className="text-xl font-extrabold bg-gradient-to-r from-[#FF6D00] via-[#FF9800] to-[#FFC107] bg-clip-text text-transparent">
          21
        </div>
      </button>
    </header>
  );
};

export default Header;
