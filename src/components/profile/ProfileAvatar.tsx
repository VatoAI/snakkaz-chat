
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  uploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatar = ({ avatarUrl, uploading, onUpload }: ProfileAvatarProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyberblue-500 via-cybergold-500 to-cyberred-500 rounded-full opacity-60 group-hover:opacity-100 blur transition duration-500"></div>
        <Avatar className="w-32 h-32 relative hover:scale-105 transition-transform duration-300 cursor-pointer group-hover:shadow-neon-dual">
          {avatarUrl ? (
            <AvatarImage
              src={`${supabase.storage.from('avatars').getPublicUrl(avatarUrl).data.publicUrl}`}
              alt="Avatar"
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <AvatarFallback className="bg-cyberdark-800">
              <Camera className="w-12 h-12 text-cybergold-400/50" />
            </AvatarFallback>
          )}
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
          className="bg-gradient-to-r from-cyberblue-500 to-cybergold-500 hover:from-cyberblue-600 hover:to-cybergold-600 text-black shadow-neon-dual transition-all duration-300 hover:scale-105"
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
