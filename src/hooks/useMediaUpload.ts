import { useState } from 'react';
import { EnhancedMediaUploader } from '@/utils/upload/enhanced-media-upload';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './useAuth';

type UploadState = {
  isUploading: boolean;
  progress: number;
  error: string | null;
  speed?: number; // bytes per second
  timeRemaining?: number; // seconds
};

type UploadResult = {
  path: string;
  publicUrl: string;
};

export function useMediaUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });
  const { session } = useAuth();
  const { toast } = useToast();
  const uploader = new EnhancedMediaUploader();
  
  // Format file size in human readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Format speed in human readable format
  const formatSpeed = (bytesPerSecond: number): string => {
    if (bytesPerSecond === 0) return '0 KB/s';
    if (bytesPerSecond < 1024) return `${bytesPerSecond.toFixed(0)} B/s`;
    if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
    return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
  };

  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    if (!file) return null;
    if (!session) {
      toast({
        title: 'Ikke pålogget',
        description: 'Du må være pålogget for å laste opp filer.',
        variant: 'destructive',
      });
      return null;
    }
    
    // Check file size (10MB max)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      toast({
        title: "Error",
        description: "File too large (max 10MB)",
        variant: "destructive",
      });
      throw new Error("File too large (max 10MB)");
    }

    let lastProgressUpdate = Date.now();
    let startTime = Date.now();
    
    try {
      setState({
        isUploading: true,
        progress: 0,
        error: null,
      });

      // Show initial toast
      const toastId = toast({
        title: 'Laster opp fil',
        description: `Starter opplasting av ${file.name} (${formatFileSize(file.size)})`,
        duration: 10000,
      }).id;
      
      // Use our enhanced uploader
      const result = await uploader.uploadFile(file, (progress) => {
        // Update state with progress
        setState(prev => ({
          ...prev,
          progress: progress.percentage,
          speed: progress.speed,
          timeRemaining: progress.speed && progress.speed > 0 ? 
            Math.ceil((progress.total - progress.loaded) / progress.speed) : 
            undefined
        }));
        
        // Update toast every 1 second to avoid too many updates
        const now = Date.now();
        if (now - lastProgressUpdate > 1000) {
          lastProgressUpdate = now;
          
          let description = `${progress.percentage.toFixed(0)}% fullført`;
          
          if (progress.speed) {
            description += ` • ${formatSpeed(progress.speed)}`;
            
            // Add time remaining if available
            if (progress.speed > 0) {
              const secondsRemaining = Math.ceil((progress.total - progress.loaded) / progress.speed);
              if (secondsRemaining < 60) {
                description += ` • ${secondsRemaining}s gjenstår`;
              } else if (secondsRemaining < 3600) {
                description += ` • ${Math.ceil(secondsRemaining / 60)}m gjenstår`;
              } else {
                description += ` • ${Math.ceil(secondsRemaining / 3600)}h gjenstår`;
              }
            }
          }
          
          toast({
            id: toastId,
            title: 'Laster opp fil',
            description: description,
            duration: 3000,
          });
        }
      });
      
      // Upload completed
      const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
      
      toast({
        title: 'Opplasting fullført',
        description: `${file.name} (${formatFileSize(file.size)}) ble lastet opp på ${totalTime}s`,
        duration: 3000,
      });
      
      setState({
        isUploading: false,
        progress: 100,
        error: null,
      });
      
      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Ukjent feil under opplasting';
      
      toast({
        title: 'Opplasting feilet',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
      
      setState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
      });
      
      return null;
    }
  };

  const cancelUpload = () => {
    uploader.abortUpload();
    setState({
      isUploading: false,
      progress: 0,
      error: 'Upload cancelled',
    });
    
    toast({
      title: 'Opplasting avbrutt',
      description: 'Filoverføringen ble avbrutt',
      duration: 3000,
    });
  };

  return {
    uploadFile,
    cancelUpload,
    uploadState: state,
  };
}
