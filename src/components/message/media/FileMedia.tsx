
import { File, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FileMediaProps {
  url: string;
  fileName: string;
  mediaType: string;
}

export const FileMedia = ({ url, fileName, mediaType }: FileMediaProps) => {
  return (
    <div className="mt-2 p-3 border border-cyberdark-700 rounded-lg bg-cyberdark-900/50 flex items-center relative group">
      <File className="h-6 w-6 text-cybergold-400 mr-3" />
      <div className="flex-1 min-w-0">
        <p className="text-cybergold-200 text-sm truncate">
          {fileName}
        </p>
        <p className="text-xs text-cyberdark-400">
          {mediaType || "Document"}
        </p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="text-cybergold-300 hover:text-cybergold-200"
        onClick={() => window.open(url, '_blank')}
      >
        Open
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute top-2 right-2 bg-cyberdark-900/80 p-1 rounded-full">
            <Lock className="h-3 w-3 text-green-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="text-xs">End-to-end encrypted media</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
