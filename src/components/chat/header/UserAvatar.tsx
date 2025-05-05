
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Users } from 'lucide-react';

interface UserAvatarProps {
  src?: string;
  alt: string;
  isGroup?: boolean;
  status?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  alt, 
  isGroup = false,
  status
}) => {
  return (
    <div className="relative">
      <Avatar className="h-10 w-10 border-2 border-cyberdark-700">
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback className="bg-cyberdark-800 text-cybergold-500">
          {isGroup ? <Users className="h-5 w-5" /> : <User className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>
      
      {status && (
        <span 
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-cyberdark-950 ${status}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
