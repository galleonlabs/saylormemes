import React from 'react';

interface EmptyStateProps {
  searchQuery: string;
  activeFilter: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, activeFilter }) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">
        No results found
        {searchQuery && ` for "${searchQuery}"`}
        {activeFilter && activeFilter !== 'all' && ` with tag "${activeFilter}"`}
      </p>
      <p className="text-gray-400 mt-2">
        Try adjusting your search or filters
      </p>
    </div>
  );
};