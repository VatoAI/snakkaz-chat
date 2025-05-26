
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, Image, Upload, X } from 'lucide-react';

interface EnhancedMediaUploaderProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number; // In bytes
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  disabled?: boolean;
  productType?: string;
  productId?: string;
}

const EnhancedMediaUploader: React.FC<EnhancedMediaUploaderProps> = ({
  onUpload,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  isOpen,
  onClose,
  title = 'Upload Media',
  disabled = false,
  productType,
  productId
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Reset error state
    setError(null);
    
    // Validate file type
    if (!file.type.match(accept.replace('*', ''))) {
      setError(`Invalid file type. Please upload a ${accept} file.`);
      return;
    }
    
    // Validate file size
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
      return;
    }
    
    // Create preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    // Call the onUpload callback
    onUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-200">{title}</DialogTitle>
        </DialogHeader>
        
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-all ${
            isDragging ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleTriggerFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
          
          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="Preview" className="max-h-64 rounded-md" />
              <button
                className="absolute top-2 right-2 bg-gray-800 p-1 rounded-full hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                }}
              >
                <X className="h-4 w-4 text-gray-200" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="bg-gray-800 p-4 rounded-full">
                {accept.includes('image') ? (
                  <Image className="h-8 w-8 text-gray-400" />
                ) : accept.includes('video') ? (
                  <Camera className="h-8 w-8 text-gray-400" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="text-gray-400">
                <p>Click to browse or drag and drop</p>
                <p className="text-sm">Maximum file size: {maxSize / (1024 * 1024)}MB</p>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
        
        <div className="flex justify-end space-x-2 mt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            disabled={!preview || disabled}
            onClick={() => {
              // Submit functionality would typically be handled by the onUpload callback
              onClose();
            }}
          >
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedMediaUploader;
