
import { useFileInput } from "@/hooks/useFileInput";
import { FileDropdownMenu } from "./FileDropdownMenu";
import { FilePreview } from "./FilePreview";

interface FileInputsProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  isLoading: boolean;
  isRecording: boolean;
  isMobile?: boolean;
}

export const FileInputs = ({ 
  selectedFile, 
  setSelectedFile, 
  isLoading, 
  isRecording,
  isMobile = false
}: FileInputsProps) => {
  const {
    fileInputRef,
    videoInputRef,
    cameraInputRef,
    documentInputRef,
    handleFileSelect
  } = useFileInput({ setSelectedFile });

  const isDisabled = isLoading || isRecording;

  return (
    <>
      {selectedFile && (
        <FilePreview file={selectedFile} onRemove={() => setSelectedFile(null)} />
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleFileSelect}
        accept="video/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
      <input
        type="file"
        ref={documentInputRef}
        onChange={handleFileSelect}
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        className="hidden"
      />

      <FileDropdownMenu 
        isDisabled={isDisabled}
        onImageClick={() => fileInputRef.current?.click()}
        onVideoClick={() => videoInputRef.current?.click()}
        onCameraClick={() => cameraInputRef.current?.click()}
        onDocumentClick={() => documentInputRef.current?.click()}
      />
    </>
  );
};
