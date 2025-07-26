import React from 'react';

interface TagFilterProps {
  availableTags: string[];
  activeFilter: string;
  onFilterChange: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ availableTags, activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
          activeFilter === 'all'
            ? 'bg-btc text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-pressed={activeFilter === 'all'}
      >
        All
      </button>
      {availableTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onFilterChange(tag)}
          className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
            activeFilter === tag
              ? 'bg-btc text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-pressed={activeFilter === tag}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};