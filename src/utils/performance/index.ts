/**
 * Performance utilities for Snakkaz Chat
 * Collection of utilities to improve application performance
 */

// Debounce function to limit the rate at which a function can fire
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function to ensure a function is called at most once in a specified time period
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// RAF throttle - using requestAnimationFrame for smoother animations
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let throttled = false;
  
  return function(...args: Parameters<T>): void {
    if (!throttled) {
      throttled = true;
      requestAnimationFrame(() => {
        func(...args);
        throttled = false;
      });
    }
  };
}

// Measures execution time of a function (for performance debugging)
export function measureExecutionTime<T extends (...args: any[]) => any>(
  func: T,
  funcName: string = 'Function'
): (...args: Parameters<T>) => ReturnType<T> {
  return function(...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    console.log(`${funcName} took ${end - start}ms to execute`);
    return result;
  };
}

// Image loading optimization - loads images when they're about to enter the viewport
export function lazyLoadImage(imgElement: HTMLImageElement) {
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    imgElement.loading = 'lazy';
  } else {
    // Fallback to IntersectionObserver for older browsers
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          observer.unobserve(img);
        }
      });
    });
    
    observer.observe(imgElement);
  }
}

// Idle callback wrapper - runs non-critical tasks during browser idle periods
export function runWhenIdle(callback: () => void, timeout: number = 2000): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, { timeout });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 1);
  }
}
