/**
 * Media Upload Service for Snakkaz Chat
 * 
 * This service handles uploading, resizing, and encryption of media files
 * including images, videos, and documents.
 */

import { EncryptionService, SecurityLevel, EncryptionType } from './encryptionService';
import { 
  generateAesKey,
  exportKeyToJwk,
  encryptAesGcm,
  decryptAesGcm,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  KeyType,
  KeyUsage
} from './cryptoUtils';
import { supabase } from '../../integrations/supabase/client';

// Define supported media types
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AUDIO = 'audio'
}

// Media upload options
export interface MediaUploadOptions {
  maxSizeMB?: number;        // Maximum file size in MB
  compressImages?: boolean;   // Whether to compress images
  encryptMedia?: boolean;     // Whether to encrypt media
  securityLevel?: SecurityLevel; // Security level for encryption
  generateThumbnail?: boolean; // Whether to generate thumbnails
  allowedTypes?: MediaType[];  // Allowed media types
  customEncryptionKey?: CryptoKey; // Custom encryption key
}

// Default options
const DEFAULT_OPTIONS: MediaUploadOptions = {
  maxSizeMB: 10,              // Default max size: 10MB
  compressImages: true,       // Compress images by default
  encryptMedia: true,         // Encrypt media by default
  securityLevel: SecurityLevel.E2EE,
  generateThumbnail: true,    // Generate thumbnails by default
  allowedTypes: [MediaType.IMAGE, MediaType.VIDEO, MediaType.DOCUMENT, MediaType.AUDIO]
};

// Result of media upload
export interface MediaUploadResult {
  originalFile: File;
  url?: string;               // URL to the uploaded file
  thumbnailUrl?: string;      // URL to the thumbnail
  type: MediaType;            // Type of media
  size: number;               // Size in bytes
  dimensions?: {              // Dimensions if applicable
    width: number;
    height: number;
  };
  encrypted: boolean;         // Whether the file is encrypted
  keyId?: string;             // Encryption key ID if encrypted
  encryptionDetails?: {       // Encryption details if encrypted
    algorithm: string;        // Encryption algorithm used
    ivBase64: string;         // Initialization vector in base64
    keyVersion: number;       // Key version
  };
}

// Media upload error types
export enum MediaUploadErrorType {
  FILE_TOO_LARGE = 'file_too_large',
  UNSUPPORTED_TYPE = 'unsupported_type',
  ENCRYPTION_FAILED = 'encryption_failed',
  UPLOAD_FAILED = 'upload_failed',
  COMPRESSION_FAILED = 'compression_failed'
}

// Custom error class
export class MediaUploadError extends Error {
  type: MediaUploadErrorType;
  
  constructor(message: string, type: MediaUploadErrorType) {
    super(message);
    this.type = type;
    this.name = 'MediaUploadError';
  }
}

export class MediaUploadService {
  private encryptionService: EncryptionService;
  private options: MediaUploadOptions;
  
  constructor(options?: Partial<MediaUploadOptions>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.encryptionService = new EncryptionService();
  }
  
  /**
   * Determine the media type from a file
   */
  private getMediaType(file: File): MediaType {
    const mimePrefix = file.type.split('/')[0];
    
    switch (mimePrefix) {
      case 'image':
        return MediaType.IMAGE;
      case 'video':
        return MediaType.VIDEO;
      case 'audio':
        return MediaType.AUDIO;
      default:
        return MediaType.DOCUMENT;
    }
  }
  
