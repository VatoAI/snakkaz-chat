
/**
 * Utility functions for data conversion in encryption contexts
 */

// Convert string to ArrayBuffer
export function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Convert ArrayBuffer to string
export function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}

// Convert ArrayBuffer to base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(ab2str(buffer));
}

// Convert base64 to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convert hex string to ArrayBuffer
export function hexToArrayBuffer(hexString: string): ArrayBuffer {
  // Remove any non-hex characters (like spaces)
  const cleanHexString = hexString.replace(/[^0-9A-Fa-f]/g, '');
  
  // Ensure we have an even number of characters
  const paddedHexString = cleanHexString.length % 2 ? '0' + cleanHexString : cleanHexString;
  
  const bytes = new Uint8Array(paddedHexString.length / 2);
  
  for (let i = 0; i < bytes.length; i++) {
    const byteHex = paddedHexString.substring(i * 2, i * 2 + 2);
    bytes[i] = parseInt(byteHex, 16);
  }
  
  return bytes.buffer;
}

// Convert ArrayBuffer to hex string
export function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

