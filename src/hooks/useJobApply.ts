import { useState, useCallback } from 'react';

export function useJobApply() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openApplyModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    openApplyModal,
    handleCloseModal,
  };
}
