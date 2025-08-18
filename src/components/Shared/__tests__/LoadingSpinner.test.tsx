import { render } from '../../../test/test-utils';
import { describe, it, expect } from 'vitest';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner container', () => {
    const { container } = render(<LoadingSpinner />);
    
    // The LoadingSpinner component renders a div with flex classes inside the test wrapper
    const spinnerContainer = container.querySelector('div.flex.justify-center.items-center.h-32');
    expect(spinnerContainer).toBeInTheDocument();
  });

  it('should render loading dots', () => {
    const { container } = render(<LoadingSpinner />);
    
    const loadingDots = container.querySelector('.loading-dots');
    expect(loadingDots).toBeInTheDocument();
  });

  it('should render three span elements for dots animation', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spans = container.querySelectorAll('.loading-dots span');
    expect(spans).toHaveLength(3);
  });

  it('should have proper structure for loading animation', () => {
    const { container } = render(<LoadingSpinner />);
    
    const outerDiv = container.firstChild;
    const loadingDots = container.querySelector('.loading-dots');
    
    expect(outerDiv).toContainElement(loadingDots as HTMLElement);
    expect(loadingDots).toBeInTheDocument();
  });

  it('should render without any text content', () => {
    const { container } = render(<LoadingSpinner />);
    
    expect(container.textContent).toBe('');
  });
});