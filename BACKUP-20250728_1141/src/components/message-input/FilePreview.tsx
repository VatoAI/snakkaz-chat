
import { Button } from "@/components/ui/button";
import { X, FileText, Image, Video, File } from "lucide-react";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  if (!file) return null;
  
  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4 text-cybergold-300" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-4 w-4 text-cybergold-300" />;
    } else if (file.type.includes('pdf') || file.type.includes('document')) {
      return <FileText className="h-4 w-4 text-cybergold-300" />;
    } else {
      return <File className="h-4 w-4 text-cybergold-300" />;
    }
  };
  
  return (
    <div className="flex items-center gap-2 bg-cyberdark-800 px-2 py-1 rounded">
      {getFileIcon()}
      <span className="text-sm text-cybergold-400 truncate max-w-[100px]">
        {file.name}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
