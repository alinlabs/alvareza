import React from 'react';
import { Send } from 'lucide-react';

interface JobApplyBottomBarProps {
  onOpenApplyModal: () => void;
  isLoading?: boolean;
}

export const JobApplyBottomBar: React.FC<JobApplyBottomBarProps> = ({
  onOpenApplyModal,
  isLoading = false,
}) => {
  return (
    <div
      id="job-apply-bottom-bar"
      className="fixed bottom-0 left-0 right-0 z-40 print:hidden p-3 sm:p-4 pointer-events-none flex justify-center"
    >
      <div className="w-full max-w-6xl mx-auto px-1 sm:px-2">
        <button
          id="btn-lamar-sekarang"
          type="button"
          onClick={onOpenApplyModal}
          disabled={isLoading}
          className="pointer-events-auto w-full py-3.5 sm:py-4 px-6 rounded-2xl font-bold text-base sm:text-lg text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-150 shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 border border-blue-400/40 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex items-center justify-center gap-2 text-center"
        >
          <Send className="w-5 h-5" />
          <span>{isLoading ? 'Memproses Draf...' : 'Lamar Pekerjaan Sekarang'}</span>
        </button>
      </div>
    </div>
  );
};
