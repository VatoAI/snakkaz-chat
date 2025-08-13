export const extractMediaMetadata = async (file: File) => {
  const metadata: Record<string, any> = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    lastModified: file.lastModified
  };

  // Extract image dimensions if it's an image
  if (file.type.startsWith('image/')) {
    try {
      const dimensions = await getImageDimensions(file);
      metadata.dimensions = dimensions;
    } catch (error) {
      console.error('Failed to extract image dimensions:', error);
    }
  }

  return metadata;
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Decrypts and extracts metadata from encrypted media
 * @param encryptedUrl URL of the encrypted media
 * @param encryptionKey Key used to decrypt the metadata
 * @returns Decrypted metadata object
 */
export const decryptMediaMetadata = async (encryptedUrl: string, encryptionKey: string): Promise<Record<string, any>> => {
  try {
    // Try to extract metadata from the URL or filename
    const fileExtension = encryptedUrl.split('.').pop()?.toLowerCase() || '';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
    const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension);
    const isAudio = ['mp3', 'wav', 'ogg', 'aac'].includes(fileExtension);
    
    // Basic metadata we can derive without actual decryption
    const metadata: Record<string, any> = {
      fileExtension,
      isImage,
      isVideo,
      isAudio,
      encryptedUrl,
      // Extract filename from URL
      filename: encryptedUrl.split('/').pop() || 'encrypted-file'
    };
    
    // Additional metadata could be extracted after fetching the file
    // but for now we'll return what we have
    return metadata;
  } catch (error) {
    console.error('Failed to decrypt media metadata:', error);
    return {
      error: 'Failed to decrypt metadata',
      encryptedUrl
    };
  }
};
