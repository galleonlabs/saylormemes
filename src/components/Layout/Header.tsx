import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl sm:text-6xl font-bold mb-3 gradient-btc gradient-text animate-fade-in">
        Michael Saylor Memes
      </h1>
      <p className="text-neutral-600 text-lg sm:text-xl font-medium animate-slide-up">
        The ultimate collection of Bitcoin wisdom
      </p>
    </div>
  );
};