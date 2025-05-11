/**
 * Secure Credentials Storage
 * 
 * Dette modulet tilbyr sikker lagring av API-nøkler og andre sensitive opplysninger
 * ved hjelp av lokal kryptering. Nøklene lagres aldri i klartekst og er beskyttet
 * med et passord.
 */

import { encrypt, decrypt } from './simpleEncryption';

// Storage nøkler med ikke-gjettbare navn for å unngå målrettet angrep
const CREDENTIALS_STORAGE_KEY = 'snkkz_scr_crd_stor';
const AUTH_VERIFIED_KEY = 'snkkz_auth_ver';

// Salt brukt i kryptering (ikke sensitiv verdi, men gjør kryptering sterkere)
const CREDENTIAL_SALT = 'snakkaz-cloudflare-integration-2025';

/**
 * Krypter og lagre sensitive opplysninger
 * @param key Nøkkel for lagring
 * @param value Verdi som skal krypteres
 * @param password Passord for kryptering
 */
export async function secureStore(key: string, value: string, password: string): Promise<boolean> {
  try {
    if (!key || !value || !password) {
      console.error('Missing required parameters for secure storage');
      return false;
    }
    
    // Hent eksisterende kredentialsamling eller opprett en ny
    const storedData = localStorage.getItem(CREDENTIALS_STORAGE_KEY) || '{}';
    let credentials: Record<string, string>;
    
    try {
      credentials = JSON.parse(storedData);
    } catch (e) {
      credentials = {};
    }
    
    // Kryptér verdien med passord
    const encrypted = await encrypt(value, password, CREDENTIAL_SALT);
    
    // Lagre i kredentialsamlingen
    credentials[key] = encrypted;
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
    
    console.log(`Credential stored securely: ${key}`);
    return true;
  } catch (error) {
    console.error('Error storing credential securely:', error);
    return false;
  }
}

/**
 * Hent og dekryptér en sensitiv opplysning
 * @param key Nøkkel for lagring
 * @param password Passord for dekryptering
 */
export async function secureRetrieve(key: string, password: string): Promise<string | null> {
  try {
    if (!key || !password) {
      console.error('Missing required parameters for secure retrieval');
      return null;
    }
    
    // Hent kredentialsamlingen
    const storedData = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (!storedData) {
      console.log('No secure credentials found');
      return null;
    }
    
    let credentials: Record<string, string>;
    try {
      credentials = JSON.parse(storedData);
    } catch (e) {
      console.error('Invalid credentials storage format');
      return null;
    }
    
    // Hent den krypterte verdien
    const encrypted = credentials[key];
    if (!encrypted) {
      console.log(`No secure credential found for key: ${key}`);
      return null;
    }
    
    // Dekryptér med passord
    const decrypted = await decrypt(encrypted, password, CREDENTIAL_SALT);
    return decrypted;
  } catch (error) {
    console.error('Error retrieving credential securely:', error);
    return null;
  }
}

/**
 * Sjekk om en bestemt nøkkel er lagret
 * @param key Nøkkel for sjekking
 */
export function hasSecureCredential(key: string): boolean {
  try {
    const storedData = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (!storedData) return false;
    
    const credentials = JSON.parse(storedData);
    return !!credentials[key];
  } catch (e) {
    return false;
  }
}

/**
 * Fjern en sikker lagret nøkkel
 * @param key Nøkkel som skal fjernes
 */
export function removeSecureCredential(key: string): boolean {
  try {
    const storedData = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (!storedData) return false;
    
    let credentials = JSON.parse(storedData);
    if (!credentials[key]) return false;
    
    delete credentials[key];
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Fjern alle sikre lagrede opplysninger
 */
export function clearAllSecureCredentials(): void {
  localStorage.removeItem(CREDENTIALS_STORAGE_KEY);
  localStorage.removeItem(AUTH_VERIFIED_KEY);
  console.log('All secure credentials cleared');
}

/**
 * Sett opp sikker tilgang for brukeren
 * @param password Passord for tilgang
 */
export async function setupSecureAccess(password: string): Promise<boolean> {
  try {
    // Lagre en testverdi for å verifisere passord senere
    const testValue = 'snakkaz-secure-access-verified';
    return await secureStore('_verify_access', testValue, password);
  } catch (e) {
    return false;
  }
}

/**
 * Verifiser passord for sikker tilgang
 * @param password Passord for tilgang
 */
export async function verifySecureAccess(password: string): Promise<boolean> {
  try {
    const testValue = await secureRetrieve('_verify_access', password);
    const isValid = testValue === 'snakkaz-secure-access-verified';
    
    if (isValid) {
      // Lagre en midlertidig verifisering i sessionStorage
      sessionStorage.setItem(AUTH_VERIFIED_KEY, Date.now().toString());
    }
    
    return isValid;
  } catch (e) {
    return false;
  }
}

/**
 * Sjekk om sikker tilgang er etablert i denne sesjonen
 */
export function isSecureAccessVerified(): boolean {
  return !!sessionStorage.getItem(AUTH_VERIFIED_KEY);
}

/**
 * Avslutt sikker tilgang for denne sesjonen
 */
export function endSecureAccess(): void {
  sessionStorage.removeItem(AUTH_VERIFIED_KEY);
}

/**
 * Nøkkelkonstanter for ulike typer opplysninger
 */
export const SECURE_KEYS = {
  CLOUDFLARE_API_KEY: 'cf_global_api_key',
  CLOUDFLARE_API_EMAIL: 'cf_api_email',
  CLOUDFLARE_API_TOKEN: 'cf_api_token',
};
