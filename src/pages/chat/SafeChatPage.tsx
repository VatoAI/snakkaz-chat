
import React, { Suspense } from "react";
import ErrorBoundary from "../../components/error/ErrorBoundary";
import { Loader2 } from "lucide-react";
import ChatPage from "./ChatPage";

const SafeChatPage = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading chat...</span>
        </div>
      }>
        <ChatPage />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SafeChatPage;
