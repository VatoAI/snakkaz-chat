
export const createBlobUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

export const revokeBlobUrl = (url: string | null): void => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isImageFile = (mediaType: string | undefined): boolean => {
  return !!mediaType?.startsWith('image/');
};

export const isVideoFile = (mediaType: string | undefined): boolean => {
  return !!mediaType?.startsWith('video/');
};

export const isAudioFile = (mediaType: string | undefined): boolean => {
  return !!mediaType?.startsWith('audio/');
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};
