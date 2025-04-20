
interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  size: number;
  originalName?: string;
  expires?: number;
  isEncrypted: boolean;
}

export const extractImageMetadata = async (file: File): Promise<MediaMetadata> => {
  const metadata: MediaMetadata = {
    size: file.size,
    originalName: file.name,
    isEncrypted: true
  };

  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = () => {
      metadata.width = img.width;
      metadata.height = img.height;
      resolve(null);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

  URL.revokeObjectURL(img.src);
  return metadata;
};

export const extractVideoMetadata = async (file: File): Promise<MediaMetadata> => {
  const metadata: MediaMetadata = {
    size: file.size,
    originalName: file.name,
    isEncrypted: true
  };

  const video = document.createElement('video');
  await new Promise((resolve, reject) => {
    video.onloadedmetadata = () => {
      metadata.width = video.videoWidth;
      metadata.height = video.videoHeight;
      metadata.duration = video.duration;
      resolve(null);
    };
    video.onerror = reject;
    video.src = URL.createObjectURL(file);
  });

  URL.revokeObjectURL(video.src);
  return metadata;
};

export const extractAudioMetadata = async (file: File): Promise<MediaMetadata> => {
  const metadata: MediaMetadata = {
    size: file.size,
    originalName: file.name,
    isEncrypted: true
  };

  const audio = new Audio();
  await new Promise((resolve, reject) => {
    audio.onloadedmetadata = () => {
      metadata.duration = audio.duration;
      resolve(null);
    };
    audio.onerror = reject;
    audio.src = URL.createObjectURL(file);
  });

  URL.revokeObjectURL(audio.src);
  return metadata;
};

export const extractMediaMetadata = async (file: File): Promise<MediaMetadata> => {
  if (file.type.startsWith('image/')) {
    return extractImageMetadata(file);
  } else if (file.type.startsWith('video/')) {
    return extractVideoMetadata(file);
  } else if (file.type.startsWith('audio/')) {
    return extractAudioMetadata(file);
  }
  
  return {
    size: file.size,
    originalName: file.name,
    isEncrypted: true
  };
};
