import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search memes..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-btc focus:border-transparent transition-all duration-200"
        aria-label="Search memes"
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};