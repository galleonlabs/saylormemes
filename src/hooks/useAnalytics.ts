import { useCallback } from 'react';
import { logEvent } from '../firebase';

export const useAnalytics = () => {
  const logAnalyticsEvent = useCallback((eventName: string, parameters?: any) => {
    logEvent(eventName, parameters);
  }, []);

  return { logAnalyticsEvent };
};