import { render, screen, fireEvent } from '../../../test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { TagFilter } from '../TagFilter';

describe('TagFilter', () => {
  const mockOnFilterChange = vi.fn();
  const mockTags = ['bitcoin', 'conference', 'meme', 'education'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all button and available tags', () => {
    render(
      <TagFilter 
        availableTags={mockTags} 
        activeFilter="all" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    // Check for "All" button
    expect(screen.getByText('All')).toBeInTheDocument();

    // Check for all tag buttons
    mockTags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('should highlight active filter', () => {
    render(
      <TagFilter 
        availableTags={mockTags} 
        activeFilter="bitcoin" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const bitcoinButton = screen.getByText('bitcoin');
    const allButton = screen.getByText('All');

    expect(bitcoinButton).toHaveClass('tag-active');
    expect(allButton).not.toHaveClass('tag-active');
  });

  it('should highlight "All" when activeFilter is "all"', () => {
    render(
      <TagFilter 
        availableTags={mockTags} 
        activeFilter="all" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const allButton = screen.getByText('All');
    expect(allButton).toHaveClass('tag-active');
  });

  it('should call onFilterChange when All button is clicked', () => {
    render(
      <TagFilter 
        availableTags={mockTags} 
        activeFilter="bitcoin" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const allButton = screen.getByText('All');
    fireEvent.click(allButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('all');
    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
  });

  it('should call onFilterChange when tag button is clicked', () => {
    render(
      <TagFilter 
        availableTags={mockTags} 
        activeFilter="all" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const bitcoinButton = screen.getByText('bitcoin');
    fireEvent.click(bitcoinButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('bitcoin');
    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    render(
      <TagFilter 
        availableTags={mockTags} 
        activeFilter="bitcoin" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const allButton = screen.getByText('All');
    const bitcoinButton = screen.getByText('bitcoin');

    expect(allButton).toHaveAttribute('aria-pressed', 'false');
    expect(bitcoinButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should handle empty tags array', () => {
    render(
      <TagFilter 
        availableTags={[]} 
        activeFilter="all" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    // Should still show "All" button
    expect(screen.getByText('All')).toBeInTheDocument();
    
    // Should not show any tag buttons
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('should render tags with proper button styling', () => {
    render(
      <TagFilter 
        availableTags={mockTags} 
        activeFilter="all" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const allButton = screen.getByText('All');
    const bitcoinButton = screen.getByText('bitcoin');

    expect(allButton).toHaveClass('tag');
    expect(bitcoinButton).toHaveClass('tag');
  });

  it('should handle multiple rapid clicks', () => {
    render(
      <TagFilter 
        availableTags={mockTags} 
        activeFilter="all" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const bitcoinButton = screen.getByText('bitcoin');
    const conferenceButton = screen.getByText('conference');

    fireEvent.click(bitcoinButton);
    fireEvent.click(conferenceButton);
    fireEvent.click(bitcoinButton);

    expect(mockOnFilterChange).toHaveBeenCalledTimes(3);
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(1, 'bitcoin');
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(2, 'conference');
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(3, 'bitcoin');
  });

  it('should maintain tag order as provided', () => {
    const orderedTags = ['zebra', 'apple', 'bitcoin'];
    
    render(
      <TagFilter 
        availableTags={orderedTags} 
        activeFilter="all" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const buttons = screen.getAllByRole('button');
    // First button should be "All", then the tags in order
    expect(buttons[0]).toHaveTextContent('All');
    expect(buttons[1]).toHaveTextContent('zebra');
    expect(buttons[2]).toHaveTextContent('apple');
    expect(buttons[3]).toHaveTextContent('bitcoin');
  });
});