

// src/components/GlobalLoadingOverlay.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import LoadingSpinner from './LoadingSpinner';

const GlobalLoadingOverlay: React.FC = () => {
  const { isLoading, loadingMessage } = useSelector((state: RootState) => state.ui);

  if (!isLoading) return null;

return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="">
        <LoadingSpinner size="lg" />
        {loadingMessage && (
          <p className="text-center text-white drop-shadow-lg mt-2">
            {loadingMessage}
          </p>
        )}
      </div>
    </div>
  );
};


export default GlobalLoadingOverlay;