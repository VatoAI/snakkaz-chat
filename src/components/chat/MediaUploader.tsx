import React, { useRef, useState } from 'react';
import { UploadCloud, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cx, theme } from '../lib/theme';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface MediaUploaderProps {
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  selectedFile: File | null;
  isUploading?: boolean;
  maxSizeMB?: number;
  buttonText?: string;
  uploadProgress?: number;
  isMobile?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onFileSelect,
  onCancel,
  selectedFile,
  isUploading = false,
  maxSizeMB = 5,
  buttonText = "Velg fil",
  uploadProgress = 0,
  isMobile = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Filen er for stor. Maksimal størrelse er ${maxSizeMB}MB.`);
      return;
    }
    
    setError(null);
    onFileSelect(file);
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        className="hidden"
      />
      
      {!selectedFile ? (
        <div className="flex flex-col items-center justify-center">
          <Button
            onClick={handleButtonClick}
            variant="outline"
            className={cx(
              "w-full flex items-center justify-center gap-2 py-6",
              isMobile && "mobile-touch-target",
              theme.colors.border.medium,
              "bg-cyberdark-800 hover:bg-cyberdark-700"
            )}
          >
            <UploadCloud className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} text-cybergold-400`} />
            <span className="text-cybergold-400">{buttonText}</span>
          </Button>
          
          {error && (
            <div className="mt-2 text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          <p className="mt-2 text-xs text-cybergold-500">
            Støttede formater: bilder, video, lyd, PDF og dokumenter. Maks {maxSizeMB}MB.
          </p>
        </div>
      ) : (
        <div className="border border-dashed rounded-md p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-sm text-cybergold-300 truncate max-w-[250px]">
                {selectedFile.name}
              </div>
              <div className="text-xs text-cybergold-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)}MB
              </div>
            </div>
            
            {!isUploading && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className={`h-6 w-6 text-cybergold-400 hover:text-cybergold-300 ${isMobile ? 'mobile-touch-target' : ''}`}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isUploading && (
            <div className="space-y-1">
              <Progress value={uploadProgress} className="h-1" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-cybergold-400">Laster opp...</span>
                <span className="text-xs text-cybergold-400">{uploadProgress}%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
