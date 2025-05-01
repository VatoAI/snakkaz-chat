import React from 'react';

interface UploadProgressProps {
  progress: number;
  status: 'uploading' | 'error' | 'success';
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  status
}) => {
  if (status !== 'uploading') return null;
  
  return (
    <div className="mt-1.5 px-2">
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};