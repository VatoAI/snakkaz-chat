/**
 * Secure Chat Page
 * 
 * Main page for the secure chat application that integrates
 * all chat components and services.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatProvider, useChat } from '../services/encryption/ChatContext';
import { GroupList } from '../services/encryption/GroupList';
import { ChatInterface } from '../services/encryption/ChatInterface';
import { Button } from '../components/ui/button';
import { supabase } from '../integrations/supabase/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { useMediaQuery } from '../hooks/use-media-query';

// Main secure chat component (internal to avoid context nesting issues)
const SecureChatContent: React.FC = () => {
  // Context and hooks
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { groups, currentGroup, setCurrentGroup, error, clearError } = useChat();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showMobileGroupList, setShowMobileGroupList] = useState(!groupId);
  
  // Effect to fetch user
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
        } else {
          // Redirect to login if not authenticated
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    getUserInfo();
  }, [navigate]);
  
  // Effect to set current group based on URL param
  useEffect(() => {
    if (groupId && groups.length > 0) {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        setCurrentGroup(group);
      } else {
        // Group not found, redirect to chat main page
        toast({
          title: 'Gruppe ikke funnet',
          description: 'Gruppen du forsøkte å åpne finnes ikke eller du har ikke tilgang.',
          variant: 'destructive'
        });
        navigate('/secure-chat');
      }
    }
  }, [groupId, groups, setCurrentGroup, navigate, toast]);
  
  // Effect to sync URL with selected group
  useEffect(() => {
    if (currentGroup && (!groupId || groupId !== currentGroup.id)) {
      navigate(`/secure-chat/${currentGroup.id}`);
      if (isMobile) {
        setShowMobileGroupList(false);
      }
    } else if (!currentGroup && groupId) {
      navigate('/secure-chat');
    }
  }, [currentGroup, groupId, navigate, isMobile]);
  
  // Error handling
  useEffect(() => {
    if (error) {
      toast({
        title: 'Feil',
        description: error,
        variant: 'destructive'
      });
      clearError();
    }
  }, [error, toast, clearError]);
  
  // Handle back button on mobile
  const handleBackToGroupList = () => {
    setCurrentGroup(null);
    setShowMobileGroupList(true);
    navigate('/secure-chat');
  };
  
  // Handle group selection
  const handleGroupSelect = (group) => {
    setCurrentGroup(group);
    if (isMobile) {
      setShowMobileGroupList(false);
    }
  };
  
  // Loading state
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-cyberdark-950">
        <Loader2 className="animate-spin h-8 w-8 text-cybergold-400" />
      </div>
    );
  }
  
  // Mobile layout
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-cyberdark-950">
        {/* Either show group list or chat interface */}
        {showMobileGroupList ? (
          <div className="flex-grow overflow-hidden">
            {/* Group list header */}
            <div className="p-4 border-b border-cyberdark-800 flex justify-between items-center">
              <h1 className="text-xl font-bold text-cybergold-400">Snakkaz Chat</h1>
            </div>
            
            {/* Group list */}
            <div className="h-full">
              <GroupList onGroupSelect={handleGroupSelect} />
            </div>
          </div>
        ) : (
          <div className="flex-grow overflow-hidden">
            {/* Chat header with back button */}
            <div className="p-4 border-b border-cyberdark-800 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={handleBackToGroupList}
              >
                <ArrowLeft className="h-5 w-5 text-cybergold-400" />
              </Button>
              <h1 className="text-xl font-bold text-cybergold-400 truncate">
                {currentGroup?.settings.name || 'Chat'}
              </h1>
            </div>
            
            {/* Chat interface */}
            <div className="h-full">
              <ChatInterface />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Desktop layout
  return (
    <div className="h-screen flex bg-cyberdark-950">
      {/* Sidebar (groups) */}
      <div className="w-1/4 max-w-xs border-r border-cyberdark-800 flex flex-col">
        <div className="p-4 border-b border-cyberdark-800">
          <h1 className="text-xl font-bold text-cybergold-400">Snakkaz Chat</h1>
        </div>
        <div className="flex-grow">
          <GroupList onGroupSelect={handleGroupSelect} />
        </div>
      </div>
      
      {/* Main content (chat) */}
      <div className="flex-grow">
        <ChatInterface />
      </div>
    </div>
  );
};

// Wrapper component with provider
const SecureChatPage: React.FC = () => {
  return (
    <ChatProvider>
      <SecureChatContent />
    </ChatProvider>
  );
};

export default SecureChatPage;
