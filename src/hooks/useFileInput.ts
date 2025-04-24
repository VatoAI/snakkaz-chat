
import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

interface UseFileInputProps {
  setSelectedFile: (file: File | null) => void;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
}

export const useFileInput = ({ 
  setSelectedFile, 
  maxSizeInMB = 10, 
  acceptedTypes 
}: UseFileInputProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Size validation
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Please select a file smaller than ${maxSizeInMB}MB`,
        variant: "destructive"
      });
      return false;
    }

    // Type validation if enabled
    if (acceptedTypes && acceptedTypes.length > 0) {
      const fileType = file.type.split('/')[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!acceptedTypes.some(type => 
        file.type.includes(type) || 
        type.includes(fileExtension || '')
      )) {
        toast({
          title: "Unsupported file type",
          description: `Please select a ${acceptedTypes.join(', ')} file`,
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    console.log("File input change event triggered");
    
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      console.log("No files selected");
      return;
    }
    
    const file = files[0];
    console.log("Selected file:", file.name, file.size, file.type);
    
    if (validateFile(file)) {
      console.log("File validation passed, setting selected file");
      setSelectedFile(file);
      toast({
        title: "File selected",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      });
    } else {
      console.log("File validation failed");
      // Reset the input
      e.target.value = "";
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