  /**
   * Compress an image file
   */
  private async compressImage(file: File): Promise<{ 
    file: File; 
    dimensions: { width: number; height: number; } 
  }> {
    try {
      // In a real implementation, you would use a library like browser-image-compression
      // For now, just return the original file with its dimensions
      const dimensions = await this.getImageDimensions(file);
      
      return {
        file,
        dimensions
      };
    } catch (error) {
      throw new MediaUploadError(
        `Image compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        MediaUploadErrorType.COMPRESSION_FAILED
      );
    }
  }
  
  /**
   * Get image dimensions
   */
  private async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
        
        // Clean up
        URL.revokeObjectURL(img.src);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
        URL.revokeObjectURL(img.src);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
  
  /**
   * Generate a thumbnail for a file
   */
  private async generateThumbnail(file: File, isEncrypted: boolean = false): Promise<string> {
    try {
      // In a real implementation, you would generate a proper thumbnail
      // For simplicity, we're returning a placeholder
      return "https://via.placeholder.com/200x200";
    } catch (error) {
      console.warn('Failed to generate thumbnail:', error);
      return "";
    }
  }
  
  /**
   * Upload a media file with optional compression and encryption
   */
  public async uploadMedia(file: File, customOptions?: Partial<MediaUploadOptions>): Promise<MediaUploadResult> {
    const options = { ...this.options, ...customOptions };
    
    try {
      // Check file size
      if (file.size > (options.maxSizeMB || 10) * 1024 * 1024) {
        throw new MediaUploadError(
          `File too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum size is ${options.maxSizeMB}MB.`, 
          MediaUploadErrorType.FILE_TOO_LARGE
        );
      }
      
      // Determine media type
      const mediaType = this.getMediaType(file);
      
      // Check if media type is allowed
      if (options.allowedTypes && !options.allowedTypes.includes(mediaType)) {
        throw new MediaUploadError(
          `Unsupported media type: ${mediaType}`, 
          MediaUploadErrorType.UNSUPPORTED_TYPE
        );
      }
      
      // Process file based on type
      let processedFile = file;
      let dimensions: { width: number; height: number } | undefined;
      
      if (mediaType === MediaType.IMAGE && options.compressImages) {
        const result = await this.compressImage(file);
        processedFile = result.file;
        dimensions = result.dimensions;
      }
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop() || '';
      const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload the file to storage (with or without encryption)
      let url: string;
      let thumbnailUrl: string | undefined;
      let encrypted = false;
      let keyId: string | undefined;
      let encryptionDetails: { algorithm: string; ivBase64: string; keyVersion: number } | undefined;
      
      if (options.encryptMedia) {
        // Encrypt and upload the file
        const encryptionResult = await this.encryptFile(processedFile, options.securityLevel || SecurityLevel.E2EE);
        url = await this.uploadToStorage(encryptionResult.file);
        keyId = encryptionResult.keyId;
        encrypted = true;
      } else {
        // Upload without encryption
        url = await this.uploadToStorage(processedFile);
      }
      
      // Generate thumbnail if requested and is an image
      if (options.generateThumbnail && mediaType === MediaType.IMAGE) {
        thumbnailUrl = await this.generateThumbnail(processedFile, encrypted);
      }
      
      return {
        originalFile: file,
        url,
        thumbnailUrl,
        type: mediaType,
        size: processedFile.size,
        dimensions,
        encrypted,
        keyId,
        encryptionDetails
      };
    } catch (error) {
      if (error instanceof MediaUploadError) {
        throw error;
      } else {
        console.error('Media upload failed:', error);
        throw new MediaUploadError(
          `Media upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          MediaUploadErrorType.UPLOAD_FAILED
        );
      }
    }
  }
  
  /**
   * Read file as ArrayBuffer
   */
  private async readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('File read error'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
  
  /**
   * Encrypt and upload a file
   */
  private async encryptAndUpload(
    file: File,
    fileBuffer: ArrayBuffer,
    filename: string,
    options: MediaUploadOptions
  ): Promise<{
    url: string;
    thumbnailUrl?: string;
    encrypted: boolean;
    keyId: string;
    encryptionDetails: {
      algorithm: string;
      ivBase64: string;
      keyVersion: number;
    };
  }> {
    try {
      // Use custom key or generate a new one
      let key: CryptoKey;
      let keyVersion = 1;
      
      if (options.customEncryptionKey) {
        key = options.customEncryptionKey;
      } else {
        // Generate appropriate key strength based on security level
        const keyLength = options.securityLevel === SecurityLevel.P2P_E2EE ? 256 : 
                         options.securityLevel === SecurityLevel.E2EE ? 256 : 128;
        key = await generateAesKey(keyLength as 128 | 256, true);
      }
      
      // Export key as JWK for storage
      const keyJwk = await exportKeyToJwk(key);
      
      // Generate unique key ID
      const keyId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      // Encrypt the file
      const { encryptedData, iv } = await encryptAesGcm(fileBuffer, key);
      
      // Create encrypted file blob
      const encryptedBlob = new Blob([encryptedData], { type: 'application/octet-stream' });
      
      // Upload to storage
      const { data, error } = await supabase.storage
        .from('encrypted-media')
        .upload(`${keyId}/${filename}.enc`, encryptedBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/octet-stream'
        });
      
      if (error) {
        throw new Error(`File upload to storage failed: ${error.message}`);
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('encrypted-media')
        .getPublicUrl(`${keyId}/${filename}.enc`);
      
      // Store encryption key
      const { error: keyError } = await supabase
        .from('encryption_keys')
        .insert({
          key_id: keyId,
          key_type: 'FILE',
          key_jwk: JSON.stringify(keyJwk),
          created_at: new Date().toISOString(),
          metadata: {
            filename: file.name,
            fileType: file.type,
            fileSize: file.size,
            securityLevel: options.securityLevel
          }
        });
      
      if (keyError) {
        console.error('Failed to store encryption key:', keyError);
      }
      
      // Return the result
      return {
        url: urlData.publicUrl,
        encrypted: true,
        keyId,
        encryptionDetails: {
          algorithm: KeyType.AES_GCM,
          ivBase64: arrayBufferToBase64(iv),
          keyVersion
        }
      };
    } catch (error) {
      console.error('File encryption and upload failed:', error);
      throw new MediaUploadError(
        `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        MediaUploadErrorType.ENCRYPTION_FAILED
      );
    }
  }
  
  /**
   * Upload a file without encryption
   */
  private async uploadUnencrypted(
    file: File,
    filename: string
  ): Promise<{
    url: string;
    encrypted: boolean;
  }> {
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });
    
    if (error) {
      throw new Error(`File upload to storage failed: ${error.message}`);
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filename);
    
    return {
      url: urlData.publicUrl,
      encrypted: false
    };
  }
      const url = await this.uploadToStorage(encryptedFile);
      
      // Return result
      return {
        originalFile: file,
        url,
        thumbnailUrl,
        type: mediaType,
        size: encryptedFile.size,
        dimensions,
        encrypted: !!options.encryptMedia,
        keyId
      };
    } catch (error) {
      if (error instanceof MediaUploadError) {
        throw error;
      }
      
      // Re-throw with appropriate type
      throw new MediaUploadError(
        `Failed to upload media: ${error instanceof Error ? error.message : 'Unknown error'}`,
        MediaUploadErrorType.UPLOAD_FAILED
      );
    }
  }
  
  /**
   * Determine the media type from a file
   */
  private getMediaType(file: File): MediaType {
    const type = file.type.split('/')[0];
    
    switch(type) {
      case 'image':
        return MediaType.IMAGE;
      case 'video':
        return MediaType.VIDEO;
      case 'audio':
        return MediaType.AUDIO;
      default:
        return MediaType.DOCUMENT;
    }
  }
  
  /**
   * Compress an image with browser APIs
   */
  private async compressImage(file: File): Promise<{ file: File; dimensions: { width: number; height: number } }> {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        const url = URL.createObjectURL(file);
        
        img.onload = () => {
          URL.revokeObjectURL(url);
          
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new MediaUploadError('Failed to get canvas context', MediaUploadErrorType.COMPRESSION_FAILED));
            return;
          }
          
          // Calculate dimensions (max 1920px width/height)
          const MAX_SIZE = 1920;
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
          
          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to file
          canvas.toBlob(
            blob => {
              if (!blob) {
                reject(new MediaUploadError('Failed to compress image', MediaUploadErrorType.COMPRESSION_FAILED));
                return;
              }
              
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              
              resolve({
                file: compressedFile,
                dimensions: { width, height }
              });
            },
            file.type,
            0.8 // Quality
          );
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new MediaUploadError('Failed to load image', MediaUploadErrorType.COMPRESSION_FAILED));
        };
        
        img.src = url;
      } catch (error) {
        reject(new MediaUploadError(
          `Image compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          MediaUploadErrorType.COMPRESSION_FAILED
        ));
      }
    });
  }
  
  /**
   * Encrypt a file
   */
  private async encryptFile(file: File, securityLevel: SecurityLevel): Promise<{ file: File; keyId: string }> {
    try {
      const buffer = await file.arrayBuffer();
      const fileData = new Uint8Array(buffer);
      
      // Convert to base64 string for encryption
      const base64 = this.arrayBufferToBase64(fileData);
      
      // Encrypt the base64 string
      const encryptionResult = await this.encryptionService.encrypt(
        base64,
        securityLevel,
        EncryptionType.FILE
      );
      
      // Create a new file with encrypted data
      const encryptedFile = new File(
        [encryptionResult.encryptedData],
        `${file.name}.encrypted`,
        {
          type: 'application/octet-stream',
          lastModified: Date.now()
        }
      );
      
      return {
        file: encryptedFile,
        keyId: encryptionResult.keyId
      };
    } catch (error) {
      throw new MediaUploadError(
        `File encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        MediaUploadErrorType.ENCRYPTION_FAILED
      );
    }
  }
  
  /**
   * Generate a thumbnail for an image
   */
  private async generateThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        const url = URL.createObjectURL(file);
        
        img.onload = () => {
          URL.revokeObjectURL(url);
          
          // Create a canvas for the thumbnail
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // Thumbnail size
          const THUMBNAIL_SIZE = 200;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            height = Math.round((height * THUMBNAIL_SIZE) / width);
            width = THUMBNAIL_SIZE;
          } else {
            width = Math.round((width * THUMBNAIL_SIZE) / height);
            height = THUMBNAIL_SIZE;
          }
          
          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get data URL
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(thumbnailUrl);
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load image for thumbnail generation'));
        };
        
        img.src = url;
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Upload a file to storage
   * This is a placeholder that would integrate with Supabase
   */
  private async uploadToStorage(file: File): Promise<string> {
    // In a real implementation, this would upload to Supabase Storage
    // For now, we'll just return a fake URL
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`https://www.snakkaz.com/storage/uploads/${Date.now()}_${encodeURIComponent(file.name)}`);
      }, 500);
    });
  }
  
  /**
   * Convert ArrayBuffer to Base64 string
   */
  private arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return btoa(binary);
  }
}

// Export a default instance
export const mediaUploadService = new MediaUploadService();
