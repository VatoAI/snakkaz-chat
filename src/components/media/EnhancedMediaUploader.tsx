
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '../FileUploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image, Upload, X } from 'lucide-react';

interface EnhancedMediaUploaderProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSizeInMB?: number;
  multiple?: boolean;
  label?: string;
}

export function EnhancedMediaUploader({
  onUpload,
  accept = "image/*",
  maxSizeInMB = 5,
  multiple = false,
  label = "Upload Media"
}: EnhancedMediaUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeInMB}MB`);
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setError(null);
    
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };
  
  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        
        {!selectedFile ? (
          <FileUploader
            onFilesSelected={handleFileSelected}
            accept={accept}
            multiple={multiple}
          />
        ) : (
          <div className="bg-cyberdark-800 border border-cyberdark-700 rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-cybergold-300">{selectedFile.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearSelection}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {preview && (
              <div className="relative w-full h-32 bg-cyberdark-900 rounded-md overflow-hidden mb-2">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="object-contain w-full h-full"
                />
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-2">
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-sm text-red-500 mt-1">{error}</div>
      )}
    </div>
  );
}

export default EnhancedMediaUploader;
