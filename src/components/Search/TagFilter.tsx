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
        className={`tag-modern ${activeFilter === 'all' ? 'active' : ''}`}
        aria-pressed={activeFilter === 'all'}
      >
        All
      </button>
      {availableTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onFilterChange(tag)}
          className={`tag-modern ${activeFilter === tag ? 'active' : ''}`}
          aria-pressed={activeFilter === tag}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};