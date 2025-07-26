import React from 'react';

export const Footer: React.FC = () => {
  return (
    <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
      <p>
        created by{' '}
        <a
          className="text-btc hover:underline"
          href="https://twitter.com/davyjones0x"
          target="_blank"
          rel="noopener noreferrer"
        >
          @davyjones0x
        </a>{' '}
        (send me saylor memes)
      </p>
    </div>
  );
};