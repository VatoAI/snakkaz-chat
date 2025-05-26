import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Paperclip } from 'lucide-react';
import { cx, theme } from '../lib/theme';

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
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (!file) return;
    
    // File type validation
    if (!allowedTypes.includes(file.type)) {
      setError(`Ugyldig filtype. Tillatte typer: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`);
      return;
    }
    
    // File size validation
    if (file.size > maxSizeBytes) {
      setError(`Filen er for stor. Maksimal størrelse er ${maxSizeMB} MB.`);
      return;
    }
    
    // Generate preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Pass file to parent
    onFileSelect(file);
  };
  
  const handleCancel = () => {
    setPreviewUrl(null);
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
      
      {/* Preview eller opplastingsknapp */}
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
          'relative rounded-md overflow-hidden',
          theme.shadows.md
        )}>
          {/* Bilde forhåndsvisning */}
          {previewUrl && (
            <div className="aspect-video relative">
              <img 
                src={previewUrl}
                alt="Forhåndsvisning" 
                className="w-full h-full object-contain bg-cyberdark-900"
              />
              <button
                onClick={handleCancel}
                className={cx(
                  'absolute top-2 right-2 rounded-full p-1',
                  theme.colors.background.tertiary,
                  'hover:bg-red-500/50'
                )}
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          )}
          
          {/* Laster... indikator */}
          {isUploading && (
            <div className="absolute inset-0 bg-cyberdark-950/70 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-cybergold-400 border-t-transparent"></div>
            </div>
          )}
        </div>
      )}
      
      {/* Feilmelding */}
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};