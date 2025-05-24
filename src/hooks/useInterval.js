/**
 * useInterval - Custom React hook for setting intervals
 * 
 * This hook is similar to setInterval but works properly with
 * React's component lifecycle, avoiding memory leaks and allowing
 * for dynamic adjustment of delay.
 */

import { useEffect, useRef } from 'react';

/**
 * Custom hook for handling intervals in React components
 * 
 * @param {Function} callback - Function to be called on each interval
 * @param {number|null} delay - Interval delay in milliseconds, null to pause
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef();
  
  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    
    // If delay is null, don't set up an interval
    // This allows pausing the interval
    if (delay !== null) {
      const id = setInterval(tick, delay);
      // Clear interval on cleanup
      return () => clearInterval(id);
    }
  }, [delay]);
}
