import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 pt-8 border-t border-ink/10">
      <div className="text-center">
        <p className="text-footnote text-ink-lighter">
          Curated by{' '}
          <a
            className="text-btc"
            href="https://twitter.com/davyjones0x"
            target="_blank"
            rel="noopener noreferrer"
          >
            @davyjones0x
          </a>
        </p>
        <p className="text-footnote text-ink-lightest mt-1">
          © {new Date().getFullYear()} · Send me your best Saylor memes
        </p>
      </div>
    </footer>
  );
};