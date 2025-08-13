"use client";

import React from "react";
import { useModalStore } from "@/libs/stores/modalStore";
import ToastModal from "@/app/_components/modals/ToastModal";

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isOpen, content, closeModal } = useModalStore();

  return (
    <>
      {children}
      <ToastModal isOpen={isOpen} onClose={closeModal}>
        {content}
      </ToastModal>
    </>
  );
};

export default ModalProvider;
