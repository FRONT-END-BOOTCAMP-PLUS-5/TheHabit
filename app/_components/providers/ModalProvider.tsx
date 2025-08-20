'use client';

import React from 'react';
import { useModalStore } from '@/libs/stores/modalStore';
import ToastModal from '@/app/_components/modals/ToastModal';
import FloatingModal from '@/app/_components/modals/FloatingModal';

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen, modalType, content, modalTitle, modalDescription, closeModal } = useModalStore();

  const renderModal = () => {
    if (!isOpen || !content) return null;

    switch (modalType) {
      case 'floating':
        return (
          <FloatingModal
            isOpen={isOpen}
            onClose={closeModal}
            modalTitle={modalTitle}
            modalDescription={modalDescription}
          >
            {content}
          </FloatingModal>
        );

      case 'toast':
      default:
        return (
          <ToastModal isOpen={isOpen} onClose={closeModal}>
            {content}
          </ToastModal>
        );
    }
  };

  return (
    <>
      {children}
      {renderModal()}
    </>
  );
};

export default ModalProvider;
