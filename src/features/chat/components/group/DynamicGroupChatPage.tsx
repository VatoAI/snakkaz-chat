/**
 * Dynamic GroupChatPage Wrapper
 * 
 * This wrapper implements dynamic imports for heavy components within GroupChatPage
 * to reduce the initial chunk size and improve performance.
 */

import React, { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

// Dynamic imports for heavy components
const EnhancedGroupChat = lazy(() => 
  import('./EnhancedGroupChat').then(module => ({ default: module.EnhancedGroupChat }))
);

// Loading skeleton component that matches the original
const GroupChatSkeleton = () => (
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

const DynamicGroupChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  // Early loading states
  if (!user) {
    return <GroupChatSkeleton />;
  }

  return (
    <Suspense fallback={<GroupChatSkeleton />}>
      <EnhancedGroupChatWrapper groupId={id} user={user} />
    </Suspense>
  );
};

// Separate wrapper to contain the dynamic logic
const EnhancedGroupChatWrapper: React.FC<{ groupId?: string; user: any }> = ({ groupId, user }) => {
  const [groupData, setGroupData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadGroupData = async () => {
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulated group data
        const mockGroupData = {
          id: groupId || 'new-group',
          name: groupId ? `Gruppe #${groupId}` : 'Ny gruppe',
          creator_id: user?.id || 'unknown',
          security_level: 'standard',
          created_at: new Date().toISOString(),
          write_permissions: 'all',
          default_message_ttl: 0
        };
        
        setGroupData(mockGroupData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading group data:', error);
        setIsLoading(false);
      }
    };

    loadGroupData();
  }, [groupId, user]);

  const handleBack = () => {
    window.history.back();
  };

  if (isLoading || !groupData) {
    return <GroupChatSkeleton />;
  }

  return (
    <EnhancedGroupChat
      group={groupData}
      currentUserId={user?.id || 'unknown'}
      onBack={handleBack}
      userProfiles={{}}
    />
  );
};

export default DynamicGroupChatPage;
