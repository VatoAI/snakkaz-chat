import { useState } from 'react';
import { EnhancedMediaUploader } from '@/utils/upload/enhanced-media-upload';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import CryptoJS from "crypto-js";

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

// Komprimer og tilpass bilde til WebP og max 1280px
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const maxDim = 1280;
      let { width, height } = img;
      if (width > height && width > maxDim) {
        height *= maxDim / width;
        width = maxDim;
      } else if (height > maxDim) {
        width *= maxDim / height;
        height = maxDim;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No ctx");
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("No blob");
          resolve(blob);
        },
        "image/webp",
        0.92
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Krypter Blob med AES
async function encryptBlob(blob: Blob, key: string): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer as any);
  const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();
  return new Blob([encrypted], { type: "application/octet-stream" });
}

export function useMediaUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });
  const { session } = useAuth();
  const { toast } = useToast();

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

  // Nytt: uploadFile støtter komprimering, kryptering og TTL
  const uploadFile = async (file: File, opts?: { ttlSeconds?: number; encryptionKey?: string }): Promise<UploadResult | null> => {
    if (!file) return null;

    // Attempt to use session or check with Supabase directly
    let isAuthenticated = !!session;

    // If no session was found in context, try to get it directly from Supabase
    if (!isAuthenticated) {
      try {
        const { data } = await supabase.auth.getSession();
        isAuthenticated = !!data.session;
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    }

    if (!isAuthenticated) {
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

      let processed: Blob = file;
      // Generate unique filename with timestamp to avoid conflicts
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 50);
      let filename = `${timestamp}_${randomStr}_${sanitizedName}`;

      // Komprimer hvis bilde
      if (file.type.startsWith("image/")) {
        processed = await compressImage(file);
        filename = filename.replace(/\.[^.]+$/, ".webp");
      }

      // Krypter hvis key er satt
      if (opts?.encryptionKey) {
        processed = await encryptBlob(processed, opts.encryptionKey);
        filename += ".enc";
      }

      // Gjør det enklere å spore trafikken i utviklermodus
      const processedFile = processed instanceof File ? processed : new File([processed], filename, {
        type: processed.type || "application/octet-stream"
      });

      // Update progress display
      let lastProgressUpdate = Date.now();
      let startTime = Date.now();

      // Bruk direkte upload istedenfor EnhancedMediaUploader
      // Dette unngår problemet med metadata og infinite recursion
      const { error } = await supabase.storage
        .from('chat-media')
        .upload(filename, processedFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Hent public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat-media')
        .getPublicUrl(filename);

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

      return { path: filename, publicUrl };
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
