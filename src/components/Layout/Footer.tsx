import React from 'react';

export const Footer: React.FC = () => {
  return (
    <div className="mt-12 pt-6 border-t border-neutral-200 text-center">
      <p className="text-sm text-neutral-600 font-medium">
        created by{' '}
        <a
          className="text-btc font-semibold hover:text-btc-dark transition-colors duration-250"
          href="https://twitter.com/davyjones0x"
          target="_blank"
          rel="noopener noreferrer"
        >
          @davyjones0x
        </a>{' '}
        <span className="text-neutral-500">(send me saylor memes)</span>
      </p>
    </div>
  );
};