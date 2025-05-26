import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  uploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatar = ({ avatarUrl, uploading, onUpload }: ProfileAvatarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="flex flex-col items-center space-y-6">
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pulsing background effect */}
        <div className={cn(
          "absolute -inset-0.5 rounded-full transition-all duration-500",
          "bg-gradient-to-r from-cybergold-400 via-cybergold-600 to-cybergold-800",
          isHovered ? "opacity-80 blur-md animate-pulse" : "opacity-50 blur"
        )}></div>
        
        {/* Golden ring effect */}
        <div className={cn(
          "absolute -inset-1 rounded-full transition-all duration-300",
          isHovered ? "opacity-100" : "opacity-0",
          "bg-gradient-to-tr from-cybergold-400 to-cybergold-700",
          "animate-spin-slow"
        )}></div>

        {/* Avatar container */}
        <div className={cn(
          "relative",
          "rounded-full overflow-hidden",
          "border-4 border-double",
          isHovered ? "border-cybergold-400/90" : "border-cybergold-700/60",
          "transition-all duration-300",
          isHovered ? "transform scale-105" : "",
          "cursor-pointer",
          "shadow-[0_0_20px_rgba(218,188,69,0.2)]",
          "z-10"
        )}>
          <Avatar className="w-36 h-36 bg-cyberdark-950">
            {avatarUrl ? (
              <AvatarImage
                src={`${supabase.storage.from('avatars').getPublicUrl(avatarUrl).data.publicUrl}`}
                alt="Avatar"
                className={cn(
                  "object-cover w-full h-full",
                  "transition-all duration-500",
                  isHovered ? "scale-110 brightness-110" : ""
                )}
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-cyberdark-900 to-cyberdark-950 text-cybergold-600">
                <Camera className={cn(
                  "w-14 h-14",
                  "transition-all duration-300",
                  isHovered ? "text-cybergold-400 scale-110" : "text-cybergold-600"
                )} />
              </AvatarFallback>
            )}
            
            {/* Overlay with upload icon on hover */}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/40",
              "transition-opacity duration-300",
              isHovered ? "opacity-80" : "opacity-0"
            )}>
              <Upload className="h-10 w-10 text-cybergold-400" />
            </div>
          </Avatar>
        </div>
      </div>
      
      <div className="w-full max-w-xs">
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
          className={cn(
            "w-full relative overflow-hidden group",
            "bg-gradient-to-r from-cybergold-600 to-cybergold-700",
            "hover:from-cybergold-500 hover:to-cybergold-600",
            "text-black font-medium",
            "shadow-[0_4px_15px_rgba(218,188,69,0.25)]",
            "border border-cybergold-900/50",
            "transition-all duration-300",
            uploading ? "opacity-90" : ""
          )}
        >
          {/* Sparkle effect on hover */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          
          {uploading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
              <span>Laster opp...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Camera className="mr-2 h-4 w-4" />
              <span>Last opp nytt profilbilde</span>
            </div>
          )}
        </Button>
        
        {/* Helper text */}
        <p className="text-xs text-center mt-2 text-cybergold-700">
          Anbefalt format: kvadratisk, minst 300x300 piksler
        </p>
      </div>
    </div>
  );
};

