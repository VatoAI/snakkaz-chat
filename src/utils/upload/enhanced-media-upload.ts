import { supabase } from "@/integrations/supabase/client";

type UploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number; // bytes per second
};

// Configuration
const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB maximum
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 2000; // 2 seconds base, will be multiplied by attempt number

// Compression settings
const DEFAULT_IMAGE_QUALITY = 1.0; // 100%
//  quality for images
const MAX_IMAGE_DIMENSION = 1920; // Max width/height for compressed images

/**
 * Enhanced media upload with chunk support for large files
 */
export class EnhancedMediaUploader {
  private abortController: AbortController | null = null;
  private speedTracker = {
    startTime: 0,
    lastUpdate: 0,
    bytesLoaded: 0,
    speeds: [] as number[],
  };

  /**
   * Check if file type is allowed
   */
  public isAllowedFileType(file: File): boolean {
    // If it's an encrypted file, allow it
    if (file.type === 'application/octet-stream') {
      return true;
    }
    
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm',
      'application/pdf'
    ];
    
    // Check by MIME type first
    if (allowedTypes.includes(file.type)) {
      return true;
    }
    
    // Fallback to extension checking
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 
                              'mp4', 'webm', 'ogg', 'mov', 
                              'mp3', 'wav',
                              'pdf', 'bin'];
                              
    return allowedExtensions.includes(fileExtension || '');
  }

  /**
   * Check if network connection is available
   */
  public async checkNetworkConnection(): Promise<boolean> {
    try {
      // Try multiple ways to verify connectivity
      if (!navigator.onLine) {
        return false;
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch('https://api.supabase.com/ping', {
          method: 'HEAD',
          signal: controller.signal,
          cache: 'no-cache'
        });
        clearTimeout(timeoutId);
        return response.ok;
      } catch (e) {
        // Try Supabase endpoint if general internet check fails
        try {
          const { error } = await supabase.from('profiles').select('count').limit(1).maybeSingle();
          return !error;
        } catch (e) {
          return false;
        }
      }
    } catch (e) {
      return navigator.onLine; // Fallback to navigator.onLine as last resort
    }
  }

  /**
   * Compress image file before upload to reduce bandwidth
   */
  private async compressImage(file: File, options: { 
    quality?: number,
    maxDimension?: number,
  } = {}): Promise<File> {
    // Skip compression for non-compressible formats
    const compressibleTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!compressibleTypes.includes(file.type)) {
      return file;
    }

    const quality = options.quality || DEFAULT_IMAGE_QUALITY;
    const maxDimension = options.maxDimension || MAX_IMAGE_DIMENSION;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas with the desired dimensions
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height && width > maxDimension) {
          height *= maxDimension / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width *= maxDimension / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image to canvas and export as blob
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get output format
        let outputFormat = file.type;
        // Convert PNG to WebP for better compression if supported
        if (outputFormat === 'image/png' && canvas.toBlob !== undefined) {
          try {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Canvas to Blob conversion failed'));
                  return;
                }
                
                const compressedFile = new File(
                  [blob], 
                  file.name.replace(/\.(png|jpg|jpeg)$/i, '.webp'),
                  { type: 'image/webp' }
                );
                
                console.log(`Compressed image: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB`);
                resolve(compressedFile);
              },
              'image/webp',
              quality
            );
            return;
          } catch (e) {
            // Fallback to original format if WebP not supported
            console.warn('WebP conversion failed, using original format', e);
          }
        }
        
        // Use the original format if WebP conversion failed or wasn't attempted
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            const compressedFile = new File([blob], file.name, { type: file.type });
            console.log(`Compressed image: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB`);
            resolve(compressedFile);
          },
          outputFormat,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Ensure the storage bucket exists
   */
  private async ensureStorageBucket(): Promise<boolean> {
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return false;
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === 'chat-media');
      
      if (bucketExists) {
        return true;
      }
      
      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('chat-media', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'application/octet-stream']
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      
      return true;
    } catch (e) {
      console.error('Error ensuring storage bucket:', e);
      return false;
    }
  }

  /**
   * Generate a unique file path for upload
   */
  private generateFilePath(file: File): string {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
      .substring(0, 50); // Limit filename length
    
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${timestamp}_${randomStr}_${sanitizedName}`;
  }

  /**
   * Upload a file in chunks
   */
  private async uploadChunked(
    file: File, 
    filePath: string, 
    onProgress: (progress: UploadProgress) => void
  ): Promise<string> {
    this.speedTracker = {
      startTime: Date.now(),
      lastUpdate: Date.now(),
      bytesLoaded: 0,
      speeds: [],
    };
    
    // Create chunks
    const chunks: Blob[] = [];
    let offset = 0;
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + MAX_CHUNK_SIZE);
      chunks.push(chunk);
      offset += MAX_CHUNK_SIZE;
    }

    const totalChunks = chunks.length;
    let completedChunks = 0;
    let failedChunkIndexes: number[] = [];

    console.log(`Starting chunked upload: ${totalChunks} chunks`);

    // Initial progress report
    onProgress({
      loaded: 0,
      total: file.size,
      percentage: 0
    });

    // Abort controller for cancellation
    this.abortController = new AbortController();

    // First pass: try to upload all chunks
    try {
      await Promise.all(
        chunks.map(async (chunk, index) => {
          if (this.abortController?.signal.aborted) {
            throw new Error('Upload aborted');
          }

          try {
            await this.uploadChunk(
              chunk, 
              `${filePath}__chunk_${index}`, 
              (chunkProgress) => {
                if (this.abortController?.signal.aborted) return;
                
                // Calculate overall progress based on all chunks
                const chunkSize = chunk.size;
                const chunkLoaded = (chunkProgress.percentage / 100) * chunkSize;
                
                // Update speed tracker
                const now = Date.now();
                const timeDiff = now - this.speedTracker.lastUpdate;
                
                // Only update speed every 500ms to smooth it out
                if (timeDiff > 500) {
                  const bytesLoaded = completedChunks * MAX_CHUNK_SIZE + chunkLoaded;
                  const bytesLoadedDiff = bytesLoaded - this.speedTracker.bytesLoaded;
                  const speed = (bytesLoadedDiff / timeDiff) * 1000; // bytes per second
                  
                  this.speedTracker.speeds.push(speed);
                  // Keep last 5 speed measurements for better average
                  if (this.speedTracker.speeds.length > 5) {
                    this.speedTracker.speeds.shift();
                  }
                  
                  this.speedTracker.bytesLoaded = bytesLoaded;
                  this.speedTracker.lastUpdate = now;
                }
                
                const totalLoaded = completedChunks * MAX_CHUNK_SIZE + chunkLoaded;
                const overallPercentage = Math.min(99, (totalLoaded / file.size) * 100);
                
                // Calculate average speed
                const avgSpeed = this.speedTracker.speeds.length > 0
                  ? this.speedTracker.speeds.reduce((a, b) => a + b, 0) / this.speedTracker.speeds.length
                  : 0;
                
                onProgress({
                  loaded: totalLoaded,
                  total: file.size,
                  percentage: overallPercentage,
                  speed: avgSpeed
                });
              }
            );
            completedChunks++;
          } catch (error) {
            console.error(`Chunk ${index} failed:`, error);
            failedChunkIndexes.push(index);
          }
        })
      );
    } catch (error) {
      if (this.abortController?.signal.aborted) {
        throw new Error('Upload aborted by user');
      }
      console.error("Error during initial chunk uploads:", error);
    }

    // Second pass: retry failed chunks
    let retryAttempt = 0;
    while (failedChunkIndexes.length > 0 && retryAttempt < MAX_RETRIES) {
      retryAttempt++;
      console.log(`Retry attempt ${retryAttempt} for ${failedChunkIndexes.length} failed chunks`);
      
      // Delay before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_BASE * retryAttempt));
      
      const retryIndexes = [...failedChunkIndexes];
      failedChunkIndexes = [];
      
      await Promise.all(
        retryIndexes.map(async (index) => {
          if (this.abortController?.signal.aborted) return;
          
          try {
            await this.uploadChunk(
              chunks[index], 
              `${filePath}__chunk_${index}`, 
              () => {} // Skip progress reporting on retries
            );
            completedChunks++;
          } catch (error) {
            console.error(`Chunk ${index} failed on retry ${retryAttempt}:`, error);
            failedChunkIndexes.push(index);
          }
        })
      );
    }

    // Check if all chunks were uploaded successfully
    if (failedChunkIndexes.length > 0) {
      // Cleanup any successful chunks
      chunks.forEach((_, index) => {
        if (!failedChunkIndexes.includes(index)) {
          supabase.storage
            .from('chat-media')
            .remove([`${filePath}__chunk_${index}`])
            .then(() => console.log(`Cleaned up chunk ${index}`))
            .catch(err => console.error(`Failed to clean up chunk ${index}:`, err));
        }
      });
      
      throw new Error(`Upload failed: ${failedChunkIndexes.length} chunks could not be uploaded`);
    }

    // If all chunks are uploaded, combine them
    const finalFilePath = await this.combineChunks(filePath, totalChunks);
    
    // 100% progress
    onProgress({
      loaded: file.size,
      total: file.size,
      percentage: 100
    });

    return finalFilePath;
  }

  /**
   * Upload a single chunk
   */
  private async uploadChunk(
    chunk: Blob, 
    chunkPath: string,
    onProgress: (progress: UploadProgress) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Try to get a signed URL first
      supabase.storage
        .from('chat-media')
        .createSignedUploadUrl(chunkPath)
        .then(({ data, error }) => {
          if (error) {
            // Fall back to direct upload if signed URL fails
            this.fallbackChunkUpload(chunk, chunkPath, onProgress)
              .then(resolve)
              .catch(reject);
            return;
          }

          xhr.open('PUT', data.signedUrl);
          xhr.setRequestHeader('Content-Type', 'application/octet-stream');
          
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              onProgress({
                loaded: event.loaded,
                total: event.total,
                percentage: (event.loaded / event.total) * 100
              });
            }
          };
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Server responded with status ${xhr.status}`));
            }
          };
          
          xhr.onerror = () => {
            reject(new Error('Network error during upload'));
          };
          
          xhr.ontimeout = () => {
            reject(new Error('Upload timed out'));
          };
          
          xhr.timeout = 30000; // 30 seconds timeout
          
          xhr.send(chunk);
        })
        .catch(error => {
          this.fallbackChunkUpload(chunk, chunkPath, onProgress)
            .then(resolve)
            .catch(reject);
        });
    });
  }

  /**
   * Fallback method for uploading a chunk directly
   */
  private async fallbackChunkUpload(
    chunk: Blob, 
    chunkPath: string,
    onProgress: (progress: UploadProgress) => void
  ): Promise<void> {
    try {
      onProgress({ loaded: 0, total: chunk.size, percentage: 0 });
      
      const { error } = await supabase.storage
        .from('chat-media')
        .upload(chunkPath, chunk, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) throw error;
      
      onProgress({ loaded: chunk.size, total: chunk.size, percentage: 100 });
    } catch (error) {
      console.error('Fallback upload failed:', error);
      throw error;
    }
  }

  /**
   * Combine uploaded chunks into a single file
   */
  private async combineChunks(basePath: string, totalChunks: number): Promise<string> {
    const combineFunction = `
      // This function runs on Supabase Edge Functions to combine chunks
      const chunkPaths = [];
      for (let i = 0; i < ${totalChunks}; i++) {
        chunkPaths.push('${basePath}__chunk_' + i);
      }
      
      // Read all chunks in order
      const chunks = await Promise.all(
        chunkPaths.map(path => supabase.storage.from('chat-media').download(path))
      );
      
      // Combine into a single blob
      const file = new Blob(chunks.map(res => res.data));
      
      // Upload the combined file
      const { error } = await supabase.storage
        .from('chat-media')
        .upload('${basePath}', file, { upsert: true });
      
      // Clean up chunks
      await supabase.storage.from('chat-media').remove(chunkPaths);
      
      return { success: !error, path: '${basePath}' };
    `;

    // For now, since we're not using edge functions, we'll simulate this on the client
    // But this should ideally be moved to a server function

    // Get all chunks
    const chunkPaths = [];
    const chunks: ArrayBuffer[] = [];
    
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = `${basePath}__chunk_${i}`;
      chunkPaths.push(chunkPath);
      
      try {
        // Download each chunk
        const { data, error } = await supabase.storage
          .from('chat-media')
          .download(chunkPath);
        
        if (error) throw error;
        if (!data) throw new Error(`No data returned for chunk ${i}`);
        
        const buffer = await data.arrayBuffer();
        chunks.push(buffer);
      } catch (error) {
        console.error(`Error downloading chunk ${i}:`, error);
        throw new Error(`Failed to download chunk ${i} for combination`);
      }
    }
    
    // Combine chunks
    const blob = new Blob(chunks);
    
    // Upload combined file
    const { error } = await supabase.storage
      .from('chat-media')
      .upload(basePath, blob, { 
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      throw new Error(`Failed to upload combined file: ${error.message}`);
    }
    
    // Clean up chunks (in background)
    supabase.storage
      .from('chat-media')
      .remove(chunkPaths)
      .catch(err => console.error('Error cleaning up chunks:', err));
    
    return basePath;
  }

  /**
   * Upload a file with optimal strategy based on size
   */
  public async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ path: string; publicUrl: string }> {
    try {
      // Validate file
      if (!file) throw new Error("Ingen fil angitt");
      
      // Check file type
      if (!this.isAllowedFileType(file)) {
        throw new Error("Filtypen støttes ikke. Støttede formater inkluderer bilder, video, lyd og PDF");
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Filen er for stor (maksimalt ${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
      }
      
      // Check network connection
      const isConnected = await this.checkNetworkConnection();
      if (!isConnected) {
        throw new Error("Ingen nettverkstilkobling. Sjekk internettforbindelsen din og prøv igjen.");
      }
      
      // Ensure storage bucket exists
      const bucketExists = await this.ensureStorageBucket();
      if (!bucketExists) {
        throw new Error("Kunne ikke opprette eller få tilgang til lagringsområdet.");
      }
      
      // Compress image if applicable
      const compressedFile = await this.compressImage(file);
      
      // Generate file path
      const filePath = this.generateFilePath(compressedFile);
      
      // Progress tracking callback
      const progressCallback = (progress: UploadProgress) => {
        onProgress?.(progress);
      };
      
      let uploadedPath: string;
      
      // Choose upload strategy based on file size
      if (compressedFile.size > MAX_CHUNK_SIZE) {
        // Use chunked upload for large files
        uploadedPath = await this.uploadChunked(compressedFile, filePath, progressCallback);
      } else {
        // Use direct upload for small files
        try {
          const { error } = await supabase.storage
            .from('chat-media')
            .upload(filePath, compressedFile, {
              cacheControl: '3600',
              upsert: true,
              onUploadProgress: (progress) => {
                progressCallback({
                  loaded: progress.loaded,
                  total: progress.totalBytes || compressedFile.size,
                  percentage: Math.floor((progress.loaded / (progress.totalBytes || compressedFile.size)) * 100)
                });
              }
            });
            
          if (error) throw error;
          uploadedPath = filePath;
        } catch (error) {
          console.error('Direct upload failed:', error);
          throw error;
        }
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat-media')
        .getPublicUrl(uploadedPath);
        
      return {
        path: uploadedPath,
        publicUrl
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
  
  /**
   * Abort an ongoing upload
   */
  public abortUpload(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}