
import { useRef, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { useMessageInputState } from "./message-input/useMessageInputState";
import { FileInputs } from "./message-input/FileInputs";
import { AudioRecorder } from "./message-input/AudioRecorder";
import { TTLSelector } from "./message-input/TTLSelector";
import { EditingMessage } from "./message-input/EditingMessage";
import { SubmitButton } from "./message-input/SubmitButton";

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
    
    const resetInput = clearFileInputs();
    resetInput(fileInputRef.current);
    resetInput(videoInputRef.current);
    resetInput(cameraInputRef.current);
    resetInput(documentInputRef.current);
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
        <div className="flex flex-1 gap-2">
          <FileInputs 
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            isLoading={isLoading}
            isRecording={isRecording}
          />
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={receiverId ? "Skriv en privat melding..." : "Skriv din melding..."}
            className="flex-1 bg-cyberdark-800 border-cybergold-500/30 text-white placeholder:text-cybergold-300/50 focus-visible:ring-cyberblue-500"
            disabled={isLoading || isRecording}
          />
          
          <div className="flex gap-2">
            <AudioRecorder
              isLoading={isLoading}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              setSelectedFile={setSelectedFile}
            />
          </div>
        </div>
      </div>
      
      <SubmitButton
        isLoading={isLoading}
        newMessage={newMessage}
        selectedFile={selectedFile}
        isRecording={isRecording}
        editingMessage={editingMessage}
      />
    </form>
  );
};
