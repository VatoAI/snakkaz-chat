
import { StyledTabsList } from "./StyledTabsList";
import { GlobalTabHeader } from "./GlobalTabHeader";
import { AssistantTabHeader } from "./AssistantTabHeader";
import { DirectTabHeader } from "./DirectTabHeader";
import { Friend } from "@/components/chat/friends/types";

interface TabsHeaderProps {
  selectedFriend: Friend | null;
  handleCloseDirectChat: () => void;
}

export const TabsHeader = ({ selectedFriend, handleCloseDirectChat }: TabsHeaderProps) => {
  return (
    <div className="relative">
      {/* Logo element above tabs */}
      <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyberdark-900 to-cyberdark-950 
                        border-2 border-red-400 border-l-red-400 border-t-red-400 border-r-cyberblue-400 border-b-cyberblue-400 
                        flex items-center justify-center shadow-[0_0_15px_rgba(26,157,255,0.4)_,_0_0_15px_rgba(214,40,40,0.4)] 
                        hover:shadow-[0_0_20px_rgba(26,157,255,0.6)_,_0_0_20px_rgba(214,40,40,0.6)]
                        transition-all duration-300 animate-pulse-slow">
          <img
            src="/snakkaz-logo.png" 
            alt="SnakkaZ Logo"
            className="rounded-full w-20 h-20 object-cover"
            onError={(e) => {
              console.log("Logo failed to load, using fallback");
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
      </div>
      
      {/* Original tabs list */}
      <StyledTabsList>
        <GlobalTabHeader />
        <AssistantTabHeader />
        {selectedFriend && (
          <DirectTabHeader 
            friend={selectedFriend} 
            onClose={handleCloseDirectChat}
          />
        )}
      </StyledTabsList>
    </div>
  );
};
