import { CheckCircle, XCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

// Import the FriendRecord type from the useOptimizedFriends hook
type FriendRecord = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  status: 'online' | 'busy' | 'brb' | 'offline';
  last_seen: string | null;
};

interface FriendRequestsProps {
  friendRequests: FriendRecord[];
  onAccept: (friendshipId: string) => void;
  onReject: (friendshipId: string) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const FriendRequests = ({ 
  friendRequests, 
  onAccept, 
  onReject,
  userProfiles = {}
}: FriendRequestsProps) => {
  if (friendRequests.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-cybergold-300 px-1">Venneforespørsler ({friendRequests.length})</h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {friendRequests.map((request) => {
          const userId = request.id;
          const username = request.username || 'Ukjent bruker';
          const avatarUrl = request.avatar_url;
          
          return (
            <div 
              key={userId}
              className="flex items-center justify-between gap-2 p-3 bg-cyberdark-800/70 border border-cybergold-500/30 rounded-md"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-cybergold-500/20">
                  {avatarUrl ? (
                    <AvatarImage 
                      src={supabase.storage.from('avatars').getPublicUrl(avatarUrl).data.publicUrl} 
                      alt={username}
                    />
                  ) : (
                    <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
                      {username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-cybergold-200 font-medium">{username}</p>
                  <p className="text-xs text-cybergold-400">Ønsker å bli venn med deg</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAccept(userId)}
                  className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-400/10"
                  title="Godta venneforespørsel"
                >
                  <CheckCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onReject(userId)}
                  className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-400/10"
                  title="Avslå venneforespørsel"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
