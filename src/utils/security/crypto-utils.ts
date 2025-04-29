/**
 * Generelle krypteringshjelpefunksjoner
 * 
 * Tilbyr grunnleggende verktøy for kryptografiske operasjoner
 * som brukes av app-encryption og andre sikkerhetsmoduler.
 */

/**
 * Genererer kryptografisk sikre tilfeldige bytes
 * 
 * @param length Antall bytes som skal genereres
 * @returns En array med tilfeldige bytes
 */
export function getRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Konverterer ArrayBuffer til Base64-streng
 * 
 * @param buffer ArrayBuffer som skal konverteres
 * @returns Base64-kodet streng
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(buffer)]));
}

/**
 * Konverterer Base64-streng til ArrayBuffer
 * 
 * @param base64 Base64-kodet streng
 * @returns ArrayBuffer med dekodede data
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}