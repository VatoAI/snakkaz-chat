
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface EditingMessageProps {
  editingMessage: { id: string; content: string };
  onCancelEdit: () => void;
}

export const EditingMessage = ({ editingMessage, onCancelEdit }: EditingMessageProps) => {
  return (
    <Alert className="w-full bg-cyberblue-900/30 border-cyberblue-500/30 mb-2 p-2">
      <AlertDescription className="text-xs text-cyberblue-100 flex items-center justify-between">
        <div className="flex-1 truncate">
          <span className="font-bold mr-1">Redigerer melding:</span>
          <span className="italic">{editingMessage.content.substring(0, 50)}{editingMessage.content.length > 50 ? '...' : ''}</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          type="button"
          className="h-5 w-5 text-cyberblue-300 hover:text-cyberblue-100 flex-shrink-0 ml-2"
          onClick={(e) => {
            e.preventDefault();
            onCancelEdit();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
