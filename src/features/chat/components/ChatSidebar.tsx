import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Users, UserCircle2 } from 'lucide-react';

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

// Fiktiv chatdata for demo, erstatt med faktisk datahenting senere
const DUMMY_CHATS = [
  { id: '1', name: 'Anders Jensen', avatar: null, lastMessage: 'Hei, hvordan går det?', time: '12:30', unread: 2, type: 'direct' },
  { id: '2', name: 'Markedsføringsteamet', avatar: null, lastMessage: 'Vi må møtes for å diskutere det nye prosjektet', time: '11:15', unread: 0, type: 'group' },
  { id: '3', name: 'Linn Olsen', avatar: null, lastMessage: 'Takk for sist!', time: 'I går', unread: 0, type: 'direct' },
  { id: '4', name: 'Teknisk Support', avatar: null, lastMessage: 'Problemet er løst nå!', time: 'Man', unread: 1, type: 'group' },
  { id: '5', name: 'Ola Nordmann', avatar: null, lastMessage: 'Skal vi møtes i morgen?', time: 'Søn', unread: 0, type: 'direct' }
];

const ChatSidebar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = DUMMY_CHATS.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    navigate('/new-chat');
  };

  const handleNewGroup = () => {
    navigate('/new-group');
  };

  return (
    <div className="w-full md:w-80 border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-lg">Snakkaz</h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Plus size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleNewChat}>
              <UserCircle2 className="mr-2 h-4 w-4" />
              Ny samtale
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleNewGroup}>
              <Users className="mr-2 h-4 w-4" />
              Ny gruppe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Søk" 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            Ingen samtaler funnet
          </div>
        ) : (
          <div className="space-y-1">
            {filteredChats.map(chat => (
              <Link 
                to={`/chat/${chat.type}/${chat.id}`}
                key={chat.id} 
                className="flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                  {chat.type === 'group' ? 
                    <Users size={18} /> : 
                    <UserCircle2 size={20} />
                  }
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{chat.name}</span>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
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