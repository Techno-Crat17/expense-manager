import React from 'react';

const LoadingSpinner = ({ fullScreen = false, label = 'Loading data...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/40 backdrop-blur-sm">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-200 animate-pulse">{label}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
