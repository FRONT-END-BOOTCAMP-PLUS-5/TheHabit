import { useModalStore } from '@/libs/stores/modalStore';

export const useModal = () => {
  const { openModal, closeModal } = useModalStore();

  const showToast = (content: React.ReactNode) => {
    openModal(content, 'toast');
  };

  const showFloating = (content: React.ReactNode) => {
    openModal(content, 'floating');
  };

  return {
    showToast,
    showFloating,
    closeModal,
  };
};
