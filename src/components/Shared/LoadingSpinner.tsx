import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64 animate-fade-in">
      <div className="spinner mb-4" />
      <p className="text-neutral-500 font-medium animate-pulse">Loading memes...</p>
    </div>
  );
};