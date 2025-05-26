// filepath: /workspaces/snakkaz-chat/src/components/message/LoadMoreMessages.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";

interface LoadMoreMessagesProps {
    onClick: () => Promise<void>;
    isLoading: boolean;
    hasMore: boolean;
    className?: string;
}

export const LoadMoreMessages: React.FC<LoadMoreMessagesProps> = ({
    onClick,
    isLoading,
    hasMore,
    className = ''
}) => {
    if (!hasMore) return null;

    return (
        <div className={`flex justify-center py-4 ${className}`}>
            <Button
                variant="outline"
                size="sm"
                onClick={onClick}
                disabled={isLoading}
                className="bg-cyberdark-800 text-cyberblue-400 border-cyberblue-500/30 
                 hover:bg-cyberdark-700 hover:border-cyberblue-500 hover:text-cyberblue-300"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Laster...
                    </>
                ) : (
                    <>
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Last eldre meldinger
                    </>
                )}
            </Button>
        </div>
    );
};