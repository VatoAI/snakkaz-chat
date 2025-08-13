
/**
 * Safely access nested object properties
 * @param obj The object to access
 * @param path Path to the property, using dot notation
 * @param fallback Fallback value if property doesn't exist
 */
export function safeAccess<T>(obj: any, path: string, fallback: T): T {
  try {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined) {
        return fallback;
      }
      current = current[key];
    }
    
    return current === undefined ? fallback : current;
  } catch (e) {
    console.error(`Error accessing path ${path}:`, e);
    return fallback;
  }
}

/**
 * Safely call a function with given arguments
 * @param fn The function to call
 * @param args Arguments to pass to the function
 * @param fallback Fallback value if function doesn't exist or throws
 */
export function safeCall<T>(fn: any, args: any[] = [], fallback: T): T {
  try {
    if (typeof fn !== 'function') {
      return fallback;
    }
    return fn(...args);
  } catch (e) {
    console.error(`Error calling function:`, e);
    return fallback;
  }
}
