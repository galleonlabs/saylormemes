import React from 'react';
import { render, screen } from '../../../test/test-utils';
import { describe, it, expect } from 'vitest';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('should render basic empty state message', () => {
    render(<EmptyState searchQuery="" activeFilter="all" />);
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filter criteria')).toBeInTheDocument();
  });

  it('should include search query in message when provided', () => {
    render(<EmptyState searchQuery="bitcoin" activeFilter="all" />);
    
    expect(screen.getByText(/No items found/)).toBeInTheDocument();
    expect(screen.getByText(/matching "bitcoin"/)).toBeInTheDocument();
  });

  it('should include active filter in message when provided', () => {
    render(<EmptyState searchQuery="" activeFilter="conference" />);
    
    expect(screen.getByText(/No items found/)).toBeInTheDocument();
    expect(screen.getByText(/in category "conference"/)).toBeInTheDocument();
  });

  it('should include both search query and filter when both provided', () => {
    render(<EmptyState searchQuery="saylor" activeFilter="meme" />);
    
    expect(screen.getByText(/No items found/)).toBeInTheDocument();
    expect(screen.getByText(/matching "saylor"/)).toBeInTheDocument();
    expect(screen.getByText(/in category "meme"/)).toBeInTheDocument();
  });

  it('should not include filter message when activeFilter is "all"', () => {
    render(<EmptyState searchQuery="bitcoin" activeFilter="all" />);
    
    expect(screen.getByText(/matching "bitcoin"/)).toBeInTheDocument();
    expect(screen.queryByText(/in category/)).not.toBeInTheDocument();
  });

  it('should not include filter message when activeFilter is empty', () => {
    render(<EmptyState searchQuery="bitcoin" activeFilter="" />);
    
    expect(screen.getByText(/matching "bitcoin"/)).toBeInTheDocument();
    expect(screen.queryByText(/in category/)).not.toBeInTheDocument();
  });

  it('should have proper CSS classes', () => {
    const { container } = render(<EmptyState searchQuery="" activeFilter="all" />);
    
    const emptyStateDiv = container.querySelector('.empty-state');
    expect(emptyStateDiv).toBeInTheDocument();
    
    const messageP = container.querySelector('.empty-state-message');
    expect(messageP).toBeInTheDocument();
  });

  it('should render help text with proper styling', () => {
    render(<EmptyState searchQuery="" activeFilter="all" />);
    
    const helpText = screen.getByText('Try adjusting your search or filter criteria');
    expect(helpText).toHaveClass('text-footnote', 'text-ink-lightest');
  });

  it('should handle empty strings gracefully', () => {
    render(<EmptyState searchQuery="" activeFilter="" />);
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.queryByText(/matching/)).not.toBeInTheDocument();
    expect(screen.queryByText(/in category/)).not.toBeInTheDocument();
  });

  it('should handle special characters in search query', () => {
    const specialQuery = 'test@#$%';
    render(<EmptyState searchQuery={specialQuery} activeFilter="all" />);
    
    expect(screen.getByText(`matching "${specialQuery}"`)).toBeInTheDocument();
  });

  it('should handle special characters in filter', () => {
    const specialFilter = 'tag@#$%';
    render(<EmptyState searchQuery="" activeFilter={specialFilter} />);
    
    expect(screen.getByText(`in category "${specialFilter}"`)).toBeInTheDocument();
  });
});