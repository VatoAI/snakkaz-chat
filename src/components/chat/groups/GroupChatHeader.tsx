import React, { useState } from 'react';
import { Group, SecurityLevel, GroupMember } from '@/types/groups';
import { Shield, Info, User, UserPlus, Settings, Lock, Wifi, WifiOff, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface GroupChatHeaderProps {
  group: Group;
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
  connectionAttempts: number;
  onBack: () => void;
  onReconnect: () => void;
  securityLevel: string;
  setSecurityLevel: (level: string) => void;
  userProfiles?: Record<string, any>;
  isAdmin: boolean;
  isPremium: boolean;
  isPremiumMember: boolean;
  onShowInvite: () => void;
  onShowPremium: () => void;
  onShowMembers: () => void;
  isPageEncryptionEnabled: boolean;
  onEnablePageEncryption: () => void;
  onEncryptAllMessages: () => void;
  encryptionStatus: string;
  isMobile?: boolean;
}

export const GroupChatHeader: React.FC<GroupChatHeaderProps> = ({
  group,
  connectionState,
  dataChannelState,
  usingServerFallback,
  connectionAttempts,
  onBack,
  onReconnect,
  securityLevel,
  setSecurityLevel,
  userProfiles = {},
  isAdmin,
  isPremium,
  isPremiumMember,
  onShowInvite,
  onShowPremium,
  onShowMembers,
  isPageEncryptionEnabled,
  onEnablePageEncryption,
  onEncryptAllMessages,
  encryptionStatus,
  isMobile = false
}) => {
  const [showInfo, setShowInfo] = useState(false);
  
  const getSecurityLevelText = (level: string): string => {
    switch (level) {
      case 'p2p_e2ee':
        return 'P2P (Ende-til-ende kryptert)';
      case 'server_e2ee':
        return 'Server (Ende-til-ende kryptert)';
      case 'premium':
        return 'Premium';
      case 'high':
        return 'Høy';
      case 'maximum':
        return 'Maksimum';
      default:
        return 'Standard';
    }
  };

  return (
    <header className="bg-cyberdark-900 border-b border-cyberdark-700 p-3 flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 rounded-full h-9 w-9 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800 lg:hidden"
        onClick={onBack}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only">Tilbake</span>
      </Button>
      
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-cybergold-400 truncate">
          {group.name}
        </h2>
        <p className="text-sm text-cybergold-600 truncate">
          {group.description}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        {connectionState !== 'connected' && (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-cybergold-500 hover:text-cybergold-400 hover:bg-cyberdark-800"
                  onClick={onReconnect}
                  disabled={connectionAttempts >= 3}
                >
                  {usingServerFallback ? (
                    <WifiOff className="h-4 w-4" />
                  ) : (
                    <Wifi className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black text-white text-xs py-1 px-2">
                {usingServerFallback
                  ? 'Bruker server-fallback'
                  : 'Prøver å koble til P2P...'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-cybergold-500 hover:text-cybergold-400 hover:bg-cyberdark-800"
                onClick={() => setShowInfo(true)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black text-white text-xs py-1 px-2">
              Gruppeinnstillinger
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 text-cybergold-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cybergold-400" />
              Gruppeinnstillinger
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full bg-cyberdark-800">
              <TabsTrigger value="info" className="flex-1 data-[state=active]:bg-cybergold-900/30 data-[state=active]:text-cybergold-300">Info</TabsTrigger>
              <TabsTrigger value="members" className="flex-1 data-[state=active]:bg-cybergold-900/30 data-[state=active]:text-cybergold-300">Medlemmer</TabsTrigger>
              <TabsTrigger value="security" className="flex-1 data-[state=active]:bg-cybergold-900/30 data-[state=active]:text-cybergold-300">Sikkerhet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="mt-4">
              <div className="space-y-2">
                <div className="text-sm text-cybergold-500">
                  <span className="font-medium text-cybergold-400">Navn:</span> {group.name}
                </div>
                <div className="text-sm text-cybergold-500">
                  <span className="font-medium text-cybergold-400">Beskrivelse:</span> {group.description || 'Ingen beskrivelse'}
                </div>
                <div className="text-sm text-cybergold-500">
                  <span className="font-medium text-cybergold-400">Sikkerhetsnivå:</span> {getSecurityLevelText(securityLevel)}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="members" className="mt-4">
              <div className="space-y-2">
                <Button variant="outline" className="w-full bg-cybergold-900/50 text-cybergold-300 hover:bg-cybergold-800/60 border border-cybergold-700" onClick={onShowInvite}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Inviter nye medlemmer
                </Button>
                <Button variant="ghost" className="w-full text-cybergold-500 hover:bg-cyberdark-800 justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Vis alle medlemmer
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="mt-4">
              <div className="space-y-2">
                <div className="text-sm text-cybergold-500">
                  <span className="font-medium text-cybergold-400">Kryptering:</span> {encryptionStatus}
                </div>
                <Button variant="outline" className="w-full bg-cybergold-900/50 text-cybergold-300 hover:bg-cybergold-800/60 border border-cybergold-700">
                  <Lock className="mr-2 h-4 w-4" />
                  Endre sikkerhetsnivå
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </header>
  );
};
