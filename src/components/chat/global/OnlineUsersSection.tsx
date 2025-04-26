import { OnlineUsers } from "@/components/online-users/OnlineUsers";
import { UserPresence } from "@/types/presence";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OnlineUsersSectionProps {
  userPresence: Record<string, UserPresence>;
  currentUserId: string | null;
  onStartChat?: (userId: string) => void;
  className?: string;
}

export const OnlineUsersSection = ({
  userPresence,
  currentUserId,
  onStartChat,
  className
}: OnlineUsersSectionProps) => {
  const [userProfiles, setUserProfiles] = useState<Record<string, { username: string | null, avatar_url: string | null }>>({});
  const [activeConversations, setActiveConversations] = useState<{ userId: string, lastMessage: string, timestamp: string }[]>([]);
  
  // Fetch user profiles for all online users
  useEffect(() => {
    const fetchUserProfiles = async () => {
      const userIds = Object.keys(userPresence);
      if (userIds.length === 0) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);
        
      if (data) {
        const profiles: Record<string, { username: string | null, avatar_url: string | null }> = {};
        data.forEach(profile => {
          profiles[profile.id] = {
            username: profile.username,
            avatar_url: profile.avatar_url
          };
        });
        setUserProfiles(profiles);
      }
    };
    
    fetchUserProfiles();
  }, [userPresence]);
  
  return (
    <div className={className}>
      <OnlineUsers
        userPresence={userPresence}
        currentUserId={currentUserId}
        onStartChat={onStartChat}
        userProfiles={userProfiles}
        activeConversations={activeConversations}
      />
    </div>
  );
};
