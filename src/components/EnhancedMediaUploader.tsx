import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Settings, Paperclip, Image as ImageIcon } from 'lucide-react';
import { cx, theme } from '../lib/theme';
import { useEnhancedMediaUpload, ResizeMode, UploadOptions } from '../hooks/useEnhancedMediaUpload';

// Image resize preset options
interface ResizePreset {
  name: string;
  description: string;
  maxWidth: number;
  maxHeight: number;
  quality: number;
  mode: ResizeMode;
}

const RESIZE_PRESETS: ResizePreset[] = [
  {
    name: 'Original',
    description: 'No resizing applied',
    maxWidth: 0,
    maxHeight: 0,
    quality: 1,
    mode: 'none'
  },
  {
    name: 'High Quality',
    description: 'Max 1920px, 90% quality',
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.9,
    mode: 'auto'
  },
  {
    name: 'Balanced',
    description: 'Max 1280px, 85% quality',
    maxWidth: 1280,
    maxHeight: 1280,
    quality: 0.85,
    mode: 'auto'
  },
  {
    name: 'Compact',
    description: 'Max 800px, 80% quality',
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.8,
    mode: 'auto'
  }
];

interface EnhancedMediaUploaderProps {
  onFileSelect?: (file: File) => void;
  onUploadComplete?: (result: any) => void;
  onCancel: () => void;
  selectedFile: File | null;
  maxSizeMB?: number;
  allowedTypes?: string[];
  className?: string;
  buttonText?: string;
  uploadOptions?: Partial<UploadOptions>;
  showResizeOptions?: boolean;
}

export const EnhancedMediaUploader: React.FC<EnhancedMediaUploaderProps> = ({
  onFileSelect,
  onUploadComplete,
  onCancel,
  selectedFile,
  maxSizeMB = 30, // Increased max size since we're compressing
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  className = '',
  buttonText = 'Last opp bilde',
  uploadOptions = {},
  showResizeOptions = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<ResizePreset>(RESIZE_PRESETS[1]); // Default to High Quality
  
  // Get the enhanced upload hook
  const { 
    uploadFile, 
    cancelUpload, 
    uploadState,
    getResumableUploads,
    clearResumableUploads
  } = useEnhancedMediaUpload();
  
  const { isUploading, progress, speed, url } = uploadState;
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  
  // When file is selected or changes
  useEffect(() => {
    if (selectedFile && !previewUrl) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else if (!selectedFile && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [selectedFile, previewUrl]);
  
  // When upload completes
  useEffect(() => {
    if (url && onUploadComplete) {
      onUploadComplete(uploadState);
    }
  }, [url, uploadState, onUploadComplete]);
  
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
    
    // Pass file to parent if callback exists
    if (onFileSelect) {
      onFileSelect(file);
    }
  };
  
  const handleCancel = () => {
    if (isUploading) {
      cancelUpload();
    }
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onCancel();
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      // Create upload options based on selected preset
      const options = {
        ...uploadOptions,
        compress: selectedPreset.mode !== 'none',
        resize: {
          maxWidth: selectedPreset.maxWidth,
          maxHeight: selectedPreset.maxHeight,
          mode: selectedPreset.mode,
          quality: selectedPreset.quality
        }
      };
      
      // Perform the upload
      await uploadFile(selectedFile, options);
    } catch (error) {
      console.error('Upload error:', error);
      setError((error as Error).message);
    }
  };
  
  // Format upload speed in KB/s or MB/s
  const formatSpeed = (bytesPerSecond?: number): string => {
    if (!bytesPerSecond) return '';
    
    if (bytesPerSecond < 1024 * 1024) {
      return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
    } else {
      return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
    }
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
          'relative rounded-md overflow-hidden bg-cyberdark-900',
          theme.shadows.md
        )}>
          {/* Preview image */}
          {previewUrl && (
            <div className="aspect-video relative">
              <img 
                src={previewUrl}
                alt="Preview" 
                className="w-full h-full object-contain bg-cyberdark-900"
              />
              
              {/* Cancel button */}
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
              
              {/* Settings button */}
              {showResizeOptions && selectedFile?.type.startsWith('image/') && (
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={cx(
                    'absolute top-2 left-2 rounded-full p-1',
                    theme.colors.background.tertiary,
                    showSettings && 'bg-cyberblue-600',
                    'hover:bg-cyberblue-600/80'
                  )}
                >
                  <Settings className="h-4 w-4 text-white" />
                </button>
              )}
            </div>
          )}
          
          {/* Resize settings panel */}
          {showSettings && selectedFile?.type.startsWith('image/') && (
            <div className="p-3 border-t border-cyberdark-800">
              <p className="text-xs mb-2 text-cybergold-300">Velg bildekvalitet:</p>
              <div className="grid grid-cols-2 gap-2">
                {RESIZE_PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => setSelectedPreset(preset)}
                    className={cx(
                      'px-2 py-1 rounded text-left text-xs',
                      selectedPreset.name === preset.name 
                        ? 'bg-cyberblue-600 text-white' 
                        : 'bg-cyberdark-800 text-cybergold-400 hover:bg-cyberdark-700'
                    )}
                  >
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs opacity-80">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Upload progress */}
          {isUploading && (
            <div className="absolute inset-0 bg-cyberdark-950/80 flex flex-col items-center justify-center">
              <div className="w-3/4 bg-cyberdark-800 rounded-full h-2 mb-2">
                <div 
                  className="bg-cyberblue-500 h-2 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between w-3/4">
                <span className="text-xs text-cybergold-400">{Math.round(progress)}%</span>
                {speed && <span className="text-xs text-cybergold-400">{formatSpeed(speed)}</span>}
              </div>
            </div>
          )}
          
          {/* Upload button */}
          {!isUploading && selectedFile && !url && (
            <div className="p-2 border-t border-cyberdark-800 flex justify-end">
              <button
                onClick={handleUpload}
                className={cx(
                  'px-3 py-1 rounded text-sm flex items-center',
                  'bg-cyberblue-600 text-white hover:bg-cyberblue-500'
                )}
              >
                <Upload className="mr-2 h-4 w-4" />
                Last opp
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
      
      {/* Success message */}
      {url && (
        <p className="text-xs text-green-400 mt-1">Opplastingen er fullført!</p>
      )}
    </div>
  );
};