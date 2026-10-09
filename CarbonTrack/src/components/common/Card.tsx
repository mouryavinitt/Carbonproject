import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-emerald-300 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
