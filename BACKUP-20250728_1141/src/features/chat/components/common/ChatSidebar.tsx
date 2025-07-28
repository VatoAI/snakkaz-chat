import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Users, UserCircle2, MessageSquare, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  type: 'direct' | 'group';
  is_private?: boolean;
  role?: string;
}

const ChatSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's chats and groups
  const fetchChats = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // For now, using the existing rooms table
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select(`
          id,
          name,
          is_private,
          updated_at,
          messages(content, created_at)
        `)
        .order('updated_at', { ascending: false });

      if (roomsError) throw roomsError;

      const roomChats: Chat[] = (roomsData || []).map(room => ({
        id: room.id,
        name: room.name,
        lastMessage: room.messages?.[0]?.content || 'No messages yet',
        time: formatTime(room.messages?.[0]?.created_at || room.updated_at),
        unread: 0,
        type: 'group' as const,
        is_private: room.is_private
      }));

      setChats(roomChats);
    } catch (err) {
      console.error('Error fetching chats:', err);
      toast({
        title: 'Failed to load chats',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Format time helper
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays}d`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}w`;
    return date.toLocaleDateString();
  };

  // Filter chats
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Event handlers
  const handleNewChat = () => {
    navigate('/new-chat');
  };

  const handleNewGroup = () => {
    navigate('/create-group');
  };

  const handleManageGroups = () => {
    navigate('/groups');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  // Initialize
  useEffect(() => {
    if (user?.id) {
      fetchChats();
    }
  }, [user?.id]);

  return (
    <div className="w-full md:w-80 border-r border-border h-full flex flex-col bg-cyberdark-950">
      {/* Header */}
      <div className="p-3 border-b border-cyberdark-700 flex items-center justify-between">
        <h2 className="font-semibold text-lg text-cybergold-100">Snakkaz</h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-cybergold-400 hover:bg-cyberdark-800">
              <Plus size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-cyberdark-900 border-cyberdark-700">
            <DropdownMenuItem onClick={handleNewChat} className="text-cybergold-100 hover:bg-cyberdark-800">
              <UserCircle2 className="mr-2 h-4 w-4" />
              Ny samtale
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleNewGroup} className="text-cybergold-100 hover:bg-cyberdark-800">
              <Users className="mr-2 h-4 w-4" />
              Ny gruppe
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-cyberdark-700" />
            <DropdownMenuItem onClick={handleManageGroups} className="text-cybergold-100 hover:bg-cyberdark-800">
              <MessageSquare className="mr-2 h-4 w-4" />
              Manage grupper
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings} className="text-cybergold-100 hover:bg-cyberdark-800">
              <Settings className="mr-2 h-4 w-4" />
              Innstillinger
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-cybergold-500" />
          <Input 
            placeholder="Søk samtaler..." 
            className="pl-8 bg-cyberdark-800 border-cyberdark-700 text-cybergold-100 placeholder-cybergold-500" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center p-8">
            <div className="h-6 w-6 border-2 border-cybergold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-cybergold-500 text-sm">Loading chats...</p>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-cyberdark-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-cybergold-500/50" />
            </div>
            <h3 className="text-cybergold-300 font-medium mb-1">
              {searchQuery ? 'Ingen samtaler funnet' : 'Ingen aktive samtaler'}
            </h3>
            <p className="text-cybergold-500 text-sm mb-3">
              {searchQuery 
                ? 'Prøv et annet søkeord' 
                : 'Start din første samtale eller bli med i en gruppe'
              }
            </p>
            {!searchQuery && (
              <Button 
                size="sm" 
                onClick={handleNewGroup}
                className="bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Opprett gruppe
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredChats.map(chat => (
              <Link 
                to={`/chat/${chat.type}/${chat.id}`}
                key={chat.id} 
                className="flex items-center gap-3 p-3 hover:bg-cyberdark-800/50 transition-colors group"
              >
                <div className="h-10 w-10 rounded-full bg-cyberdark-800 flex items-center justify-center text-cybergold-400">
                  {chat.type === 'group' ? 
                    <Users size={18} /> : 
                    <UserCircle2 size={20} />
                  }
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate text-cybergold-100">{chat.name}</span>
                    <span className="text-xs text-cybergold-500">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-cybergold-400 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <div className="bg-cybergold-400 text-black text-xs rounded-full min-w-5 h-5 flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
