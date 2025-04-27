
import ChatPage from "./chat/ChatPage";
import { NotificationProvider } from "@/contexts/NotificationContext";

const Chat = () => {
  return (
    <NotificationProvider>
      <ChatPage />
    </NotificationProvider>
  );
};

export default Chat;
