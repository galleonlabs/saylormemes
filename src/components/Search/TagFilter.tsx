import React from 'react';

interface TagFilterProps {
  availableTags: string[];
  activeFilter: string;
  onFilterChange: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ availableTags, activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-250 ${
          activeFilter === 'all'
            ? 'bg-btc text-white shadow-subtle transform scale-105'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:shadow-subtle active:scale-95'
        }`}
        aria-pressed={activeFilter === 'all'}
      >
        All
      </button>
      {availableTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onFilterChange(tag)}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-250 ${
            activeFilter === tag
              ? 'bg-btc text-white shadow-subtle transform scale-105'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:shadow-subtle active:scale-95'
          }`}
          aria-pressed={activeFilter === tag}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};