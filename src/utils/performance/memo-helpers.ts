/**
 * Memoization utilities for Snakkaz Chat
 * These utilities help with caching expensive function calls
 */
import { useMemo, useCallback, useState, useEffect } from 'react';

// Simple memoization for any function (non-React)
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

// LRU Cache implementation for memoization with size limits
export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;
  
  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map<K, V>();
  }
  
  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    // Refresh the key by removing and re-adding it
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove the least recently used item (first item in the Map)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
}

// Memoization with LRU cache
export function memoizeWithLRU<T extends (...args: any[]) => any>(
  func: T,
  cacheSize: number = 100,
  resolver?: (...args: Parameters<T>) => string
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new LRUCache<string, ReturnType<T>>(cacheSize);
  
  return function(...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    const cachedResult = cache.get(key);
    
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    
    const result = func(...args);
    cache.put(key, result);
    return result;
  };
}

// Hook for memoized state with dependencies (similar to useMemo but with explicit controls)
export function useMemoizedState<T>(
  initialValue: T | (() => T),
  dependencies: React.DependencyList = []
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);
  
  useEffect(() => {
    if (typeof initialValue === 'function') {
      setState((initialValue as () => T)());
    } else {
      setState(initialValue);
    }
  }, dependencies);
  
  return [state, setState];
}

// Hook for creating a stable object reference even with changing properties
export function useStableObject<T extends object>(obj: T): T {
  return useMemo(() => obj, Object.values(obj));
}

// Create a memoized selector for redux-like state slices
export function createSelector<State, Result>(
  selector: (state: State) => Result
): (state: State) => Result {
  const memoizedSelector = memoize(selector);
  return memoizedSelector;
}

// Higher-order component for component memoization with custom comparison
export function withMemoization<P extends object>(
  Component: React.ComponentType<P>,
  areEqual: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean = 
    (prev, next) => Object.keys(prev).length === Object.keys(next).length && 
      Object.keys(prev).every(key => prev[key as keyof P] === next[key as keyof P])
): React.MemoExoticComponent<React.FunctionComponent<P>> {
  const MemoizedComponent = React.memo(
    (props: P) => <Component {...props} />,
    areEqual
  );
  return MemoizedComponent;
}
