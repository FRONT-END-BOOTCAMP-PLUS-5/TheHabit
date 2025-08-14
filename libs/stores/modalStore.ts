import { create } from 'zustand';

export type ModalType = 'toast' | 'floating';

interface ModalState {
  isOpen: boolean;
  modalType: ModalType;
  content: React.ReactNode | null;
  modalTitle: string;
  modalDescription: string;
  openModal: (content: React.ReactNode, type?: ModalType, modalTitle?: string, modalDescription?: string) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>(set => ({
  isOpen: false,
  modalType: 'toast',
  content: null,
  modalTitle: '',
  modalDescription: '',
  openModal: (content, type = 'toast', modalTitle = '', modalDescription = '') =>
    set({
      isOpen: true,
      content,
      modalType: type,
      modalTitle,
      modalDescription,
    }),
  closeModal: () => set({
    isOpen: false,
    content: null,
    modalType: 'toast',
    modalTitle: '',
    modalDescription: '',
  }),
}));
