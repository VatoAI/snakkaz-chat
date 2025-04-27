
import { useRef } from "react";

export interface UseFileInputOptions {
  setSelectedFile: (file: File | null) => void;
}

export const useFileInput = ({ setSelectedFile }: UseFileInputOptions) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  return {
    fileInputRef,
    videoInputRef,
    cameraInputRef,
    documentInputRef,
    handleFileSelect
  };
};
