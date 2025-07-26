import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-btc animate-pulse-slow">
        Michael Saylor Memes
      </h1>
      <p className="text-gray-600 text-lg">
        The ultimate collection of Bitcoin wisdom
      </p>
    </div>
  );
};