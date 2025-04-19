
import { TabsList } from "@/components/ui/tabs";
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
    <div className="border-b border-cybergold-500/30 px-4">
      <TabsList className="bg-transparent border-b-0">
        <GlobalTabHeader />
        <AssistantTabHeader />
        {selectedFriend && (
          <DirectTabHeader 
            friend={selectedFriend} 
            onClose={handleCloseDirectChat}
          />
        )}
      </TabsList>
    </div>
  );
};
