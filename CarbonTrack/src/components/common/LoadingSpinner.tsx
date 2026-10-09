import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading carbon data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3"></div>
      <p className="text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
};
