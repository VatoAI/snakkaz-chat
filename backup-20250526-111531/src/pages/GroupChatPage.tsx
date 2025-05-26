import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Share, Plus, Settings, Send } from 'lucide-react';
import { EnhancedGroupChat } from '@/components/chat/groups/EnhancedGroupChat';

const GroupChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupData, setGroupData] = useState(null);

  useEffect(() => {
    // Simulate loading of group information
    const loadGroupData = async () => {
      try {
        // In a real implementation, we would fetch group data from Supabase here
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulated group data
        const mockGroupData = {
          id: id || 'new-group',
          name: id ? `Gruppe #${id}` : 'Ny gruppe',
          creator_id: user?.id || 'unknown',
          security_level: 'standard',
          created_at: new Date().toISOString(),
          write_permissions: 'all',
          default_message_ttl: 0
        };
        
        setGroupData(mockGroupData);
        setGroupName(mockGroupData.name);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading group data:', error);
        toast({
          variant: 'destructive',
          title: 'Feil ved lasting',
          description: 'Kunne ikke laste gruppedata. Prøv igjen senere.'
        });
      }
    };

    loadGroupData();
  }, [id, toast, user]);

  const handleBack = () => {
    // Navigate back to the chat list
    window.history.back();
  };

  // Show loading skeleton until group data is loaded
  if (isLoading || !groupData) {
    return (
      <div className="h-full flex flex-col bg-cyberdark-950 text-cybergold-200">
        {/* Group header skeleton */}
        <div className="border-b border-cyberdark-800 p-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-1/3 bg-cyberdark-800" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 bg-cyberdark-800" />
              <Skeleton className="h-8 w-8 bg-cyberdark-800" />
            </div>
          </div>
        </div>
        
        {/* Messages area skeleton */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <Card className={`max-w-[80%] p-3 ${i % 2 === 0 ? 'bg-cyberdark-800' : 'bg-cyberdark-700'} border-none`}>
                  <div className="flex items-center mb-2">
                    <Skeleton className="h-6 w-20 bg-cyberdark-700" />
                    <Skeleton className="h-3 w-10 bg-cyberdark-700 ml-2" />
                  </div>
                  <Skeleton className="h-4 w-full bg-cyberdark-700 mb-1" />
                  <Skeleton className="h-4 w-4/5 bg-cyberdark-700" />
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Input area skeleton */}
        <div className="p-4 border-t border-cyberdark-800">
          <Skeleton className="h-10 w-full bg-cyberdark-800" />
        </div>
      </div>
    );
  }

  // Render the enhanced group chat component
  return (
    <EnhancedGroupChat
      group={groupData}
      currentUserId={user?.id || 'unknown'}
      onBack={handleBack}
      userProfiles={{}}
    />
  );
};

export default GroupChatPage;
