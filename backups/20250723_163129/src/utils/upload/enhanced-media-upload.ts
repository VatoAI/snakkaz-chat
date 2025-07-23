import { supabase } from "@/integrations/supabase/client";

// Add these imports for encryption
import CryptoJS from 'crypto-js';

type UploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number; // bytes per second
};

// Resumable upload metadata
interface UploadMetadata {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  chunkSize: number;
  totalChunks: number;
  uploadedChunks: number[];
  filePath: string;
  createdAt: number;
  lastUpdated: number;
}

// Configuration
const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB maximum
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 2000; // 2 seconds base, will be multiplied by attempt number
const RESUMABLE_UPLOAD_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Compression settings
const DEFAULT_IMAGE_QUALITY = 0.85; // Reduced to 85% for better compression by default
const MAX_IMAGE_DIMENSION = 1920; // Max width/height for compressed images
const THUMBNAIL_SIZE = 320; // Thumbnail size for preview

// Image resize modes
type ResizeMode = 'fit' | 'cover' | 'contain' | 'none' | 'auto';

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
  private uploadMetadata: UploadMetadata | null = null;

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
   * Compress and resize image file before upload to reduce bandwidth while preserving quality
   * @param file The image file to process
   * @param options Compression and resizing options
   * @returns Processed file with adjusted size and quality
   */
  private async compressImage(file: File, options: { 
    quality?: number,
    maxWidth?: number,
    maxHeight?: number,
    resizeMode?: ResizeMode,
    preserveExif?: boolean
  } = {}): Promise<File> {
    // Skip compression for non-compressible formats
    const compressibleTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!compressibleTypes.includes(file.type)) {
      return file;
    }

    const quality = options.quality || DEFAULT_IMAGE_QUALITY;
    const maxWidth = options.maxWidth || MAX_IMAGE_DIMENSION;
    const maxHeight = options.maxHeight || MAX_IMAGE_DIMENSION;
    const resizeMode = options.resizeMode || 'auto';
    const preserveExif = options.preserveExif ?? true;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas with the desired dimensions
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Calculate new dimensions based on resize mode
        if (resizeMode === 'none') {
          // Use original dimensions
        } else if (resizeMode === 'fit' || resizeMode === 'auto') {
          // Scale down to fit within maxWidth and maxHeight while maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const ratio = Math.min(widthRatio, heightRatio);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }
        } else if (resizeMode === 'cover') {
          // Fill the entire target dimensions while maintaining aspect ratio (may crop)
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const ratio = Math.max(widthRatio, heightRatio);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        } else if (resizeMode === 'contain') {
          // Always resize to exact dimensions specified
          width = maxWidth;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image to canvas and export as blob
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Use better resampling for high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // For cover mode, we need to calculate cropping
        if (resizeMode === 'cover') {
          const sourceAspect = img.width / img.height;
          const targetAspect = maxWidth / maxHeight;
          let sourceX = 0, sourceY = 0;
          let sourceWidth = img.width, sourceHeight = img.height;
          
          if (sourceAspect > targetAspect) {
            // Image is wider than target area, crop sides
            sourceWidth = img.height * targetAspect;
            sourceX = (img.width - sourceWidth) / 2;
          } else {
            // Image is taller than target area, crop top/bottom
            sourceHeight = img.width / targetAspect;
            sourceY = (img.height - sourceHeight) / 2;
          }
          
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, width, height
          );
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }
        
        // Get output format based on browser support and original format
        let outputFormat = file.type;
        let outputQuality = quality;
        let outputFilename = file.name;
        
        // Convert to WebP if supported for better compression
        const canUseWebP = true; // Modern browsers all support WebP
        if (canUseWebP && outputFormat !== 'image/webp') {
          outputFormat = 'image/webp';
          outputFilename = file.name.replace(/\.(jpe?g|png|gif)$/i, '.webp');
          // WebP allows slightly higher quality for same filesize
          outputQuality = Math.min(quality * 1.1, 0.95);
        }
        
        // Generate blob with appropriate format and quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            // Create file from blob
            const compressedFile = new File([blob], outputFilename, { type: outputFormat });
            console.log(`Processed image: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB (${width}x${height})`);
            
            // If size increased after compression, use original file instead
            if (compressedFile.size > file.size && outputFormat === file.type) {
              console.log('Compressed file is larger than original, using original file');
              resolve(file);
              return;
            }
            
            resolve(compressedFile);
          },
          outputFormat,
          outputQuality
        );
      };
      
      img.onerror = () => {
        console.warn('Failed to load image for processing, using original file');
        resolve(file);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Generate thumbnail for an image or video file
   */
  private async generateThumbnail(file: File): Promise<File | null> {
    // Only generate thumbnails for images and videos
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return null;
    }

    return new Promise((resolve) => {
      try {
        if (file.type.startsWith('image/')) {
          // For images
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            
            // Calculate new dimensions while maintaining aspect ratio
            if (width > height && width > THUMBNAIL_SIZE) {
              height *= THUMBNAIL_SIZE / width;
              width = THUMBNAIL_SIZE;
            } else if (height > THUMBNAIL_SIZE) {
              width *= THUMBNAIL_SIZE / height;
              height = THUMBNAIL_SIZE;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(null);
              return;
            }
            
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  resolve(null);
                  return;
                }
                
                const thumbnailFile = new File(
                  [blob], 
                  `thumb_${file.name.replace(/\.[^/.]+$/, '.webp')}`,
                  { type: 'image/webp' }
                );
                
                resolve(thumbnailFile);
              },
              'image/webp',
              0.7 // Lower quality for thumbnails
            );
          };
          
          img.onerror = () => resolve(null);
          img.src = URL.createObjectURL(file);
        } else if (file.type.startsWith('video/')) {
          // For videos - create thumbnail from first frame
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            // Seek to the first frame
            video.currentTime = 0;
            
            video.onseeked = () => {
              const canvas = document.createElement('canvas');
              let { videoWidth, videoHeight } = video;
              
              // Calculate new dimensions while maintaining aspect ratio
              if (videoWidth > videoHeight && videoWidth > THUMBNAIL_SIZE) {
                videoHeight *= THUMBNAIL_SIZE / videoWidth;
                videoWidth = THUMBNAIL_SIZE;
              } else if (videoHeight > THUMBNAIL_SIZE) {
                videoWidth *= THUMBNAIL_SIZE / videoHeight;
                videoHeight = THUMBNAIL_SIZE;
              }
              
              canvas.width = videoWidth;
              canvas.height = videoHeight;
              
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                resolve(null);
                return;
              }
              
              ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
              
              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    resolve(null);
                    return;
                  }
                  
                  const thumbnailFile = new File(
                    [blob], 
                    `thumb_${file.name.replace(/\.[^/.]+$/, '.webp')}`,
                    { type: 'image/webp' }
                  );
                  
                  resolve(thumbnailFile);
                },
                'image/webp',
                0.7 // Lower quality for thumbnails
              );
            };
          };
          
          video.onerror = () => resolve(null);
          video.src = URL.createObjectURL(file);
        } else {
          resolve(null);
        }
      } catch (e) {
        console.error('Error generating thumbnail:', e);
        resolve(null);
      }
    });
  }

  /**
   * Encrypt a file before upload for enhanced privacy
   */
  public async encryptFile(file: File, encryptionKey: string): Promise<File> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (!e.target || !e.target.result) {
            reject(new Error('Failed to read file'));
            return;
          }
          
          // Get array buffer of file
          const arrayBuffer = e.target.result as ArrayBuffer;
          
          // Convert to WordArray for CryptoJS
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          
          // Encrypt the file content
          const encrypted = CryptoJS.AES.encrypt(wordArray, encryptionKey).toString();
          
          // Create a new file with encrypted content
          const encryptedFile = new File(
            [encrypted],
            `${file.name}.enc`,
            { type: 'application/octet-stream' }
          );
          
          resolve(encryptedFile);
        };
        
        reader.onerror = () => {
          reject(new Error('Error reading file for encryption'));
        };
        
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Ensure the storage bucket exists
   */
  private async ensureStorageBucket(): Promise<boolean> {
    try {
      // First, try using the bucket directly instead of checking/creating it
      // This works if the bucket has been pre-created in the Supabase project
      try {
        // Simple test operation to see if we can access the bucket 
        const { data, error } = await supabase.storage
          .from('chat-media')
          .list('', { limit: 1 });
          
        if (!error) {
          // We can access the bucket, so it exists
          return true;
        }
      } catch (directError) {
        console.warn('Error accessing storage bucket directly:', directError);
        // Continue with the fallback approach
      }
      
      // Fallback: Try to list buckets to check if it exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        
        // If we get a permission error, the bucket may still exist but we can't list it
        // Let's try a direct upload to see if the bucket works regardless
        try {
          const testData = new Blob(['test'], { type: 'text/plain' });
          const testPath = `test_${Date.now()}.txt`;
          
          const { error: testError } = await supabase.storage
            .from('chat-media')
            .upload(testPath, testData, {
              upsert: true
            });
            
          // If no error, we can use the bucket
          if (!testError) {
            // Clean up the test file
            supabase.storage.from('chat-media').remove([testPath])
              .catch(e => console.warn('Error cleaning up test file:', e));
              
            return true;
          } else {
            console.error('Test upload failed:', testError);
          }
        } catch (testError) {
          console.error('Test upload failed:', testError);
        }
        
        return false;
      }
      
      // Check if the bucket exists
      const bucketExists = buckets.some(bucket => bucket.name === 'chat-media');
      
      if (bucketExists) {
        return true;
      }
      
      // If bucket doesn't exist and we have permission to list buckets,
      // try to create it - this will only work with admin permissions
      const { error: createError } = await supabase.storage.createBucket('chat-media', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'application/octet-stream']
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        
        // Even though creation failed, the bucket might have been created by another admin previously
        // Let's try a direct upload to see if the bucket works regardless
        try {
          const testData = new Blob(['test'], { type: 'text/plain' });
          const testPath = `test_${Date.now()}.txt`;
          
          const { error: testError } = await supabase.storage
            .from('chat-media')
            .upload(testPath, testData, {
              upsert: true
            });
            
          // If no error, we can use the bucket
          if (!testError) {
            // Clean up the test file
            supabase.storage.from('chat-media').remove([testPath])
              .catch(e => console.warn('Error cleaning up test file:', e));
              
            return true;
          }
        } catch (testError) {
          console.error('Test upload failed:', testError);
        }
        
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
   * Save upload metadata to enable resumable uploads
   */
  private saveUploadMetadata(metadata: UploadMetadata): void {
    try {
      // Save to localStorage for persistence
      const storedUploads = localStorage.getItem('resumable-uploads');
      let uploads = storedUploads ? JSON.parse(storedUploads) : {};
      
      // Update or add this upload
      uploads[metadata.fileId] = metadata;
      
      // Clean up old uploads
      const now = Date.now();
      for (const id in uploads) {
        if (now - uploads[id].lastUpdated > RESUMABLE_UPLOAD_EXPIRY) {
          delete uploads[id];
        }
      }
      
      localStorage.setItem('resumable-uploads', JSON.stringify(uploads));
      this.uploadMetadata = metadata;
    } catch (e) {
      console.error('Error saving upload metadata:', e);
    }
  }

  /**
   * Get upload metadata for a file if it exists
   */
  private getUploadMetadata(file: File): UploadMetadata | null {
    try {
      const storedUploads = localStorage.getItem('resumable-uploads');
      if (!storedUploads) return null;
      
      const uploads = JSON.parse(storedUploads);
      
      // Generate a file ID based on name and size
      const fileId = this.generateFileId(file);
      
      // Find existing uploads for this file
      const metadata = uploads[fileId];
      if (metadata && 
         metadata.fileSize === file.size && 
         metadata.fileName === file.name && 
         metadata.fileType === file.type) {
        return metadata;
      }
      
      return null;
    } catch (e) {
      console.error('Error retrieving upload metadata:', e);
      return null;
    }
  }

  /**
   * Generate a unique ID for a file based on its properties
   */
  private generateFileId(file: File): string {
    return `${file.name}_${file.size}_${file.lastModified}`.replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Update upload metadata with progress
   */
  private updateUploadMetadata(chunkIndex: number): void {
    if (!this.uploadMetadata) return;
    
    this.uploadMetadata.uploadedChunks.push(chunkIndex);
    this.uploadMetadata.lastUpdated = Date.now();
    this.saveUploadMetadata(this.uploadMetadata);
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
    
    // Check for existing upload
    let existingMetadata = this.getUploadMetadata(file);
    let uploadedChunks: number[] = [];
    
    if (existingMetadata && existingMetadata.filePath === filePath) {
      uploadedChunks = existingMetadata.uploadedChunks;
      console.log(`Resuming upload: ${uploadedChunks.length} chunks already uploaded`);
    }
    
    // Create chunks
    const chunks: Blob[] = [];
    let offset = 0;
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + MAX_CHUNK_SIZE);
      chunks.push(chunk);
      offset += MAX_CHUNK_SIZE;
    }

    const totalChunks = chunks.length;
    let completedChunks = uploadedChunks.length;
    let failedChunkIndexes: number[] = [];

    console.log(`Starting chunked upload: ${totalChunks} chunks (${completedChunks} already uploaded)`);

    // Create upload metadata if not resuming
    if (!existingMetadata) {
      this.uploadMetadata = {
        fileId: this.generateFileId(file),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        chunkSize: MAX_CHUNK_SIZE,
        totalChunks,
        uploadedChunks: [],
        filePath,
        createdAt: Date.now(),
        lastUpdated: Date.now()
      };
      this.saveUploadMetadata(this.uploadMetadata);
    } else {
      this.uploadMetadata = existingMetadata;
    }

    // Initial progress report based on already uploaded chunks
    const initialProgress = completedChunks / totalChunks;
    onProgress({
      loaded: initialProgress * file.size,
      total: file.size,
      percentage: initialProgress * 100
    });

    // Abort controller for cancellation
    this.abortController = new AbortController();

    // Upload all remaining chunks
    for (let i = 0; i < chunks.length; i++) {
      if (this.abortController.signal.aborted) {
        throw new Error('Upload aborted');
      }
      
      // Skip already uploaded chunks
      if (uploadedChunks.includes(i)) {
        continue;
      }
      
      try {
        await this.uploadChunk(
          chunks[i], 
          `${filePath}__chunk_${i}`, 
          (chunkProgress) => {
            if (this.abortController?.signal.aborted) return;
            
            // Calculate overall progress based on all chunks
            const chunkSize = chunks[i].size;
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
        this.updateUploadMetadata(i);
      } catch (error) {
        console.error(`Chunk ${i} failed:`, error);
        failedChunkIndexes.push(i);
      }
    }

    // Retry failed chunks
    let retryAttempt = 0;
    while (failedChunkIndexes.length > 0 && retryAttempt < MAX_RETRIES) {
      retryAttempt++;
      console.log(`Retry attempt ${retryAttempt} for ${failedChunkIndexes.length} failed chunks`);
      
      // Delay before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_BASE * retryAttempt));
      
      const retryIndexes = [...failedChunkIndexes];
      failedChunkIndexes = [];
      
      for (const index of retryIndexes) {
        if (this.abortController?.signal.aborted) {
          throw new Error('Upload aborted');
        }
        
        try {
          await this.uploadChunk(
            chunks[index], 
            `${filePath}__chunk_${index}`, 
            () => {} // Skip progress reporting on retries
          );
          completedChunks++;
          this.updateUploadMetadata(index);
        } catch (error) {
          console.error(`Chunk ${index} failed on retry ${retryAttempt}:`, error);
          failedChunkIndexes.push(index);
        }
      }
    }

    // Check if all chunks were uploaded successfully
    if (failedChunkIndexes.length > 0) {
      // We won't clean up successful chunks to allow resuming later
      throw new Error(`Upload paused: ${failedChunkIndexes.length} chunks could not be uploaded. You can retry later.`);
    }

    // If all chunks are uploaded, combine them
    const finalFilePath = await this.combineChunks(filePath, totalChunks);
    
    // Clear upload metadata as it's complete
    this.clearUploadMetadata();
    
    // 100% progress
    onProgress({
      loaded: file.size,
      total: file.size,
      percentage: 100
    });

    return finalFilePath;
  }

  /**
   * Clear upload metadata once complete
   */
  private clearUploadMetadata(): void {
    if (!this.uploadMetadata) return;
    
    try {
      const storedUploads = localStorage.getItem('resumable-uploads');
      if (!storedUploads) return;
      
      const uploads = JSON.parse(storedUploads);
      delete uploads[this.uploadMetadata.fileId];
      localStorage.setItem('resumable-uploads', JSON.stringify(uploads));
      this.uploadMetadata = null;
    } catch (e) {
      console.error('Error clearing upload metadata:', e);
    }
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
    options: {
      onProgress?: (progress: UploadProgress) => void;
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
    } = {}
  ): Promise<{ 
    path: string; 
    publicUrl: string;
    thumbnailPath?: string;
    thumbnailUrl?: string;
    isEncrypted?: boolean;
  }> {
    const { 
      onProgress, 
      compress = true, 
      resize = { 
        maxWidth: MAX_IMAGE_DIMENSION, 
        maxHeight: MAX_IMAGE_DIMENSION,
        mode: 'auto',
        quality: DEFAULT_IMAGE_QUALITY
      }, 
      encrypt = false, 
      encryptionKey, 
      generateThumbnail = true 
    } = options;
    
    try {
      // Validate file
      if (!file) throw new Error("No file provided");
      
      // Check file type
      if (!this.isAllowedFileType(file)) {
        throw new Error("File type not supported. Supported formats include images, video, audio and PDF");
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File is too large (maximum ${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
      }
      
      // Check network connection
      const isConnected = await this.checkNetworkConnection();
      if (!isConnected) {
        throw new Error("No network connection. Check your internet connection and try again.");
      }
      
      // Ensure storage bucket exists
      const bucketExists = await this.ensureStorageBucket();
      if (!bucketExists) {
        throw new Error("Could not create or access storage bucket.");
      }

      let processedFile = file;
      let isEncrypted = false;
      
      // Generate thumbnail if requested (before encryption)
      let thumbnailFile: File | null = null;
      if (generateThumbnail && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
        try {
          thumbnailFile = await this.generateThumbnail(file);
        } catch (error) {
          console.warn('Thumbnail generation failed:', error);
        }
      }
      
      // Process image if applicable and requested
      if (compress && file.type.startsWith('image/')) {
        try {
          processedFile = await this.compressImage(file, {
            quality: resize.quality,
            maxWidth: resize.maxWidth,
            maxHeight: resize.maxHeight,
            resizeMode: resize.mode
          });
        } catch (error) {
          console.warn('Image processing failed, using original file:', error);
          processedFile = file;
        }
      }
      
      // Encrypt file if requested
      if (encrypt && encryptionKey) {
        try {
          processedFile = await this.encryptFile(processedFile, encryptionKey);
          isEncrypted = true;
        } catch (error) {
          console.warn('File encryption failed, using unencrypted file:', error);
        }
      }
      
      // Generate file path
      const filePath = this.generateFilePath(processedFile);
      let thumbnailPath: string | undefined;
      
      // Progress tracking callback
      const progressCallback = (progress: UploadProgress) => {
        onProgress?.(progress);
      };
      
      let uploadedPath: string;
      
      // Choose upload strategy based on file size
      if (processedFile.size > MAX_CHUNK_SIZE) {
        // Use chunked upload for large files
        uploadedPath = await this.uploadChunked(processedFile, filePath, progressCallback);
      } else {
        // Use direct upload for small files
        try {
          const { error } = await supabase.storage
            .from('chat-media')
            .upload(filePath, processedFile, {
              cacheControl: '3600',
              upsert: true,
              onUploadProgress: (progress) => {
                progressCallback({
                  loaded: progress.loaded,
                  total: progress.totalBytes || processedFile.size,
                  percentage: Math.floor((progress.loaded / (progress.totalBytes || processedFile.size)) * 100)
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
      
      // Upload thumbnail if available
      if (thumbnailFile) {
        try {
          thumbnailPath = `thumb_${uploadedPath}`;
          const { error } = await supabase.storage
            .from('chat-media')
            .upload(thumbnailPath, thumbnailFile, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (error) {
            console.warn('Thumbnail upload failed:', error);
            thumbnailPath = undefined;
          }
        } catch (error) {
          console.warn('Thumbnail upload failed:', error);
          thumbnailPath = undefined;
        }
      }
      
      // Get public URLs
      const { data: { publicUrl } } = supabase.storage
        .from('chat-media')
        .getPublicUrl(uploadedPath);
        
      let thumbnailUrl: string | undefined;
      if (thumbnailPath) {
        const { data: { publicUrl: thumbUrl } } = supabase.storage
          .from('chat-media')
          .getPublicUrl(thumbnailPath);
          
        thumbnailUrl = thumbUrl;
      }
      
      return {
        path: uploadedPath,
        publicUrl,
        thumbnailPath,
        thumbnailUrl,
        isEncrypted
      };
    } catch (error: any) {
      console.error('Upload failed:', error);
      // Provide user-friendly error messages
      throw new Error(this.getUserFriendlyErrorMessage(error));
    }
  }
  
  /**
   * Convert technical error messages to user-friendly ones
   */
  private getUserFriendlyErrorMessage(error: any): string {
    const errorMessage = error?.message || String(error);
    
    if (errorMessage.includes('network')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    
    if (errorMessage.includes('timeout')) {
      return 'Upload timed out. Please try again with a better connection.';
    }
    
    if (errorMessage.includes('permission')) {
      return 'You don\'t have permission to upload files. Please contact support.';
    }
    
    if (errorMessage.includes('large')) {
      return `File is too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`;
    }

    if (errorMessage.includes('type')) {
      return 'This file type is not supported. Please upload images, videos, audio or PDF files.';
    }
    
    if (errorMessage.includes('paused')) {
      return 'Upload paused due to connection issues. You can resume it later.';
    }
    
    // Return the original error if no friendly message is available
    return errorMessage;
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

  /**
   * Get a list of resumable uploads
   */
  public getResumableUploads(): UploadMetadata[] {
    try {
      const storedUploads = localStorage.getItem('resumable-uploads');
      if (!storedUploads) return [];
      
      const uploads = JSON.parse(storedUploads);
      return Object.values(uploads);
    } catch (e) {
      console.error('Error getting resumable uploads:', e);
      return [];
    }
  }

  /**
   * Clear all resumable uploads
   */
  public clearAllResumableUploads(): void {
    try {
      localStorage.removeItem('resumable-uploads');
    } catch (e) {
      console.error('Error clearing resumable uploads:', e);
    }
  }
}