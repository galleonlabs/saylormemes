import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 mt-20 border-t border-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-sm text-white/60 font-light">
            Created by{' '}
            <a
              className="text-btc font-medium hover:text-btc-bright transition-colors duration-300 hover:glow-text"
              href="https://twitter.com/davyjones0x"
              target="_blank"
              rel="noopener noreferrer"
            >
              @davyjones0x
            </a>
          </p>
          <p className="text-xs text-white/40 mt-2">
            Send me your best Saylor memes 🚀
          </p>
        </div>
      </div>
    </footer>
  );
};