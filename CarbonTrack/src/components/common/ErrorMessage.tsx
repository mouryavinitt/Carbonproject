import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 flex items-start gap-3 my-3">
      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-rose-800">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-rose-700 underline hover:text-rose-900 cursor-pointer"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};
