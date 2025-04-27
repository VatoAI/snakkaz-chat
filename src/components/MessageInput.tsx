
import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TTLSelector } from "@/components/message-input/TTLSelector";
import { FileInputs } from "@/components/message-input/FileInputs";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useFileInput } from "@/hooks/useFileInput";

export interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSubmit?: (e: React.FormEvent, content: string) => Promise<boolean>;
  onSubmit?: (e: FormEvent) => Promise<void>;
  isLoading: boolean;
  ttl: number | null;
  setTtl: (ttl: number | null) => void;
  editingMessage: { id: string; content: string } | null;
  onCancelEdit: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onSendMessage?: (message: string, attachments: Array<{ url: string; type: string }>, ttl: number) => void;
}

export const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSubmit,
  onSubmit,
  isLoading = false,
  ttl,
  setTtl,
  editingMessage,
  onCancelEdit,
  placeholder = 'Skriv en melding...',
  disabled = false,
  className
}: MessageInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [attachments, setAttachments] = useState<Array<{ url: string; type: string; name: string }>>([]);
  const { uploadFile, cancelUpload, uploadState } = useMediaUpload();
  
  // Define the file handling function
  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };
  
  const fileInput = useFileInput({
    onFilesSelected: handleFilesSelected,
    accept: 'image/*,video/*,audio/*,application/pdf',
    multiple: true,
    setSelectedFile
  });

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      await onSubmit(e);
      return;
    }

    if (newMessage.trim() || selectedFile) {
      if (handleSubmit) {
        const success = await handleSubmit(e, newMessage);
        
        if (success) {
          setNewMessage("");
          if (selectedFile) {
            setSelectedFile(null);
          }
        }
      }
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleFormSubmit}
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
            placeholder={placeholder}
            className={cn(
              "resize-none py-3 pr-10 max-h-[200px] bg-cyberdark-800 border-cybergold-500/30 placeholder:text-cyberdark-300",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            disabled={isLoading || disabled}
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
            disabled={isLoading || (!newMessage.trim() && !selectedFile) || isRecording || disabled}
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
