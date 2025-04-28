
import { Image, Video, Camera, Paperclip } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FileDropdownMenuProps {
  isDisabled: boolean;
  onImageClick: () => void;
  onVideoClick: () => void;
  onCameraClick: () => void;
  onDocumentClick: () => void;
}

export const FileDropdownMenu = ({
  isDisabled,
  onImageClick,
  onVideoClick,
  onCameraClick,
  onDocumentClick
}: FileDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800/50 transition-colors"
          disabled={isDisabled}
        >
          <Paperclip className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-cyberdark-900 border-cybergold-500/30">
        <DropdownMenuItem
          onClick={onImageClick}
          className="flex items-center gap-2 text-sm text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
        >
          <Image className="w-4 h-4" />
          <span>Bilde</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onVideoClick}
          className="flex items-center gap-2 text-sm text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
        >
          <Video className="w-4 h-4" />
          <span>Video</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onCameraClick}
          className="flex items-center gap-2 text-sm text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
        >
          <Camera className="w-4 h-4" />
          <span>Ta bilde</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDocumentClick}
          className="flex items-center gap-2 text-sm text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
        >
          <Paperclip className="w-4 h-4" />
          <span>Dokument</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
