import { importEncryptionKey } from "@/utils/encryption";

/**
 * Encrypt a message using a global encryption key and initialization vector
 * @param keyString The encryption key as a string
 * @param ivStr The initialization vector as a string
 * @param message The message to encrypt
 * @returns The encrypted content, key and IV
 */
export const globalEncryptMessage = async (keyString: string, ivStr: string, message: string) => {
  const importedKey = await importEncryptionKey(keyString);
  const ivArr = new Uint8Array(atob(ivStr).split("").map(c => c.charCodeAt(0)));
  
  const enc = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: ivArr
    },
    importedKey,
    new TextEncoder().encode(message)
  );
  
  return {
    encryptedContent: btoa(String.fromCharCode(...new Uint8Array(enc))),
    key: keyString,
    iv: ivStr
  };
};
