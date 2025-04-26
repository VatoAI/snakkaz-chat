import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  retryCount?: number;
  retryDelay?: number;
  onLoadSuccess?: () => void;
  onLoadFail?: () => void;
}

/**
 * A resilient image component that handles loading errors and provides fallbacks
 */
export function ResilientImage({
  src,
  alt,
  className,
  fallback,
  retryCount = 2,
  retryDelay = 1000,
  onLoadSuccess,
  onLoadFail,
  ...props
}: ResilientImageProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [attempts, setAttempts] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset state when source changes
  useEffect(() => {
    if (src !== imgSrc) {
      setImgSrc(src);
      setAttempts(0);
      setHasError(false);
      setIsLoading(true);
    }
  }, [src, imgSrc]);

  // Handle image error with retry logic
  const handleError = () => {
    if (attempts >= retryCount) {
      setHasError(true);
      setIsLoading(false);
      onLoadFail?.();
      return;
    }

    // Add cache-busting parameter to force reload
    const nextAttempt = attempts + 1;
    setAttempts(nextAttempt);
    
    // Wait before retry
    setTimeout(() => {
      if (src) {
        // Add cache-busting parameter
        const cacheBuster = `t=${Date.now()}`;
        const separator = src.includes('?') ? '&' : '?';
        const newSrc = `${src}${separator}${cacheBuster}`;
        setImgSrc(newSrc);
      }
    }, retryDelay);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoadSuccess?.();
  };

  if (hasError) {
    return <>{fallback}</> || null;
  }

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center absolute inset-0">
          <div className="w-5 h-5 border-2 border-t-transparent border-cyberdark-400 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          isLoading ? 'opacity-0' : 'opacity-100',
          'transition-opacity duration-300',
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
}