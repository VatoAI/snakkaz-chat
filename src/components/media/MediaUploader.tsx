import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Paperclip } from 'lucide-react';
import { cx, theme } from '../../lib/theme';

interface MediaUploaderProps {
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  selectedFile: File | null;
  isUploading?: boolean;
  maxSizeMB?: number;
  allowedTypes?: string[];
  className?: string;
  buttonText?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onFileSelect,
  onCancel,
  selectedFile,
  isUploading = false,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = '',
  buttonText = 'Last opp bilde'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size
      if (file.size > maxSizeBytes) {
        setError(`Filen er for stor (maksimum ${maxSizeMB}MB)`);
        return;
      }
      
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        setError(`Filtypen støttes ikke. Støttede formater: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`);
        return;
      }
      
      setError(null);
      
      // Create preview for images
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Pass file to parent if callback exists
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };
  
  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onCancel();
  };
  
  return (
    <div className={cx('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Upload button when no file selected */}
      {!selectedFile && !previewUrl ? (
        <button
          onClick={handleButtonClick}
          disabled={isUploading}
          className={cx(
            'flex items-center border-2 border-dashed rounded-md p-3 w-full',
            theme.colors.border.medium,
            theme.colors.text.secondary,
            theme.animation.normal,
            'hover:border-cybergold-600 hover:bg-cyberdark-900/50'
          )}
        >
          <Paperclip className="mr-2 h-4 w-4" />
          <span>{buttonText}</span>
        </button>
      ) : (
        <div className={cx(
          'relative rounded-lg overflow-hidden bg-cyberdark-900 border border-cyberdark-700',
          theme.shadows.md
        )}>
          {/* Preview image */}
          {previewUrl && (
            <div className="relative max-h-[200px]">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-contain max-h-[200px]"
              />
              <button
                onClick={handleCancel}
                className="absolute top-2 right-2 bg-cyberdark-900/80 rounded-full p-2 hover:bg-cyberdark-800 shadow-lg"
              >
                <X className="h-4 w-4 text-cybergold-400" />
              </button>
            </div>
          )}
          
          {/* Upload controls */}
          <div className="p-3 flex justify-between items-center bg-cyberdark-950 border-t border-cyberdark-700">
            <div className="text-xs text-cybergold-500">
              {selectedFile?.name} ({(selectedFile?.size || 0) / 1024 > 1024 
                ? `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB` 
                : `${((selectedFile?.size || 0) / 1024).toFixed(0)} KB`})
            </div>
            
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="w-16 bg-cyberdark-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cybergold-500 h-full animate-pulse w-full"></div>
                </div>
                <span className="text-xs text-cybergold-500">Laster opp...</span>
              </div>
            ) : (
              <button
                onClick={handleButtonClick}
                className="bg-cybergold-600 hover:bg-cybergold-700 text-black text-xs px-3 py-1.5 rounded flex items-center gap-1 font-medium shadow-md"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Send</span>
              </button>
            )}
          </div>
          
          {/* Error message */}
          {error && (
            <div className="p-2 bg-red-900/20 border-t border-red-900/30">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};