import { useRef } from "react";

export interface UseFileInputOptions {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}

export interface UseFileInputReturn {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  videoInputRef: React.MutableRefObject<HTMLInputElement | null>;
  cameraInputRef: React.MutableRefObject<HTMLInputElement | null>;
  documentInputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  open: () => void;
  getRootProps: () => { onClick: (e: React.MouseEvent) => void };
  getInputProps: () => {
    ref: React.MutableRefObject<HTMLInputElement | null>;
    type: string;
    accept?: string;
    multiple?: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    style: { display: string };
  };
}

export const useFileInput = ({ onFilesSelected, accept, multiple }: UseFileInputOptions): UseFileInputReturn => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      onFilesSelected(fileArray);
    }
  };

  // Add the open function to programmatically trigger file selection
  const open = () => {
    fileInputRef.current?.click();
  };

  // Add getRootProps and getInputProps for drag-n-drop functionality
  const getRootProps = () => ({
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      open();
    }
  });

  const getInputProps = () => ({
    ref: fileInputRef,
    type: 'file',
    accept,
    multiple,
    onChange: handleFileSelect,
    style: { display: 'none' }
  });

  return {
    fileInputRef,
    videoInputRef,
    cameraInputRef,
    documentInputRef,
    handleFileSelect,
    open,
    getRootProps,
    getInputProps
  };
};
