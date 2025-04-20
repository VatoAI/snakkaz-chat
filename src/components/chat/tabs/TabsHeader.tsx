import { StyledTabsList } from "./StyledTabsList";
import { GlobalTabHeader } from "./GlobalTabHeader";
import { AssistantTabHeader } from "./AssistantTabHeader";
import { DirectTabHeader } from "./DirectTabHeader";
import { Friend } from "@/components/chat/friends/types";

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
    <div className="relative">
      {/* Logo element above tabs with increased size and improved visibility */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyberdark-900 to-cyberdark-950 
                      border-2 border-cybergold-500 
                      flex items-center justify-center 
                      shadow-[0_0_20px_rgba(230,179,0,0.3)] 
                      hover:shadow-[0_0_30px_rgba(230,179,0,0.4)]
                      transition-all duration-500">
          <img
            src="/snakkaz-logo.png" 
            alt="SnakkaZ Logo"
            className="rounded-full w-28 h-28 object-cover p-1"
            onError={(e) => {
              console.log("Logo failed to load, using fallback");
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
      </div>
      
      {/* Tabs list */}
      <StyledTabsList>
        <GlobalTabHeader isActive={activeTab === 'global'} />
        <AssistantTabHeader isActive={activeTab === 'assistant'} />
        {selectedFriend && (
          <DirectTabHeader 
            friend={selectedFriend} 
            onClose={handleCloseDirectChat}
            isActive={activeTab === 'direct'}
          />
        )}
      </StyledTabsList>
    </div>
  );
};
