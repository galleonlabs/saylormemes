import React from 'react';

interface EmptyStateProps {
  searchQuery: string;
  activeFilter: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, activeFilter }) => {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="empty-state-icon">
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <p className="text-neutral-600 text-lg font-semibold">
        No results found
        {searchQuery && <span className="text-neutral-900"> for "{searchQuery}"</span>}
        {activeFilter && activeFilter !== 'all' && <span className="text-neutral-900"> with tag "{activeFilter}"</span>}
      </p>
      <p className="text-neutral-500 mt-2 font-medium">
        Try adjusting your search or filters
      </p>
    </div>
  );
};