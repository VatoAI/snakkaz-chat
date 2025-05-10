import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Paperclip,
  X,
  AlertCircle,
  Lock,
  Image as ImageIcon,
  FileText,
  File,
} from "lucide-react";
import { DecryptedMessage } from "@/types/message";
import { SecurityLevel } from "@/types/security";
import { FileUploader } from "@/components/FileUploader";

interface MessageInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  newMessage: string;
  onChangeMessage: (value: string) => void;
  editingMessage?: DecryptedMessage | null;
  onCancelEdit?: () => void;
  isLoading?: boolean;
  connectionState?: string;
  dataChannelState?: string;
  usingServerFallback?: boolean;
  sendError?: string | null;
  securityLevel?: string;
  isPageEncrypted?: boolean;
  isPremiumMember?: boolean;
  maxFileSize?: number;
  isMobile?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  newMessage,
  onChangeMessage,
  editingMessage,
  onCancelEdit,
  isLoading = false,
  connectionState,
  dataChannelState,
  usingServerFallback,
  sendError,
  securityLevel = SecurityLevel.STANDARD,
  isPageEncrypted = false,
  isPremiumMember = false,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  isMobile = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(Date.now());

  const isConnected =
    (securityLevel === SecurityLevel.P2P_E2EE &&
      connectionState === "connected" &&
      dataChannelState === "open") ||
    securityLevel === SecurityLevel.SERVER_E2EE ||
    securityLevel === SecurityLevel.STANDARD;

  const isEditMode = !!editingMessage;

  // Auto focus the textarea when in edit mode
  useEffect(() => {
    if (isEditMode && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditMode]);

  // Auto resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [newMessage]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (newMessage.trim() || files.length > 0) &&
      !isLoading &&
      (isConnected || securityLevel !== SecurityLevel.P2P_E2EE)
    ) {
      onSendMessage(newMessage, files.length > 0 ? files : undefined);
      onChangeMessage("");
      setFiles([]);
      setShowUploader(false);
      setUploaderKey(Date.now()); // Reset the uploader
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleFormSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const getFilePreview = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isDocument = file.type.includes("pdf") || file.type.includes("document");

    return (
      <div
        key={file.name}
        className="relative flex items-center p-1.5 bg-cyberdark-800 rounded-md border border-cybergold-700/30 mb-1"
      >
        <div className="flex items-center gap-1.5">
          {isImage ? (
            <ImageIcon className="h-4 w-4 text-cybergold-400" />
          ) : isDocument ? (
            <FileText className="h-4 w-4 text-cybergold-400" />
          ) : (
            <File className="h-4 w-4 text-cybergold-400" />
          )}
          <span className="text-xs text-cybergold-300 truncate max-w-[150px]">
            {file.name}
          </span>
          <span className="text-xs text-cybergold-600">
            ({Math.round(file.size / 1024)} KB)
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0 ml-1 text-cybergold-500 hover:text-cybergold-300"
          onClick={() => handleRemoveFile(files.indexOf(file))}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  const isSecure =
    securityLevel === SecurityLevel.SERVER_E2EE || securityLevel === SecurityLevel.P2P_E2EE;
  const isPeerToPeer = securityLevel === SecurityLevel.P2P_E2EE;

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col space-y-2 p-2 border-t border-cybergold-900/30"
    >
      {editingMessage && (
        <div className="flex items-center p-2 bg-cyberdark-800/80 rounded-md border border-cybergold-600/30">
          <span className="text-xs text-cybergold-400">Redigerer melding</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0 ml-auto text-cybergold-500 hover:text-cybergold-300"
            onClick={onCancelEdit}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {sendError && (
        <div className="flex items-center p-2 bg-red-900/20 rounded-md border border-red-900/30 text-red-400">
          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
          <span className="text-xs">{sendError}</span>
        </div>
      )}

      {!isConnected && isPeerToPeer && (
        <div className="flex items-center p-2 bg-amber-900/20 rounded-md border border-amber-900/30 text-amber-400">
          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
          <span className="text-xs">
            {connectionState === "connecting" || connectionState === "checking"
              ? "Kobler til..."
              : "Frakoblet. Meldinger vil ikke sendes før tilkoblingen er gjenopprettet."}
          </span>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-1 p-2 bg-cyberdark-800/40 rounded-md border border-cybergold-900/30">
          {files.map((file, index) => getFilePreview(file))}
        </div>
      )}

      {showUploader && (
        <FileUploader
          key={uploaderKey}
          onFilesSelected={(selectedFiles) => {
            setFiles((prev) => [...prev, ...selectedFiles]);
            setShowUploader(false);
          }}
          maxFileSize={maxFileSize}
          maxFiles={isPremiumMember ? 10 : 5}
          allowMultiple={true}
        />
      )}

      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          placeholder={
            isEditMode
              ? "Rediger melding..."
              : isSecure
              ? "Skriv en kryptert melding..."
              : "Skriv en melding..."
          }
          value={newMessage}
          onChange={(e) => onChangeMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[40px] max-h-[200px] resize-none flex-1 bg-cyberdark-900/70 border-cybergold-900/50 focus:border-cybergold-600/50 text-cybergold-200 placeholder:text-cybergold-700"
          disabled={isLoading}
        />
        
        <div className="flex gap-1">
          <Button
            type="button"
            size={isMobile ? "icon" : "default"}
            variant="outline"
            className="h-10 bg-cyberdark-900/70 border-cybergold-900/50 hover:bg-cyberdark-800 hover:border-cybergold-800/50 text-cybergold-500"
            onClick={() => setShowUploader(!showUploader)}
            disabled={isLoading}
          >
            <Paperclip className={`h-4 w-4 ${!isMobile && "mr-1"}`} />
            {!isMobile && <span>Fil</span>}
          </Button>
          
          <Button
            type="submit"
            size={isMobile ? "icon" : "default"}
            disabled={
              (newMessage.trim() === "" && files.length === 0) ||
              isLoading ||
              (!isConnected && isPeerToPeer)
            }
            className="h-10 bg-gradient-to-r from-cybergold-900 to-cybergold-800 hover:from-cybergold-800 hover:to-cybergold-700 border border-cybergold-700/50 text-cybergold-300"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-cybergold-500/20 border-t-cybergold-500"></div>
            ) : (
              <>
                {isSecure && <Lock className={`h-3.5 w-3.5 ${!isMobile && "mr-1"}`} />}
                <Send className={`h-4 w-4 ${!isMobile && "mr-1"}`} />
                {!isMobile && <span>{isEditMode ? "Oppdater" : "Send"}</span>}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-cybergold-700">
        <div className="flex items-center">
          {isPageEncrypted && <Lock className="h-3 w-3 mr-1" />}
          <span>
            {isPageEncrypted
              ? "Helside-kryptert"
              : isSecure
              ? "Ende-til-ende kryptert"
              : "Standard kryptering"}
          </span>
        </div>
        {!isMobile && (
          <span>
            {isPeerToPeer ? (
              usingServerFallback ? (
                "Server-ruting"
              ) : (
                "P2P-tilkobling"
              )
            ) : (
              <>&nbsp;</>
            )}
          </span>
        )}
      </div>
    </form>
  );
};