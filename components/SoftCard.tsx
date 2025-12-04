import React from 'react';

interface SoftCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const SoftCard: React.FC<SoftCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverEffect = false,
}) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-900 transition-colors duration-300 ${className}`} 
      onClick={onClick}
    >
      {children}
    </div>
  );
};