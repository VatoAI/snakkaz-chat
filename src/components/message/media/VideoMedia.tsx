
import { useState } from "react";
import { Lock, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SecureMediaIcon } from "./SecureMediaIcon";

interface VideoMediaProps {
  url: string;
  mediaType: string;
}

export const VideoMedia = ({ url, mediaType }: VideoMediaProps) => {
  return (
    <div className="relative group mt-2">
      <video 
        controls 
        className="max-w-full w-full rounded-lg"
        controlsList="nodownload"
      >
        <source src={url} type={mediaType} />
        Your browser doesn't support video playback.
      </video>
      <SecureMediaIcon position="top-right" size="sm" />
    </div>
  );
};
