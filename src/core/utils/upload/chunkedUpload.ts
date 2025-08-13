export interface ChunkUploadOptions {
  chunkSize?: number;
  onProgress?: (progress: number) => void;
  onChunkComplete?: (chunkIndex: number, totalChunks: number) => void;
}

export const uploadChunkedFile = async (
  file: File,
  uploadUrl: string,
  options: ChunkUploadOptions = {}
): Promise<{ success: boolean; url?: string; error?: string }> => {
  const { chunkSize = 1024 * 1024, onProgress, onChunkComplete } = options; // 1MB chunks
  
  try {
    // For now, just upload the whole file - chunked upload requires server support
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      onProgress?.(100);
      return { success: true, url: result.url };
    } else {
      return { success: false, error: 'Upload failed' };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
