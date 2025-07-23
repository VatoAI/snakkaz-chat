/**
 * Secure PIN handling with Argon2 hashing
 * 
 * Dette er en betydelig forbedring fra den enklere hashingen som ble brukt tidligere.
 * Argon2 er vinner av Password Hashing Competition og anbefales for høysikkerhetsmiljøer.
 */

import * as argon2 from 'argon2-browser';
import { arrayBufferToBase64 } from '../encryption/data-conversion';

// Konstanter for Argon2-hashing for optimal sikkerhet
const ARGON2_TIME_COST = 3; // Antall iterasjoner (høyere tall = sikrere, men tregere)
const ARGON2_MEMORY_COST = 65536; // Minnebruk i KiB (64 MB)
const ARGON2_PARALLELISM = 2; // Antall tråder som brukes for hashing
const ARGON2_HASH_LENGTH = 32; // Output lengde i bytes
const ARGON2_TYPE = argon2.ArgonType.Argon2id; // Variant (Argon2i, Argon2d, eller Argon2id)

/**
 * Genererer en tilfeldig salt som brukes i hasheringsprosessen
 */
export async function generateSalt(): Promise<string> {
  const saltArray = new Uint8Array(16);
  window.crypto.getRandomValues(saltArray);
  return arrayBufferToBase64(saltArray);
}

/**
 * Sikker hash av PIN med Argon2
 * @param pin PIN-koden som skal hashes
 * @param salt Salt for å motvirke rainbow table-angrep
 */
export async function hashPin(pin: string, salt: string): Promise<string> {
  try {
    // Konverter PIN og salt til Uint8Array
    const encoder = new TextEncoder();
    const pinData = encoder.encode(pin);
    
    // Utfør Argon2-hashing
    const result = await argon2.hash({
      pass: pinData, // PIN-kode
      salt: salt, // Unikt salt
      time: ARGON2_TIME_COST,
      mem: ARGON2_MEMORY_COST,
      parallelism: ARGON2_PARALLELISM, 
      hashLen: ARGON2_HASH_LENGTH,
      type: ARGON2_TYPE
    });
    
    // Returner hashingen som Base64-string
    return result.encoded;
  } catch (error) {
    console.error('Feil ved hashing av PIN:', error);
    throw new Error('Kunne ikke hashe PIN sikkert');
  }
}

/**
 * Verifiserer en PIN mot en lagret hash
 * @param pin PIN-koden som oppgis
 * @param hash Tidligere generert hash som skal sjekkes mot
 */
export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  try {
    // Konverter PIN til Uint8Array
    const encoder = new TextEncoder();
    const pinData = encoder.encode(pin);
    
    // Verifiser PIN med Argon2
    const result = await argon2.verify({
      pass: pinData,
      encoded: hash
    });
    
    return result.verified;
  } catch (error) {
    console.error('Feil ved verifisering av PIN:', error);
    return false;
  }
}

/**
 * Lager en sikkerhetsnøkkel fra PIN-koden som kan brukes til kryptering
 * @param pin PIN-koden som skal brukes
 * @param salt Salt for å motvirke rainbow table-angrep
 */
export async function deriveKeyFromPin(pin: string, salt: string): Promise<CryptoKey> {
  try {
    // Konverter PIN til Uint8Array
    const encoder = new TextEncoder();
    const pinData = encoder.encode(pin);
    
    // Bruk Argon2 til å generere et nøkkelmateriale
    const result = await argon2.hash({
      pass: pinData,
      salt: salt,
      time: ARGON2_TIME_COST,
      mem: ARGON2_MEMORY_COST,
      parallelism: ARGON2_PARALLELISM,
      hashLen: 32, // 256 bits
      type: ARGON2_TYPE
    });
    
    // Importer nøkkelmaterialet for bruk i Web Crypto API
    return await window.crypto.subtle.importKey(
      "raw",
      result.hash,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  } catch (error) {
    console.error('Feil ved derivering av nøkkel fra PIN:', error);
    throw new Error('Kunne ikke generere krypteringsnøkkel fra PIN');
  }
}