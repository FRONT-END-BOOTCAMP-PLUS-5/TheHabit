import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  content: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>(set => ({
  isOpen: false,
  content: null,
  openModal: (content: React.ReactNode) => set({ isOpen: true, content }),
  closeModal: () => set({ isOpen: false, content: null }),
}));
