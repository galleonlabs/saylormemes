import React from 'react';

interface EmptyStateProps {
  searchQuery: string;
  activeFilter: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, activeFilter }) => {
  return (
    <div className="empty-state">
      <p className="empty-state-message">
        No items found
        {searchQuery && <span> matching "{searchQuery}"</span>}
        {activeFilter && activeFilter !== 'all' && <span> in category "{activeFilter}"</span>}
      </p>
      <p className="text-footnote text-ink-lightest">
        Try adjusting your search or filter criteria
      </p>
    </div>
  );
};