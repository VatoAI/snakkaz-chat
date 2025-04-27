
import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TTLSelector } from "@/components/message-input/TTLSelector";
import { FileInputs } from "@/components/message-input/FileInputs";

export interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSubmit: (e: React.FormEvent, content: string) => Promise<boolean>;
  isLoading: boolean;
  ttl: number | null;
  setTtl: (ttl: number | null) => void;
  editingMessage: { id: string; content: string } | null;
  onCancelEdit: () => void;
}

export const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSubmit,
  isLoading,
  ttl,
  setTtl,
  editingMessage,
  onCancelEdit
}: MessageInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Update textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  // Set editing message content
  useEffect(() => {
    if (editingMessage) {
      setNewMessage(editingMessage.content);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [editingMessage, setNewMessage]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() || selectedFile) {
      const success = await handleSubmit(e, newMessage);
      if (success && selectedFile) {
        setSelectedFile(null);
      }
    }
  };

  return (
    <form 
      ref={formRef}
      onSubmit={onSubmit} 
      className="relative flex flex-col gap-2"
    >
      {editingMessage && (
        <div className="flex items-center justify-between rounded-md bg-cyberdark-700/50 px-3 py-1.5">
          <span className="text-sm text-cybergold-300">Redigerer melding</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancelEdit}
            className="p-0 h-auto"
          >
            <X className="h-4 w-4 text-cybergold-400" />
          </Button>
        </div>
      )}
      
      <FileInputs
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        isLoading={isLoading}
        isRecording={isRecording}
      />
      
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Skriv en melding..."
            className={cn(
              "resize-none py-3 pr-10 max-h-[200px] bg-cyberdark-800 border-cybergold-500/30 placeholder:text-cyberdark-300",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            rows={1}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <TTLSelector 
            ttl={ttl} 
            setTtl={setTtl}
            isLoading={isLoading}
            isRecording={isRecording}
          />
          
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || (!newMessage.trim() && !selectedFile) || isRecording}
            className={cn(
              "bg-cybergold-600 hover:bg-cybergold-500 text-black",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
