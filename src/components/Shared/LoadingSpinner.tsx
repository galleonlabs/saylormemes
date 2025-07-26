import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="spinner" />
    </div>
  );
};