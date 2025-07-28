/**
 * Supabase Preview Environment Indicator
 * 
 * This component shows an indicator when the app is running
 * in a Supabase preview environment. It can be used anywhere
 * in the application to inform users they're testing with preview data.
 */

import React from 'react';
import { shouldShowPreviewNotice, getPreviewDisplayInfo } from '@/utils/supabase/preview-fix';

interface PreviewIndicatorProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * A component that shows when the app is running in a preview environment
 */
export const PreviewIndicator: React.FC<PreviewIndicatorProps> = ({
  className = '',
  showLabel = true,
}) => {
  // Only show if we're in a preview environment
  if (!shouldShowPreviewNotice()) {
    return null;
  }

  const previewInfo = getPreviewDisplayInfo();
  const dotClassName = "w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-1";
  
  return (
    <div className={`flex items-center text-xs ${className}`}>
      <span className={dotClassName}></span>
      {showLabel && (
        <span className="text-amber-400">
          {previewInfo.isPR 
            ? `PR #${previewInfo.prNumber}` 
            : previewInfo.branch}
        </span>
      )}
    </div>
  );
};

/**
 * A component that shows a banner for preview environments
 */
export const PreviewBanner: React.FC = () => {
  // Only show if we're in a preview environment
  if (!shouldShowPreviewNotice()) {
    return null;
  }

  const previewInfo = getPreviewDisplayInfo();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-600 text-black p-2 text-xs sm:text-sm text-center z-50">
      {previewInfo.isPR 
        ? `Testing Preview Environment for PR #${previewInfo.prNumber}` 
        : `Testing Preview Environment: ${previewInfo.branch}`}
    </div>
  );
};

export default PreviewIndicator;
