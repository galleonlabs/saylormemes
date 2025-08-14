import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAnalytics } from '../useAnalytics';
import * as firebase from '../../firebase';

// Mock the firebase module
vi.mock('../../firebase', () => ({
  logEvent: vi.fn(),
}));

describe('useAnalytics', () => {
  const mockLogEvent = vi.mocked(firebase.logEvent);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide logAnalyticsEvent function', () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.logAnalyticsEvent).toBeDefined();
    expect(typeof result.current.logAnalyticsEvent).toBe('function');
  });

  it('should call logEvent with event name only', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.logAnalyticsEvent('test_event');

    expect(mockLogEvent).toHaveBeenCalledWith('test_event', undefined);
    expect(mockLogEvent).toHaveBeenCalledTimes(1);
  });

  it('should call logEvent with event name and parameters', () => {
    const { result } = renderHook(() => useAnalytics());
    const parameters = { search_term: 'bitcoin', category: 'video' };
    
    result.current.logAnalyticsEvent('search', parameters);

    expect(mockLogEvent).toHaveBeenCalledWith('search', parameters);
    expect(mockLogEvent).toHaveBeenCalledTimes(1);
  });

  it('should maintain function identity across re-renders', () => {
    const { result, rerender } = renderHook(() => useAnalytics());
    const firstRender = result.current.logAnalyticsEvent;
    
    rerender();
    
    const secondRender = result.current.logAnalyticsEvent;
    expect(firstRender).toBe(secondRender);
  });
});