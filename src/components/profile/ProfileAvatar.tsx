import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getAvatarUrl } from "@/utils/avatar-utils";
import { ResilientImage } from "@/components/ui/resilient-image";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  uploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatar = ({ avatarUrl, uploading, onUpload }: ProfileAvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // Process avatar URL
  useEffect(() => {
    if (avatarUrl) {
      // Use our utility to get a properly formed URL with error handling
      const url = getAvatarUrl(avatarUrl);
      setImageUrl(url);
      setImageError(false);
    } else {
      setImageUrl('');
    }
  }, [avatarUrl]);

  // Prepare fallback content
  const fallbackContent = (
    <AvatarFallback className="bg-cyberdark-950 text-cybergold-300">
      <Camera className="w-12 h-12 text-cyberblue-400/70" />
    </AvatarFallback>
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-tr from-cyberblue-500 via-cybergold-500 to-cyberred-500 rounded-full opacity-70 group-hover:opacity-100 blur transition duration-500"></div>
        <Avatar className="w-32 h-32 relative hover:scale-105 transition-transform duration-300 cursor-pointer group-hover:shadow-neon-dual border-4 border-cybergold-400/80 bg-cyberdark-800">
          {imageUrl ? (
            <div className="absolute inset-0 w-full h-full">
              <ResilientImage
                src={imageUrl}
                alt="Profile Avatar"
                className="w-full h-full object-cover rounded-full"
                fallback={fallbackContent}
                retryCount={3}
                retryDelay={1500}
                onLoadFail={() => setImageError(true)}
              />
            </div>
          ) : fallbackContent}
        </Avatar>
      </div>
      
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={onUpload}
          disabled={uploading}
          className="hidden"
          id="avatar-upload"
        />
        <Button
          onClick={() => document.getElementById('avatar-upload')?.click()}
          disabled={uploading}
          className="bg-gradient-to-r from-cyberblue-500 via-cybergold-500 to-cyberred-500 hover:from-cyberblue-600 hover:to-cyberred-600 text-black shadow-neon-dual transition-all duration-300 hover:scale-105"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Laster opp...
            </>
          ) : (
            'Last opp nytt profilbilde'
          )}
        </Button>
      </div>
    </div>
  );
};

