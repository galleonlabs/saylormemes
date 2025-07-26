import React from 'react';

interface EmptyStateProps {
  searchQuery: string;
  activeFilter: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, activeFilter }) => {
  return (
    <div className="empty-state animate-slide-in-up">
      <div className="empty-state-icon">
        <svg fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-white/80 text-xl font-semibold">
        No memes found
        {searchQuery && <span className="text-btc"> for "{searchQuery}"</span>}
        {activeFilter && activeFilter !== 'all' && <span className="text-btc"> tagged "{activeFilter}"</span>}
      </p>
      <p className="text-white/40 mt-3 font-light">
        Try adjusting your search or filters
      </p>
    </div>
  );
};