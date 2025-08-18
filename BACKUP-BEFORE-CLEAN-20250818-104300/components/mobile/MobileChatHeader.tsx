import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical,
  Users,
  Shield
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface MobileChatHeaderProps {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  memberCount?: number;
  isGroup?: boolean;
  isSecure?: boolean;
  onBack?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onOptions?: () => void;
}

export const MobileChatHeader: React.FC<MobileChatHeaderProps> = ({
  title,
  subtitle,
  avatarUrl,
  isOnline,
  memberCount,
  isGroup,
  isSecure,
  onBack,
  onCall,
  onVideoCall,
  onOptions
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cyberdark-900/95 backdrop-blur-md border-b border-cyberdark-700">
      {/* Safe area for notch */}
      <div className="pt-safe">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left section */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-cyberdark-800"
            >
              <ArrowLeft size={20} className="text-cyberdark-300" />
            </Button>

            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={avatarUrl} alt={title} />
                <AvatarFallback className="bg-cybergold-500/20 text-cybergold-400">
                  {isGroup ? <Users size={16} /> : title.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOnline && !isGroup && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-cyberdark-900 rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-white font-semibold truncate">
                  {title}
                </h1>
                {isSecure && (
                  <Shield size={14} className="text-cybergold-400 flex-shrink-0" />
                )}
              </div>
              {subtitle && (
                <p className="text-cyberdark-300 text-sm truncate">
                  {isGroup && memberCount ? `${memberCount} members` : subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-1">
            {onCall && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCall}
                className="p-2 hover:bg-cyberdark-800"
              >
                <Phone size={20} className="text-cyberdark-300" />
              </Button>
            )}

            {onVideoCall && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onVideoCall}
                className="p-2 hover:bg-cyberdark-800"
              >
                <Video size={20} className="text-cyberdark-300" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onOptions}
              className="p-2 hover:bg-cyberdark-800"
            >
              <MoreVertical size={20} className="text-cyberdark-300" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
