import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  placeholderClassName?: string;
}

/**
 * Optimized Image component with lazy loading, blur-up effect, and error handling
 */
export function Image({
  src,
  alt,
  className,
  fallbackSrc = '/placeholder.svg',
  placeholderClassName,
  ...props
}: ImageProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    setError(false);
    
    if (src) {
      // Reset states when src changes
      setImgSrc(undefined);
      
      const img = new window.Image();
      img.src = src as string;
      
      img.onload = () => {
        setImgSrc(src);
        setIsLoading(false);
      };
      
      img.onerror = () => {
        setImgSrc(fallbackSrc);
        setError(true);
        setIsLoading(false);
      };
    }
  }, [src, fallbackSrc]);
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div 
          className={cn(
            "absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse rounded", 
            placeholderClassName
          )}
        />
      )}
      
      <img
        src={imgSrc || fallbackSrc}
        alt={alt}
        loading="lazy"
        className={cn(
          "transition-opacity duration-300 ease-in-out",
          isLoading ? "opacity-0" : "opacity-100",
          error ? "grayscale-[50%] opacity-80" : "",
          className
        )}
        {...props}
      />
    </div>
  );
}