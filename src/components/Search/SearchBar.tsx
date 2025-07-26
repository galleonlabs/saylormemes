import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative group">
      <input
        type="text"
        placeholder="Search memes..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-6 py-3.5 pl-12 pr-6 rounded-2xl bg-neutral-100 border border-transparent 
          placeholder:text-neutral-500 text-neutral-900 font-medium
          transition-all duration-350 
          hover:bg-neutral-50 hover:border-neutral-200 hover:shadow-subtle
          focus:bg-white focus:border-btc-light focus:shadow-card focus:outline-none"
        aria-label="Search memes"
      />
      <svg
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 
          transition-colors duration-350 group-focus-within:text-btc"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {searchQuery && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg
            text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100
            transition-all duration-250 animate-scale-in"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};