import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/10 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-btc rounded-full animate-spin"></div>
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-accent-neon rounded-full animate-spin animation-delay-200"></div>
      </div>
      <p className="mt-6 text-white/60 font-medium animate-pulse">Loading memes...</p>
    </div>
  );
};