
import { useState, useRef } from "react";

export const useMessageInputState = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const clearFileInputs = () => {
    setSelectedFile(null);
    const resetFileInput = (input: HTMLInputElement | null) => {
      if (input) input.value = '';
    };
    
    // We don't access the refs directly here since they belong to another component
    // This function will be used by parent component that has access to the refs
    return resetFileInput;
  };
  
  return {
    selectedFile,
    setSelectedFile,
    isRecording,
    setIsRecording,
    clearFileInputs
  };
};
