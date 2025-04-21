
import { importEncryptionKey } from "@/utils/encryption";
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
    messageIv: ivStr
  };
}
