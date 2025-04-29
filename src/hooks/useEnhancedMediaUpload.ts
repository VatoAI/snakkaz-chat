import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { EnhancedMediaUploader } from "@/utils/upload/enhanced-media-upload";

// Define allowed resize modes
export type ResizeMode = 'fit' | 'cover' | 'contain' | 'none' | 'auto';

// Interface for upload state including detailed progress
export interface EnhancedUploadState {
  isUploading: boolean;
  progress: number;
  speed?: number;  // bytes per second
  error: Error | null;
  url: string | null;
  thumbnailUrl?: string | null;
  isEncrypted?: boolean;
}

// Upload options interface
export interface UploadOptions {
  bucket?: string;
  folder?: string;
  compress?: boolean;
  resize?: {
    maxWidth?: number;
    maxHeight?: number;
    mode?: ResizeMode;
    quality?: number;
  };
  encrypt?: boolean;
  encryptionKey?: string;
  generateThumbnail?: boolean;
}

// Default options for image resizing
const DEFAULT_OPTIONS: UploadOptions = {
  bucket: "chat-media",
  compress: true,
  resize: {
    maxWidth: 1920,
    maxHeight: 1920,
    mode: 'auto',
    quality: 0.85
  },
  generateThumbnail: true
};

/**
 * Enhanced media upload hook with image resizing, compression and chunked uploads
 */
export const useEnhancedMediaUpload = () => {
  const [uploadState, setUploadState] = useState<EnhancedUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    url: null
  });

  // Keep reference to the uploader instance for cancellation
  const uploaderRef = useRef<EnhancedMediaUploader | null>(null);
  
  const { toast } = useToast();
  const { session } = useAuth();
  const { notify } = useNotifications();

  /**
   * Upload a file with enhanced features like compression and resizing
   */
  const uploadFile = useCallback(async (
    file: File,
    options?: UploadOptions
  ) => {
    if (!file) {
      toast({
        title: "Feil",
        description: "Ingen fil valgt",
        variant: "destructive"
      });
      return null;
    }

    if (!session?.user?.id) {
      toast({
        title: "Feil",
        description: "Du må være logget inn for å laste opp filer",
        variant: "destructive"
      });
      return null;
    }

    // Combine default options with provided options
    const uploadOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      resize: {
        ...DEFAULT_OPTIONS.resize,
        ...options?.resize
      }
    };
    
    // Create uploader instance
    const uploader = new EnhancedMediaUploader();
    uploaderRef.current = uploader;
    
    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null
    }));

    try {
      // Log the upload attempt
      console.log(`Uploading file: ${file.name} (${file.type}) with enhanced uploader`);
      
      // Upload using the enhanced uploader
      const result = await uploader.uploadFile(file, {
        onProgress: (progress) => {
          setUploadState(prev => ({
            ...prev,
            progress: progress.percentage,
            speed: progress.speed
          }));
        },
        compress: uploadOptions.compress,
        resize: uploadOptions.resize,
        encrypt: uploadOptions.encrypt,
        encryptionKey: uploadOptions.encryptionKey,
        generateThumbnail: uploadOptions.generateThumbnail
      });

      console.log(`Enhanced upload successful. Public URL: ${result.publicUrl}`);
      
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        url: result.publicUrl,
        thumbnailUrl: result.thumbnailUrl,
        isEncrypted: result.isEncrypted
      }));

      // Show notification of successful upload
      notify("File uploaded", {
        body: `Your file "${file.name}" has been uploaded successfully.`
      });

      return result;
    } catch (error) {
      console.error("Enhanced upload error:", error);
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        error: error as Error
      }));

      toast({
        title: "Opplastingsfeil",
        description: (error as Error).message || "Kunne ikke laste opp filen",
        variant: "destructive"
      });

      return null;
    } finally {
      uploaderRef.current = null;
    }
  }, [session, toast, notify]);

  /**
   * Cancel an ongoing upload
   */
  const cancelUpload = useCallback(() => {
    if (uploaderRef.current) {
      uploaderRef.current.abortUpload();
    }
    
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      url: null
    });
  }, []);

  /**
   * Check if there are any resumable uploads available
   */
  const getResumableUploads = useCallback(() => {
    const uploader = new EnhancedMediaUploader();
    return uploader.getResumableUploads();
  }, []);

  /**
   * Clear all resumable uploads
   */
  const clearResumableUploads = useCallback(() => {
    const uploader = new EnhancedMediaUploader();
    uploader.clearAllResumableUploads();
  }, []);

  return {
    uploadFile,
    cancelUpload,
    uploadState,
    getResumableUploads,
    clearResumableUploads
  };
};