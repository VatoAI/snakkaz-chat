
import { useRef, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { useMessageInputState } from "./message-input/useMessageInputState";
import { FileInputs } from "./message-input/FileInputs";
import { AudioRecorder } from "./message-input/AudioRecorder";
import { TTLSelector } from "./message-input/TTLSelector";
import { EditingMessage } from "./message-input/EditingMessage";
import { SubmitButton } from "./message-input/SubmitButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { Paperclip, Smile } from "lucide-react";
import { Button } from "./ui/button";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent, mediaFile?: File) => void;
  isLoading: boolean;
  ttl: number | null;
  setTtl: (ttl: number | null) => void;
  receiverId?: string | null;
  editingMessage?: { id: string; content: string } | null;
  onCancelEdit?: () => void;
}

export const MessageInput = ({ 
  newMessage, 
  setNewMessage, 
  onSubmit, 
  isLoading,
  ttl,
  setTtl,
  receiverId,
  editingMessage,
  onCancelEdit
}: MessageInputProps) => {
  const {
    selectedFile,
    setSelectedFile,
    isRecording,
    setIsRecording,
    clearFileInputs
  } = useMessageInputState();
  
  const isMobile = useIsMobile();
  const [showFileOptions, setShowFileOptions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Allow submission if there's a message OR a selected file
    if ((!newMessage.trim() && !selectedFile) || isLoading) return;
    
    console.log("Submitting message form with file:", selectedFile?.name);
    onSubmit(e, selectedFile || undefined);
    
    // Clear file input after submission
    setSelectedFile(null);
    setShowFileOptions(false);
    
    const resetInput = clearFileInputs();
    resetInput(fileInputRef.current);
    resetInput(videoInputRef.current);
    resetInput(cameraInputRef.current);
    resetInput(documentInputRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Send on Enter without shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const toggleFileOptions = () => {
    setShowFileOptions(!showFileOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      {editingMessage && onCancelEdit && (
        <EditingMessage
          editingMessage={editingMessage}
          onCancelEdit={onCancelEdit}
        />
      )}

      <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
        <div className="flex flex-1 gap-2 relative">
          {isMobile ? (
            <>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="shrink-0 text-cybergold-400"
                onClick={toggleFileOptions}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              
              {showFileOptions && (
                <div className="absolute bottom-full left-0 p-2 mb-2 bg-cyberdark-800 rounded-lg border border-cybergold-500/30 flex gap-2 z-10">
                  <FileInputs 
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    isLoading={isLoading}
                    isRecording={isRecording}
                    isMobile={true}
                  />
                </div>
              )}
            </>
          ) : (
            <FileInputs 
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              isLoading={isLoading}
              isRecording={isRecording}
            />
          )}
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={receiverId ? "Skriv en privat melding..." : "Skriv din melding..."}
            className="flex-1 bg-cyberdark-800 border-cybergold-500/30 text-white placeholder:text-cybergold-300/50 focus-visible:ring-cyberblue-500"
            disabled={isLoading || isRecording}
          />
          
          <div className="flex gap-2">
            {!isMobile && (
              <AudioRecorder
                isLoading={isLoading}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                setSelectedFile={setSelectedFile}
              />
            )}
            <SubmitButton
              isLoading={isLoading}
              newMessage={newMessage}
              selectedFile={selectedFile}
              isRecording={isRecording}
              editingMessage={editingMessage}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
