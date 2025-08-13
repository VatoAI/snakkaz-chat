// This file contains the global encryption keys for the public chat room

/**
 * Sikker global krypteringsnøkkelhåndtering
 * 
 * Denne tilnærmingen er mye sikrere enn hardkodede nøkler fordi:
 * 1. Nøkler hentes fra miljøvariabler hvis tilgjengelig (settes i prod-miljø)
 * 2. Nøkler genereres dynamisk for utvikling
 * 3. Genererte nøkler lagres i localStorage for konsistens mellom øktene
 * 4. En ny IV genereres for hver kryptering for å øke sikkerheten
 */

// Importerer nødvendige funksjoner
import { generateEncryptionKey } from './key-management';

// Lokalstorage-nøkkel for å lagre krypteringsnøkkelen for utvikling
const DEV_KEY_STORAGE = 'snakkaz_dev_encryption_key';

/**
 * Henter eller genererer en global krypteringsnøkkel
 * I produksjonsmiljø brukes miljøvariabel
 * I utviklingsmiljø genereres en nøkkel som lagres i localStorage
 */
export const getGlobalE2EEKey = async (): Promise<string> => {
    // Sjekk først om vi har en produksjonsnøkkel i miljøvariabler
    const envKey = import.meta.env.VITE_GLOBAL_E2EE_KEY;
    if (envKey) {
        return envKey;
    }

    // For utvikling, bruk en lagret nøkkel eller generer en ny
    let devKey = localStorage.getItem(DEV_KEY_STORAGE);
    if (!devKey) {
        // Generer en sikker krypteringsnøkkel
        devKey = await generateEncryptionKey();
        localStorage.setItem(DEV_KEY_STORAGE, devKey);
    }

    return devKey;
};

/**
 * Genererer en sikker, tilfeldig initialiseringsvektor for hver kryptering
 * Dette er sikrere enn å bruke samme IV hver gang
 */
export const generateSecureIV = (): Uint8Array => {
    return window.crypto.getRandomValues(new Uint8Array(12));
};

// Eksporterer funksjon for å konvertere ArrayBuffer til Base64-string for lagring
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return window.btoa(binary);
};

// Eksporterer funksjon for å konvertere Base64-string til ArrayBuffer for bruk
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};
