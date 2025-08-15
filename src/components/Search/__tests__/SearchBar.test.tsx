import React from 'react';
import { render, screen, fireEvent } from '../../../test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  const mockOnSearchChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with placeholder text', () => {
    render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );

    const input = screen.getByPlaceholderText('Search collection...');
    expect(input).toBeInTheDocument();
  });

  it('should display current search query', () => {
    render(
      <SearchBar searchQuery="bitcoin" onSearchChange={mockOnSearchChange} />
    );

    const input = screen.getByDisplayValue('bitcoin');
    expect(input).toBeInTheDocument();
  });

  it('should call onSearchChange when typing', () => {
    render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );

    const input = screen.getByPlaceholderText('Search collection...');
    fireEvent.change(input, { target: { value: 'saylor' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('saylor');
    expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
  });

  it('should show clear button when search query exists', () => {
    render(
      <SearchBar searchQuery="bitcoin" onSearchChange={mockOnSearchChange} />
    );

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('should hide clear button when search query is empty', () => {
    render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );

    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should clear search when clear button is clicked', () => {
    render(
      <SearchBar searchQuery="bitcoin" onSearchChange={mockOnSearchChange} />
    );

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);

    expect(mockOnSearchChange).toHaveBeenCalledWith('');
    expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );

    const input = screen.getByLabelText('Search memes');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should contain search icon', () => {
    const { container } = render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );

    // The search icon is an SVG, we can check for its presence by looking for the SVG element
    const searchIcon = container.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon).toHaveClass('absolute', 'left-3');
  });

  it('should handle multiple rapid changes', () => {
    render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );

    const input = screen.getByPlaceholderText('Search collection...');
    
    fireEvent.change(input, { target: { value: 'b' } });
    fireEvent.change(input, { target: { value: 'bi' } });
    fireEvent.change(input, { target: { value: 'bit' } });

    expect(mockOnSearchChange).toHaveBeenCalledTimes(3);
    expect(mockOnSearchChange).toHaveBeenNthCalledWith(1, 'b');
    expect(mockOnSearchChange).toHaveBeenNthCalledWith(2, 'bi');
    expect(mockOnSearchChange).toHaveBeenNthCalledWith(3, 'bit');
  });
});