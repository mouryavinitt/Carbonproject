import React from 'react';
import { LucideIcon, Leaf } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Leaf,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};
