import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  X, 
  File, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Music,
  Paperclip,
  Check,
  AlertCircle,
  Download
} from 'lucide-react';

interface FileUploadZoneProps {
  onFileSelect: (files: File[]) => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in bytes
  acceptedTypes?: string[];
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
  id: string;
}

const FileTypeIcons: Record<string, React.ElementType> = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  text: FileText,
  application: File,
  default: File,
};

const getFileIcon = (fileType: string) => {
  const mainType = fileType.split('/')[0];
  const IconComponent = FileTypeIcons[mainType] || FileTypeIcons.default;
  return IconComponent;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
      resolve(''); // No preview for non-image files
    }
  });
};

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  maxFiles = 5,
  maxSizePerFile = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/*', 'video/*', 'audio/*', 'text/*', 'application/pdf'],
  className,
  disabled = false,
  children
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizePerFile) {
      return `Filen "${file.name}" er for stor. Maks størrelse er ${formatFileSize(maxSizePerFile)}.`;
    }

    // Check file type
    const isAccepted = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isAccepted) {
      return `Filtypen "${file.type}" er ikke støttet.`;
    }

    return null;
  };

  const handleFileSelection = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    const errors: string[] = [];

    // Validate each file
    const validFiles = fileArray.filter(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
        return false;
      }
      return true;
    });

    // Check total file count
    if (selectedFiles.length + validFiles.length > maxFiles) {
      errors.push(`Du kan ikke velge mer enn ${maxFiles} filer.`);
      return;
    }

    // Show errors if any
    if (errors.length > 0) {
      toast({
        title: 'Filopplasting feilet',
        description: errors.join('\n'),
        variant: 'destructive',
      });
      return;
    }

    // Add valid files
    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  }, [selectedFiles, maxFiles, maxSizePerFile, acceptedTypes, toast, onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files);
    }
  }, [disabled, handleFileSelection]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // If children are provided, render as a simple trigger
  if (children) {
    return (
      <div onClick={openFileDialog} className="cursor-pointer">
        {children}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300',
          isDragOver 
            ? 'border-cybergold-400 bg-cybergold-500/10 scale-[1.02]' 
            : 'border-cyberdark-600 hover:border-cybergold-600',
          disabled && 'opacity-50 cursor-not-allowed',
          'group'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className={cn(
          'flex flex-col items-center gap-2 transition-transform duration-300',
          isDragOver && 'scale-110'
        )}>
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300',
            isDragOver 
              ? 'bg-cybergold-500/20 text-cybergold-400' 
              : 'bg-cyberdark-700 text-cybergold-500 group-hover:bg-cyberdark-600'
          )}>
            <Upload className="w-6 h-6" />
          </div>
          
          <div>
            <p className="text-sm font-medium text-cybergold-300">
              {isDragOver ? 'Slipp filene her' : 'Klikk for å velge filer eller dra og slipp'}
            </p>
            <p className="text-xs text-cybergold-500 mt-1">
              Maks {maxFiles} filer, {formatFileSize(maxSizePerFile)} per fil
            </p>
          </div>
        </div>
      </div>

      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-cybergold-300">
            Valgte filer ({selectedFiles.length}):
          </p>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => {
              const IconComponent = getFileIcon(file.type);
              
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 p-2 bg-cyberdark-800/50 rounded-lg border border-cyberdark-700"
                >
                  <div className="w-8 h-8 rounded bg-cyberdark-700 flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-cybergold-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cybergold-300 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-cybergold-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="w-6 h-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload progress for individual files */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-cybergold-300">
            Laster opp...
          </p>
          
          {uploadingFiles.map((uploadFile) => (
            <div
              key={uploadFile.id}
              className="flex items-center gap-3 p-2 bg-cyberdark-800/50 rounded-lg border border-cyberdark-700"
            >
              <div className="w-8 h-8 rounded bg-cyberdark-700 flex items-center justify-center">
                {uploadFile.status === 'completed' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : uploadFile.status === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <Upload className="w-4 h-4 text-cybergold-400 animate-pulse" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cybergold-300 truncate">
                  {uploadFile.file.name}
                </p>
                
                {uploadFile.status === 'uploading' && (
                  <Progress 
                    value={uploadFile.progress} 
                    className="h-1 mt-1"
                  />
                )}
                
                {uploadFile.status === 'error' && (
                  <p className="text-xs text-red-400 mt-1">
                    {uploadFile.error || 'Opplasting feilet'}
                  </p>
                )}
                
                {uploadFile.status === 'completed' && (
                  <p className="text-xs text-green-400 mt-1">
                    Ferdig
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple file upload button component
export const FileUploadButton: React.FC<{
  onFileSelect: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'icon';
}> = ({
  onFileSelect,
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024,
  acceptedTypes = ['image/*', 'video/*', 'audio/*'],
  disabled = false,
  className,
  variant = 'default'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(Array.from(files));
    }
  };

  if (variant === 'icon') {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            'w-8 h-8 p-0 rounded-full text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700',
            className
          )}
        >
          <Paperclip className="w-4 h-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
      </>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleClick}
        disabled={disabled}
        className={cn('gap-2', className)}
      >
        <Paperclip className="w-4 h-4" />
        Legg ved fil
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={acceptedTypes.join(',')}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
    </>
  );
};

export default FileUploadZone;
