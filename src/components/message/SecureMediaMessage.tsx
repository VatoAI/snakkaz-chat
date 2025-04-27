// Update to use the correct property names from the MediaDecryptionResult interface
import { useMediaDecryption } from "./media/useMediaDecryption";
import { useEffect, useState } from "react";

interface SecureMediaMessageProps {
  mediaUrl: string | null;
  encryptionKey: string | null;
  iv: string | null;
  mimeType: string;
  onMediaExpired: () => void;
}

export const SecureMediaMessage = ({
  mediaUrl,
  encryptionKey,
  iv,
  mimeType,
  onMediaExpired,
}: SecureMediaMessageProps) => {
  const [hasExpired, setHasExpired] = useState(false);

  // Use the useMediaDecryption hook to handle decryption
  const { decryptedURL, isLoading, error } = useMediaDecryption(
    mediaUrl,
    encryptionKey,
    iv,
    mimeType
  );

  useEffect(() => {
    if (hasExpired) {
      onMediaExpired();
    }
  }, [hasExpired, onMediaExpired]);

  // Revoke the object URL when the component unmounts or the URL changes
  useEffect(() => {
    return () => {
      if (decryptedURL) {
        URL.revokeObjectURL(decryptedURL);
      }
    };
  }, [decryptedURL]);

  if (hasExpired) {
    return <p>Media has expired.</p>;
  }

  if (isLoading) {
    return <p>Decrypting media...</p>;
  }

  if (error) {
    console.error("Decryption error:", error);
    return <p>Error decrypting media.</p>;
  }

  if (!decryptedURL) {
    return <p>No media available.</p>;
  }

  // Determine if the media is an image or video based on the mimeType
  const isImage = mimeType.startsWith("image/");
  const isVideo = mimeType.startsWith("video/");

  return (
    <>
      {isImage && (
        <img
          src={decryptedURL}
          alt="Secure Media"
          style={{ maxWidth: "100%", maxHeight: "300px" }}
        />
      )}
      {isVideo && (
        <video
          src={decryptedURL}
          controls
          style={{ maxWidth: "100%", maxHeight: "300px" }}
        />
      )}
      {!isImage && !isVideo && <p>Unsupported media type.</p>}
    </>
  );
};
