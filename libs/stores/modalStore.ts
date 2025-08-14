import { create } from 'zustand';

export type ModalType = 'toast' | 'floating';

interface ModalState {
  isOpen: boolean;
  modalType: ModalType;
  content: React.ReactNode | null;
  openModal: (content: React.ReactNode, type?: ModalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>(set => ({
  isOpen: false,
  modalType: 'toast',
  content: null,
  openModal: (content, type = 'toast') =>
    set({
      isOpen: true,
      content,
      modalType: type,
    }),
  closeModal: () => set({
    isOpen: false,
    content: null,
    modalType: 'toast',
  }),
}));
