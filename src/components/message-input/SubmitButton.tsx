
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  newMessage: string;
  selectedFile: File | null;
  isRecording: boolean;
  editingMessage?: { id: string; content: string } | null;
}

export const SubmitButton = ({ 
  isLoading, 
  newMessage, 
  selectedFile, 
  isRecording,
  editingMessage 
}: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      disabled={isLoading || (!newMessage.trim() && !selectedFile) || isRecording}
      className="w-full sm:w-auto bg-cybergold-500 hover:bg-cybergold-600 text-cyberdark-900 shadow-neon-gold transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
    >
      <Send className="w-4 h-4 text-cyberdark-900" />
      <span className="sm:hidden">
        {editingMessage ? (
          <span className="text-cyberdark-900">Oppdater</span>
        ) : (
          <span className="text-cyberdark-900">Send</span>
        )}
      </span>
      <span className="hidden sm:inline">
        {editingMessage ? (
          <span className="text-cyberdark-900">Oppdater</span>
        ) : (
          <span className="text-cyberdark-900">Send</span>
        )}
      </span>
    </Button>
  );
};
