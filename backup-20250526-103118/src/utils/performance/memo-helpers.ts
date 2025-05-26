import { useCallback, useMemo, useRef, useEffect, useState, DependencyList } from 'react';

/**
 * En forbedret versjon av useCallback som kun oppdateres når inputverdier faktisk endres
 */
export function useDeepCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  // Bruk en ref for å holde den forrige deps-verdien for sammenligning
  const depsRef = useRef<DependencyList>(deps);
  
  // Sammenlign den gamle og nye deps-listen
  const hasChanged = deps.some((dep, i) => {
    return !Object.is(dep, depsRef.current[i]);
  });
  
  // Oppdatere ref hvis noe har endret seg
  if (hasChanged) {
    depsRef.current = deps;
  }
  
  // Bruk en ref for å holde den nyeste callback-funksjonen
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Returner en memoisert versjon som kun oppdateres når deps faktisk endres
  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, [hasChanged]) as T;
}

/**
 * En hook som memoiserer en verdi og kun trigger re-render når verdien faktisk endres
 */
export function useDeepMemo<T>(factory: () => T, deps: DependencyList): T {
  // Bruk en ref for å holde den forrige deps-verdien for sammenligning
  const depsRef = useRef<DependencyList>(deps);
  
  // Sammenlign den gamle og nye deps-listen
  const hasChanged = deps.some((dep, i) => {
    return !Object.is(dep, depsRef.current[i]);
  });
  
  // Oppdatere ref hvis noe har endret seg
  if (hasChanged) {
    depsRef.current = deps;
  }
  
  // Bruk useMemo med en boolsk avhengighet som kun endres når deps faktisk endres
  return useMemo(factory, [hasChanged]);
}

/**
 * En hook for å begrense antall ganger en funksjon kjøres innenfor et gitt tidsvindu
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T, 
  delay: number,
  deps: DependencyList = []
): T {
  const lastRan = useRef(Date.now() - delay);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  return useCallback((...args: any[]) => {
    const now = Date.now();
    
    if (now - lastRan.current >= delay) {
      lastRan.current = now;
      return callback(...args);
    } else {
      // Avbryt den forrige timeouten hvis den finnes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Planlegge kjøring av funksjonen
      return new Promise<ReturnType<T>>((resolve) => {
        timeoutRef.current = setTimeout(() => {
          lastRan.current = Date.now();
          resolve(callback(...args) as ReturnType<T>);
        }, delay - (now - lastRan.current));
      });
    }
  }, [callback, delay, ...deps]) as T;
}
