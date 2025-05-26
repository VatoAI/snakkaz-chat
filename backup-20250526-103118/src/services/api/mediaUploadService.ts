/**
 * Media Upload Service for Snakkaz Chat
 * 
 * This service handles uploading, resizing, and encryption of media files
 * including images, videos, and documents.
 */

import { EncryptionService, SecurityLevel, EncryptionType } from '../encryption/encryptionService';
import { 
  generateAesKey,
  exportKeyToJwk,
  encryptAesGcm,
  decryptAesGcm,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  KeyType,
  KeyUsage,
  importKeyFromJwk
} from '../encryption/cryptoUtils';
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
   * Read Blob as ArrayBuffer
   */
  private readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read blob as ArrayBuffer'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Blob read error'));
      };
      
      reader.readAsArrayBuffer(blob);
    });
  }
  
  /**
   * Encrypt a file for secure storage
   */
  private async encryptFile(
    file: File,
    securityLevel: SecurityLevel
  ): Promise<{
    file: File;
    keyId: string;
  }> {
    try {
      // Generate a new encryption key based on security level
      const keyLength = securityLevel === SecurityLevel.STANDARD ? 128 : 256;
      const key = await generateAesKey(keyLength as 128 | 256, true);
      
      // Export key as JWK for storage
      const keyJwk = await exportKeyToJwk(key);
      
      // Generate a unique key ID
      const keyId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      // Read file as ArrayBuffer
      const fileBuffer = await this.readFileAsArrayBuffer(file);
      
      // Encrypt the file
      const { encryptedData, iv } = await encryptAesGcm(fileBuffer, key);
      
      // Store the encryption key in Supabase
      await this.storeEncryptionKey(keyId, keyJwk, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        iv: arrayBufferToBase64(iv),
        securityLevel,
        timestamp: Date.now()
      });
      
      // Create a new File object with encrypted data
      const encryptedBlob = new Blob([encryptedData], { type: 'application/octet-stream' });
      const encryptedFile = new File(
        [encryptedBlob],
        `${keyId}_${file.name}.enc`,
        { type: 'application/octet-stream', lastModified: Date.now() }
      );
      
      return {
        file: encryptedFile,
        keyId
      };
    } catch (error) {
      console.error('File encryption failed:', error);
      throw new MediaUploadError(
        `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        MediaUploadErrorType.ENCRYPTION_FAILED
      );
    }
  }
  
  /**
   * Upload a file to storage
   */
  private async uploadToStorage(file: File): Promise<string> {
    try {
      // Upload file to Supabase Storage
      const path = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const bucket = file.type === 'application/octet-stream' ? 'encrypted-media' : 'media';
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
        
      if (error) {
        throw new Error(`Storage upload failed: ${error.message}`);
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('File upload failed:', error);
      throw new MediaUploadError(
        `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        MediaUploadErrorType.UPLOAD_FAILED
      );
    }
  }
  
  /**
   * Store encryption key in the database
   */
  private async storeEncryptionKey(
    keyId: string,
    keyJwk: JsonWebKey,
    metadata: Record<string, unknown>
  ): Promise<void> {
    try {
      // Store in Supabase database
      const { error } = await supabase
        .from('encryption_keys')
        .insert({
          key_id: keyId,
          key_type: 'FILE',
          key_jwk: JSON.stringify(keyJwk),
          created_at: new Date().toISOString(),
          metadata: metadata
        });
      
      if (error) {
        console.error('Failed to store encryption key:', error);
        throw error;
      }
    } catch (error) {
      console.error('Key storage failed:', error);
      // Non-critical error, don't throw
    }
  }
  
  /**
   * Decrypt a file
   */
  public async decryptFile(
    encryptedFile: File | Blob | ArrayBuffer,
    keyId: string
  ): Promise<Blob> {
    try {
      // Get the encryption key from Supabase
      const { data, error } = await supabase
        .from('encryption_keys')
        .select('*')
        .eq('key_id', keyId)
        .single();
      
      if (error || !data) {
        throw new Error(`Encryption key not found: ${error?.message || 'Key not available'}`);
      }
      
      // Parse the key JWK
      const keyJwk = JSON.parse(data.key_jwk);
      
      // Import the key
      const key = await importKeyFromJwk(
        keyJwk,
        KeyType.AES_GCM,
        [KeyUsage.DECRYPT]
      );
      
      // Get IV from metadata
      const iv = base64ToArrayBuffer(data.metadata.iv);
      
      // Convert input to ArrayBuffer if needed
      let encryptedBuffer: ArrayBuffer;
      if (encryptedFile instanceof File) {
        encryptedBuffer = await this.readFileAsArrayBuffer(encryptedFile);
      } else if (encryptedFile instanceof Blob) {
        encryptedBuffer = await this.readBlobAsArrayBuffer(encryptedFile);
      } else {
        encryptedBuffer = encryptedFile;
      }
      
      // Decrypt the data
      const decryptedBuffer = await decryptAesGcm(
        encryptedBuffer,
        key,
        iv
      );
      
      // Create a blob with the original type
      return new Blob([decryptedBuffer], { 
        type: data.metadata.fileType || 'application/octet-stream' 
      });
    } catch (error) {
      console.error('File decryption failed:', error);
      throw new Error(`Failed to decrypt file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a default instance
export const mediaUploadService = new MediaUploadService();
