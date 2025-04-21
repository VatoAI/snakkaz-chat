
import { StyledTabsList } from "./StyledTabsList";
import { GlobalTabHeader } from "./GlobalTabHeader";
import { PrivateChatsTabHeader } from "./PrivateChatsTabHeader";
import { DirectTabHeader } from "./DirectTabHeader";
import { Friend } from "@/components/chat/friends/types";
import { TooltipProvider } from "@/components/ui/tooltip";

interface TabsHeaderProps {
  selectedFriend: Friend | null;
  handleCloseDirectChat: () => void;
  activeTab: string;
}

export const TabsHeader = ({ 
  selectedFriend, 
  handleCloseDirectChat,
  activeTab
}: TabsHeaderProps) => {
  return (
    <div className="w-full bg-cyberdark-900/95 backdrop-blur-sm border-b border-cybergold-500/30 sticky top-0 z-30">
      <TooltipProvider>
        <StyledTabsList>
          <GlobalTabHeader isActive={activeTab === 'global'} />
          <PrivateChatsTabHeader isActive={activeTab === 'private'} />
          {selectedFriend && (
            <DirectTabHeader 
              friend={selectedFriend} 
              onClose={handleCloseDirectChat}
              isActive={activeTab === 'direct'}
            />
          )}
        </StyledTabsList>
      </TooltipProvider>
    </div>
  );
};
