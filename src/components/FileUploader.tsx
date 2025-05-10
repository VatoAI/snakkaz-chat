
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  accept = '*/*',
  multiple = false,
  maxSize
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div
      className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
        isDragging 
          ? 'border-cybergold-400 bg-cyberdark-800' 
          : 'border-cyberdark-700 bg-cyberdark-900 hover:bg-cyberdark-800'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col items-center gap-2">
        <div className="p-3 rounded-full bg-cyberdark-800">
          <Upload className="h-6 w-6 text-cybergold-400" />
        </div>
        <div className="text-sm font-medium text-cybergold-300">
          {multiple ? 'Upload files' : 'Upload a file'}
        </div>
        <div className="text-xs text-cybergold-500">
          Drag & drop or click to browse
        </div>
        {maxSize && (
          <div className="text-xs text-cybergold-500">
            Max size: {maxSize}MB
          </div>
        )}
      </div>
    </div>
  );
};
