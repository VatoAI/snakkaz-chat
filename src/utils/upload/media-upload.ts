import { supabase } from "@/integrations/supabase/client";

/**
 * Check if network connection is available
 * @returns Promise resolving to boolean indicating network connectivity
 */
export const checkNetworkConnection = async (): Promise<boolean> => {
  try {
    // Try to fetch a small resource from Supabase to test connection
    const { error } = await supabase.from('health_check').select('count').limit(1).maybeSingle();
    return !error;
  } catch (e) {
    return false;
  }
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
    if (!file) throw new Error("No file provided");
    if (file.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");

    // Check network connection first
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      throw new Error("Ingen nettverkstilkobling. Sjekk internettforbindelsen din og prøv igjen.");
    }

    // Create unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log("Starting upload:", { fileName, size: file.size, type: file.type });

    // Set up retry mechanism with exponential backoff
    const maxRetries = 3;
    let attempt = 0;
    let lastError = null;

    while (attempt < maxRetries) {
      try {
        attempt++;
        
        // Use custom XHR for better progress tracking
        if (onProgress) {
          const { data, error } = await uploadWithProgress(file, filePath, onProgress);
          if (error) throw error;
          
          // Get public URL - with domain-aware path generation
          const { data: { publicUrl } } = supabase.storage
            .from('chat-media')
            .getPublicUrl(filePath);

          // For production domain, we customize the URL (optional)
          const customDomainUrl = process.env.NODE_ENV === 'production' 
            ? `https://media.snakkaz.com/chat-media/${filePath}`
            : publicUrl;

          return {
            path: filePath,
            publicUrl: customDomainUrl
          };
        } else {
          // Standard upload without progress tracking
          const { data, error } = await supabase.storage
            .from('chat-media')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage
            .from('chat-media')
            .getPublicUrl(filePath);

          const customDomainUrl = process.env.NODE_ENV === 'production' 
            ? `https://media.snakkaz.com/chat-media/${filePath}`
            : publicUrl;

          return {
            path: filePath,
            publicUrl: customDomainUrl
          };
        }
      } catch (error) {
        lastError = error;
        console.error(`Upload attempt ${attempt}/${maxRetries} failed:`, error);
        
        // If not on the last attempt, wait before retrying
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s...
          console.log(`Retrying in ${delay/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // If we've exhausted all retries, throw the last error
    throw lastError || new Error("Upload failed after multiple attempts");
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
    // Get pre-signed URL for direct upload
    supabase.storage.from('chat-media').createSignedUploadUrl(filePath)
      .then(({ data, error }) => {
        if (error) {
          return reject(error);
        }

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', data.signedUrl);

        // Set up progress tracking
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve({ data: { path: filePath }, error: null });
          } else {
            reject(new Error(`Server responded with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error during upload'));
        };

        xhr.send(file);
      })
      .catch(reject);
  });
};
