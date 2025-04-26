import { useCallback, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseFileInputOptions {
  onFilesSelected: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
}

export const useFileInput = (options: UseFileInputOptions) => {
  const { toast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);

  const validateFile = (file: File): boolean => {
    // Add validation logic here if needed
    return true;
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      const validFiles = Array.from(files).filter(validateFile);

      if (validFiles.length > 0) {
        options.onFilesSelected(files);
      } else {
        toast({
          title: "Invalid file(s)",
          description: "Some files did not meet the validation criteria.",
          variant: "destructive",
        });
      }
      e.dataTransfer.clearData();
    }
  }, [options, toast]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) {
      setIsDragActive(true);
    }
  }, [isDragActive]);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      const validFiles = Array.from(files).filter(validateFile);

      if (validFiles.length > 0) {
        options.onFilesSelected(files);
      } else {
        toast({
          title: "Invalid file(s)",
          description: "Some files did not meet the validation criteria.",
          variant: "destructive",
        });
      }
    }
  }, [options, toast]);

  const open = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = options.accept || '';
    input.multiple = options.multiple || false;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const files = target.files;
        const validFiles = Array.from(files).filter(validateFile);

        if (validFiles.length > 0) {
          options.onFilesSelected(files);
        } else {
          toast({
            title: "Invalid file(s)",
            description: "Some files did not meet the validation criteria.",
            variant: "destructive",
          });
        }
      }
    };
    input.click();
  }, [options, toast]);

  const getRootProps = useCallback(() => {
    return {
      onDrop,
      onDragOver,
      onDragLeave,
      onClick: (e: React.MouseEvent) => e.stopPropagation(),
    };
  }, [onDrop, onDragOver, onDragLeave]);

  const getInputProps = useCallback(() => {
    return {
      onChange: onInputChange,
      accept: options.accept || '',
      multiple: options.multiple || false,
      style: { display: 'none' },
    };
  }, [onInputChange, options.accept, options.multiple]);

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
  };
};
