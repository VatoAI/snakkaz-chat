import { supabase } from "@/integrations/supabase/client";

/**
 * Check if network connection is available
 * @returns Promise resolving to boolean indicating network connectivity
 */
export const checkNetworkConnection = async (): Promise<boolean> => {
  try {
    // Try multiple ways to verify connectivity
    
    // First check the browser's navigator.onLine
    if (!navigator.onLine) {
      return false;
    }
    
    // Try to fetch a small resource from Supabase to test connection
    const { error } = await supabase.from('health_check').select('count').limit(1).maybeSingle();
    
    // Try a standard ping if that fails
    if (error) {
      // Try a more reliable backup method
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch('https://api.supabase.com/ping', {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-cache'
        });
        clearTimeout(timeoutId);
        return response.ok;
      } catch (e) {
        return false;
      }
    }
    
    return true;
  } catch (e) {
    return navigator.onLine; // Fallback to navigator.onLine as last resort
  }
};

/**
 * Ensure the storage bucket exists
 */
export const ensureStorageBucket = async (): Promise<boolean> => {
  try {
    // Check if bucket exists
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
      fileSizeLimit: 20971520, // 20MB
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
};

/**
 * Check if file type is allowed
 */
export const isAllowedFileType = (file: File): boolean => {
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
                            'mp3', 'wav', 'ogg', 
                            'pdf', 'bin'];
                            
  return allowedExtensions.includes(fileExtension || '');
};

/**
 * Upload media file with progress tracking, retry logic and better error handling
 */
export const uploadMedia = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ path: string; publicUrl: string }> => {
  try {
    // Validate file
    if (!file) throw new Error("Ingen fil angitt");
    
    // Check file type
    if (!isAllowedFileType(file)) {
      throw new Error("Filtypen støttes ikke. Støttede formater inkluderer bilder, video, lyd og PDF");
    }
    
    // Check file size (15MB max)
    if (file.size > 15 * 1024 * 1024) {
      throw new Error("Filen er for stor (maksimalt 15MB)");
    }
    
    // Check network connection first
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      throw new Error("Ingen nettverkstilkobling. Sjekk internettforbindelsen din og prøv igjen.");
    }
    
    // Ensure bucket exists
    const bucketExists = await ensureStorageBucket();
    if (!bucketExists) {
      throw new Error("Kunne ikke opprette eller få tilgang til lagringsområdet. Prøv igjen senere.");
    }

    // Create unique file path with sanitized filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
      .substring(0, 50); // Limit filename length
    
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filePath = `${timestamp}_${randomStr}_${sanitizedName}`;

    console.log("Starting upload:", { fileName: sanitizedName, size: file.size, type: file.type });

    // Set up retry mechanism with exponential backoff
    const maxRetries = 3;
    let attempt = 0;
    let lastError = null;

    while (attempt < maxRetries) {
      try {
        attempt++;
        
        // Signal initial progress
        onProgress?.(1);
        
        // Use direct upload with progress tracking if callback provided
        if (onProgress) {
          const result = await uploadWithProgress(file, filePath, onProgress);
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('chat-media')
            .getPublicUrl(filePath);

          return {
            path: filePath,
            publicUrl
          };
        } else {
          // Standard upload without progress tracking
          const { data, error } = await supabase.storage
            .from('chat-media')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true
            });

          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage
            .from('chat-media')
            .getPublicUrl(filePath);

          return {
            path: filePath,
            publicUrl
          };
        }
      } catch (error) {
        lastError = error;
        console.error(`Upload attempt ${attempt}/${maxRetries} failed:`, error);
        
        // If not on the last attempt, wait before retrying
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s...
          console.log(`Retrying in ${delay/1000}s...`);
          
          // Signal recovery attempt to user
          onProgress?.(0);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Signal retry in progress
          onProgress?.(1);
        }
      }
    }

    // If we've exhausted all retries, throw the last error
    throw lastError || new Error("Opplasting mislyktes etter flere forsøk. Sjekk din nettverkstilkobling.");
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

/**
 * Helper function to upload file with XHR to enable progress tracking
 */
const uploadWithProgress = async (
  file: File, 
  filePath: string, 
  onProgress: (progress: number) => void
): Promise<{ data: any; error: any }> => {
  return new Promise((resolve, reject) => {
    // Try with createSignedUploadUrl first (better for large files)
    supabase.storage.from('chat-media').createSignedUploadUrl(filePath)
      .then(({ data, error }) => {
        if (error) {
          console.warn("Failed to get signed URL, falling back to direct upload", error);
          // Fall back to direct upload
          fallbackUpload();
          return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', data.signedUrl);
        
        // Add appropriate content type
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

        // Set up progress tracking
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.min(99, (event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            onProgress(100);
            resolve({ data: { path: filePath }, error: null });
          } else {
            reject(new Error(`Server svarte med status ${xhr.status}: ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Nettverksfeil under opplastingen'));
        };
        
        xhr.ontimeout = () => {
          reject(new Error('Tidsavbrudd under opplasting'));
        };
        
        // Set timeout to 60 seconds
        xhr.timeout = 60000;

        xhr.send(file);
      })
      .catch(error => {
        console.warn("Error in signed URL upload, falling back to direct upload:", error);
        fallbackUpload();
      });
    
    // Fallback upload method using standard Supabase upload
    function fallbackUpload() {
      let uploadPromise = supabase.storage
        .from('chat-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      // Simulate progress since we don't have real progress in fallback mode
      let fakeProgress = 0;
      const progressInterval = setInterval(() => {
        fakeProgress += Math.random() * 5;
        if (fakeProgress > 95) {
          clearInterval(progressInterval);
          fakeProgress = 95;
        }
        onProgress(fakeProgress);
      }, 500);
      
      uploadPromise
        .then(({ data, error }) => {
          clearInterval(progressInterval);
          if (error) {
            onProgress(0);
            reject(error);
          } else {
            onProgress(100);
            resolve({ data, error: null });
          }
        })
        .catch(error => {
          clearInterval(progressInterval);
          onProgress(0);
          reject(error);
        });
    }
  });
};
