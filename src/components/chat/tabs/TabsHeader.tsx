
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
  );
};
