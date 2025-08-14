import { useModalStore } from '@/libs/stores/modalStore';

export const useModal = () => {
  const { openModal, closeModal } = useModalStore();

  const showToast = (content: React.ReactNode, title?: string, description?: string) => {
    openModal(content, 'toast', title, description);
  };

  const showFloating = (content: React.ReactNode, title?: string, description?: string) => {
    openModal(content, 'floating', title, description);
  };

  return {
    showToast,
    showFloating,
    closeModal,
  };
};
