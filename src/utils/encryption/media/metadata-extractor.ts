
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
