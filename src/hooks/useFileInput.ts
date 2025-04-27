import { useRef, useState, useCallback } from "react";

export interface UseFileInputOptions {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeInMB?: number;
  onError?: (error: string) => void;
}

export interface UseFileInputReturn {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  videoInputRef: React.MutableRefObject<HTMLInputElement | null>;
  cameraInputRef: React.MutableRefObject<HTMLInputElement | null>;
  documentInputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  open: (type?: 'file' | 'video' | 'camera' | 'document') => void;
  getRootProps: () => {
    onClick: (e: React.MouseEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  getInputProps: () => {
    ref: React.MutableRefObject<HTMLInputElement | null>;
    type: string;
    accept?: string;
    multiple?: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    style: { display: string };
  };
  isDragActive: boolean;
}

export const useFileInput = ({ 
  onFilesSelected, 
  accept, 
  multiple = false, 
  maxSizeInMB = 50,
  onError
}: UseFileInputOptions): UseFileInputReturn => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const validateFiles = useCallback((files: File[]): File[] => {
    if (!files.length) return [];
    
    // Validate file size
    if (maxSizeInMB) {
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      const validFiles = files.filter(file => {
        if (file.size > maxSizeInBytes) {
          onError?.(`File "${file.name}" exceeds maximum size of ${maxSizeInMB}MB`);
          return false;
        }
        return true;
      });
      
      return validFiles;
    }
    
    return files;
  }, [maxSizeInMB, onError]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const validFiles = validateFiles(fileArray);
      
      if (validFiles.length) {
        onFilesSelected(validFiles);
      }
      
      // Reset the input value to allow selecting the same file again
      event.target.value = '';
    }
  }, [onFilesSelected, validateFiles]);

  // Open function that can target different input types
  const open = useCallback((type: 'file' | 'video' | 'camera' | 'document' = 'file') => {
    switch (type) {
      case 'video':
        videoInputRef.current?.click();
        break;
      case 'camera':
        cameraInputRef.current?.click();
        break;
      case 'document':
        documentInputRef.current?.click();
        break;
      case 'file':
      default:
        fileInputRef.current?.click();
        break;
    }
  }, []);

  // Enhanced drag and drop functionality
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const filesToProcess = multiple ? droppedFiles : [droppedFiles[0]];
      const validFiles = validateFiles(filesToProcess);
      
      if (validFiles.length) {
        onFilesSelected(validFiles);
      }
    }
  }, [multiple, onFilesSelected, validateFiles]);

  // Get props for the root element (drop zone)
  const getRootProps = useCallback(() => ({
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      open();
    },
    onDragOver,
    onDragLeave,
    onDrop
  }), [open, onDragOver, onDragLeave, onDrop]);

  // Get props for the input element
  const getInputProps = useCallback(() => ({
    ref: fileInputRef,
    type: 'file',
    accept,
    multiple,
    onChange: handleFileSelect,
    style: { display: 'none' }
  }), [accept, multiple, handleFileSelect]);

  return {
    fileInputRef,
    videoInputRef,
    cameraInputRef,
    documentInputRef,
    handleFileSelect,
    open,
    getRootProps,
    getInputProps,
    isDragActive
  };
};
