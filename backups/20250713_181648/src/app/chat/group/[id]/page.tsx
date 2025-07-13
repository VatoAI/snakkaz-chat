'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedGroupChat } from "@/components/chat/groups/EnhancedGroupChat";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, ArrowLeftIcon } from "lucide-react";

// Types
import { Group } from "@/types/group";
import { User } from "@/types/message";

export default function GroupChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfiles, setUserProfiles] = useState<Record<string, any>>({});

  useEffect(() => {
    // Check authentication and fetch current user
    async function fetchCurrentUser() {
      try {
        // Get current user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          // Redirect to login if no active session
          router.push('/auth/login?redirect=/chat/group/' + params.id);
          return;
        }
        
        // Get user profile
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (userError || !userData) {
          setError('Could not load your profile. Please try again.');
          setIsLoading(false);
          return;
        }
        
        setCurrentUser({
          id: userData.id,
          name: userData.display_name,
          avatar: userData.avatar_url,
          status: userData.status || 'offline'
        });
        
        // Now fetch the group
        fetchGroup(userData.id);
      } catch (error) {
        console.error('Authentication error:', error);
        setError('Authentication failed. Please log in again.');
        setIsLoading(false);
      }
    }
    
    // Fetch group details
    async function fetchGroup(userId: string) {
      try {
        // Get group details
        const { data, error } = await supabase
          .from('groups')
          .select(`
            *,
            members:group_members(*)
          `)
          .eq('id', params.id)
          .single();
          
        if (error || !data) {
          setError('Group not found or you do not have access to it.');
          setIsLoading(false);
          return;
        }
        
        // Check if user is a member of this group
        const isMember = data.members.some((member: any) => member.user_id === userId);
        
        if (!isMember) {
          setError('You are not a member of this group. Please request an invitation to join.');
          setIsLoading(false);
          return;
        }
        
        // Fetch user profiles for group members
        const memberIds = data.members.map((member: any) => member.user_id);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url, status')
          .in('id', memberIds);
          
        if (!profilesError && profiles) {
          const profilesMap: Record<string, any> = {};
          profiles.forEach(profile => {
            profilesMap[profile.id] = profile;
          });
          setUserProfiles(profilesMap);
        }
        
        setGroup(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch group:', err);
        setError('Failed to load group chat. Please try again.');
        setIsLoading(false);
      }
    }
    
    fetchCurrentUser();
  }, [params.id, router]);
  
  // Handle navigating back to chats list
  const handleBack = () => {
    router.push('/app/chat');
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-cyberdark-950 text-white">
        <Spinner size="lg" />
        <p className="mt-4 text-cybergold-400">Loading group chat...</p>
      </div>
    );
  }
  
  if (error || !group || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-cyberdark-950 text-white p-4">
        <div className="bg-cyberdark-900 border border-red-500/30 rounded-lg p-8 max-w-md w-full">
          <div className="flex items-center mb-4 text-red-400">
            <AlertCircleIcon className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Error</h2>
          </div>
          
          <p className="mb-6">{error || 'An unknown error occurred.'}</p>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => router.push('/app/chat')}
              className="bg-cybergold-700 hover:bg-cybergold-600 text-cyberdark-950"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Chats
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen bg-cyberdark-950">
      <EnhancedGroupChat 
        group={group}
        currentUserId={currentUser.id}
        onBack={handleBack}
        userProfiles={userProfiles}
      />
    </div>
  );
}
