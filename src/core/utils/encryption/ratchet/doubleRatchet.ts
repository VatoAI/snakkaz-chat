/**
 * Double Ratchet Algorithm implementasjon
 * 
 * Basert på Signal Protocol for å oppnå Perfect Forward Secrecy (PFS)
 * Denne implementasjonen roterer nøkler automatisk etter hver melding, noe som 
 * betyr at selv om en nøkkel blir kompromittert, er tidligere meldinger fortsatt sikre.
 */

import { generateKeyPair, arrayBufferToBase64, base64ToArrayBuffer } from '../key-management';
import { supabase } from '@/integrations/supabase/client';

// Grensesnitt for å lagre ratchet-tilstand
interface RatchetState {
  conversationId: string;
  rootKey: string;
  sendingKey: string;
  receivingKey: string;
  sendingChainKey: string;
  receivingChainKey: string;
  sendingCounter: number;
  receivingCounter: number;
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
  theirPublicKey?: JsonWebKey;
  lastUpdated: number;
}

// Grensesnitt for krypterte meldingsnøkler
export interface MessageKeys {
  encryptionKey: string;
  authenticationKey: string;
  iv: string;
}

/**
 * Initialiserer en ny ratchet for en samtale
 */
export async function initializeRatchet(
  conversationId: string,
  ourPublicKey: JsonWebKey,
  ourPrivateKey: JsonWebKey,
  theirPublicKey?: JsonWebKey
): Promise<RatchetState> {
  // Generer en tilfeldig rot-nøkkel
  const rootKey = await generateRandomKey();
  
  // Initialiser sending og mottaksnøkler
  const sendingKey = await generateRandomKey();
  const receivingKey = await generateRandomKey();
  
  // Initialiser chain keys
  const sendingChainKey = await generateRandomKey();
  const receivingChainKey = await generateRandomKey();
  
  const ratchetState: RatchetState = {
    conversationId,
    rootKey,
    sendingKey,
    receivingKey,
    sendingChainKey,
    receivingChainKey,
    sendingCounter: 0,
    receivingCounter: 0,
    publicKey: ourPublicKey,
    privateKey: ourPrivateKey,
    theirPublicKey,
    lastUpdated: Date.now()
  };
  
  // Lagre den initielle ratchet-tilstand
  await saveRatchetState(ratchetState);
  
  return ratchetState;
}

/**
 * Roterer sendingsnøkler før sending av en melding
 */
export async function rotateSendingKeys(
  conversationId: string
): Promise<MessageKeys> {
  // Hent gjeldende ratchet-tilstand
  const ratchetState = await getRatchetState(conversationId);
  if (!ratchetState) {
    throw new Error(`Ingen ratchet funnet for samtale ${conversationId}`);
  }
  
  // Utled nye nøkler basert på gjeldende tilstand
  const messageKeys = await deriveMessageKeys(ratchetState.sendingChainKey, ratchetState.sendingCounter);
  
  // Oppdater chain key
  const newSendingChainKey = await deriveNextChainKey(ratchetState.sendingChainKey);
  
  // Oppdater tilstand
  const updatedState: RatchetState = {
    ...ratchetState,
    sendingChainKey: newSendingChainKey,
    sendingCounter: ratchetState.sendingCounter + 1,
    lastUpdated: Date.now()
  };
  
  // Lagre oppdatert tilstand
  await saveRatchetState(updatedState);
  
  return messageKeys;
}

/**
 * Roterer mottaksnøkler ved mottak av en melding
 */
export async function rotateReceivingKeys(
  conversationId: string,
  messageCounter: number
): Promise<MessageKeys> {
  // Hent gjeldende ratchet-tilstand
  const ratchetState = await getRatchetState(conversationId);
  if (!ratchetState) {
    throw new Error(`Ingen ratchet funnet for samtale ${conversationId}`);
  }
  
  // Hvis meldingsteller er lavere enn forventet, mulig replay-angrep eller ut-av-rekkefølge melding
  if (messageCounter < ratchetState.receivingCounter) {
    throw new Error(`Mulig replay-angrep: Melding med teller ${messageCounter} mottatt, men gjeldende teller er ${ratchetState.receivingCounter}`);
  }
  
  // Hvis meldingsteller er større, må vi hoppe over noen nøkler (håndterer ut-av-rekkefølge meldinger)
  let currentChainKey = ratchetState.receivingChainKey;
  let currentCounter = ratchetState.receivingCounter;
  
  // Skipp fram til riktig teller
  while (currentCounter < messageCounter) {
    currentChainKey = await deriveNextChainKey(currentChainKey);
    currentCounter++;
  }
  
  // Utled meldingsnøkler for denne spesifikke meldingen
  const messageKeys = await deriveMessageKeys(currentChainKey, currentCounter);
  
  // Utled neste chain key for fremtidige meldinger
  const newReceivingChainKey = await deriveNextChainKey(currentChainKey);
  
  // Oppdater tilstand
  const updatedState: RatchetState = {
    ...ratchetState,
    receivingChainKey: newReceivingChainKey,
    receivingCounter: currentCounter + 1,
    lastUpdated: Date.now()
  };
  
  // Lagre oppdatert tilstand
  await saveRatchetState(updatedState);
  
  return messageKeys;
}

/**
 * Oppdaterer ratchet-tilstanden når motpartens nøkkel endres
 */
export async function updateRatchetWithNewKey(
  conversationId: string,
  theirPublicKey: JsonWebKey
): Promise<void> {
  // Hent gjeldende ratchet-tilstand
  const ratchetState = await getRatchetState(conversationId);
  if (!ratchetState) {
    throw new Error(`Ingen ratchet funnet for samtale ${conversationId}`);
  }
  
  // Generer et nytt nøkkelpar for vår side
  const newKeyPair = await generateKeyPair();
  
  // Utled en ny rot-nøkkel ved å kombinere nøkkelparene
  const dhResult = await performDiffieHellman(
    ratchetState.privateKey,
    theirPublicKey
  );
  
  // Bruk dette resultatet til å utlede nye nøkler
  const kdf = await deriveKeysFromSecret(dhResult, ratchetState.rootKey);
  
  // Oppdater tilstand med nye nøkler
  const updatedState: RatchetState = {
    ...ratchetState,
    rootKey: kdf.rootKey,
    sendingKey: kdf.sendingKey,
    receivingKey: kdf.receivingKey,
    sendingChainKey: kdf.sendingChainKey,
    receivingChainKey: kdf.receivingChainKey,
    publicKey: newKeyPair.publicKey,
    privateKey: newKeyPair.privateKey,
    theirPublicKey,
    lastUpdated: Date.now()
  };
  
  // Lagre oppdatert tilstand
  await saveRatchetState(updatedState);
}

/**
 * Lagre ratchet-tilstand i databasen
 */
async function saveRatchetState(state: RatchetState): Promise<void> {
  try {
    // Konverterer JsonWebKey-objekter til strenger
    const serializedState = {
      ...state,
      publicKey: JSON.stringify(state.publicKey),
      privateKey: JSON.stringify(state.privateKey),
      theirPublicKey: state.theirPublicKey ? JSON.stringify(state.theirPublicKey) : null
    };
    
    // Lagre i Supabase
    const { error } = await supabase
      .from('conversation_ratchets')
      .upsert({
        conversation_id: state.conversationId,
        ratchet_state: serializedState,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'conversation_id'
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Feil ved lagring av ratchet-tilstand:', error);
    throw new Error('Kunne ikke lagre ratchet-tilstand');
  }
}

/**
 * Hent ratchet-tilstand fra databasen
 */
async function getRatchetState(conversationId: string): Promise<RatchetState | null> {
  try {
    const { data, error } = await supabase
      .from('conversation_ratchets')
      .select('ratchet_state')
      .eq('conversation_id', conversationId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Ingen ratchet funnet
      }
      throw error;
    }
    
    if (!data?.ratchet_state) return null;
    
    const serializedState = data.ratchet_state as any;
    
    // Parse JsonWebKey-objekter
    return {
      ...serializedState,
      publicKey: JSON.parse(serializedState.publicKey),
      privateKey: JSON.parse(serializedState.privateKey),
      theirPublicKey: serializedState.theirPublicKey ? JSON.parse(serializedState.theirPublicKey) : undefined
    };
  } catch (error) {
    console.error('Feil ved henting av ratchet-tilstand:', error);
    return null;
  }
}

/**
 * Utleder meldingsnøkler fra en chain key
 */
async function deriveMessageKeys(
  chainKey: string, 
  counter: number
): Promise<MessageKeys> {
  try {
    // Kombiner chain key med counter for å få et unikt input
    const encoder = new TextEncoder();
    const combined = encoder.encode(`${chainKey}-${counter}`);
    
    // Bruk HKDF for å utlede tre nøkler fra én
    const sourceKey = await importSourceKey(combined);
    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: "HKDF",
        hash: { name: "SHA-256" },
        salt: encoder.encode("SnakkazMessageKeys"),
        info: encoder.encode("SnakkazE2EE")
      },
      sourceKey,
      384 // 128 bits for krypteringsnøkkel + 128 bits for auth nøkkel + 128 bits for IV
    );
    
    // Del opp resultatet i tre nøkler
    const derivedArray = new Uint8Array(derivedBits);
    const encryptionKeyBytes = derivedArray.slice(0, 16);
    const authKeyBytes = derivedArray.slice(16, 32);
    const ivBytes = derivedArray.slice(32, 44);
    
    return {
      encryptionKey: arrayBufferToBase64(encryptionKeyBytes),
      authenticationKey: arrayBufferToBase64(authKeyBytes),
      iv: arrayBufferToBase64(ivBytes)
    };
  } catch (error) {
    console.error('Feil ved utledning av meldingsnøkler:', error);
    throw new Error('Kunne ikke utlede meldingsnøkler');
  }
}

/**
 * Utleder neste chain key ved å hashe den gjeldende
 */
async function deriveNextChainKey(currentChainKey: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(currentChainKey);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    return arrayBufferToBase64(hashBuffer);
  } catch (error) {
    console.error('Feil ved utledning av neste chain key:', error);
    throw new Error('Kunne ikke utlede neste chain key');
  }
}

/**
 * Generer en tilfeldig nøkkel
 */
async function generateRandomKey(): Promise<string> {
  try {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return arrayBufferToBase64(array);
  } catch (error) {
    console.error('Feil ved generering av tilfeldig nøkkel:', error);
    throw new Error('Kunne ikke generere tilfeldig nøkkel');
  }
}

/**
 * Utfør Diffie-Hellman nøkkelutveksling
 */
async function performDiffieHellman(
  privateKey: JsonWebKey,
  publicKey: JsonWebKey
): Promise<ArrayBuffer> {
  try {
    // Importer nøkler
    const privateKeyObj = await window.crypto.subtle.importKey(
      "jwk",
      privateKey,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      false,
      ["deriveKey", "deriveBits"]
    );

    const publicKeyObj = await window.crypto.subtle.importKey(
      "jwk",
      publicKey,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      []
    );

    // Utled delt hemmelighet
    return await window.crypto.subtle.deriveBits(
      {
        name: "ECDH",
        public: publicKeyObj,
      },
      privateKeyObj,
      256 // 256 bits
    );
  } catch (error) {
    console.error('Feil ved utførelse av Diffie-Hellman:', error);
    throw new Error('Kunne ikke utføre Diffie-Hellman');
  }
}

/**
 * Utleder nye nøkler fra en delt hemmelighet og rot-nøkkel
 */
async function deriveKeysFromSecret(
  secret: ArrayBuffer,
  rootKey: string
): Promise<{
  rootKey: string;
  sendingKey: string;
  receivingKey: string;
  sendingChainKey: string;
  receivingChainKey: string;
}> {
  try {
    // Kombiner hemmeligheten med gjeldende rot-nøkkel
    const secretArray = new Uint8Array(secret);
    const rootKeyArray = base64ToArrayBuffer(rootKey);
    
    const combinedArray = new Uint8Array(secretArray.length + rootKeyArray.byteLength);
    combinedArray.set(secretArray);
    combinedArray.set(new Uint8Array(rootKeyArray), secretArray.length);
    
    // Bruk HKDF for å utlede nye nøkler
    const sourceKey = await importSourceKey(combinedArray);
    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: "HKDF",
        hash: { name: "SHA-256" },
        salt: new TextEncoder().encode("SnakkazRatchetKeys"),
        info: new TextEncoder().encode("SnakkazE2EE")
      },
      sourceKey,
      640 // 5 nøkler * 128 bits
    );
    
    const derivedArray = new Uint8Array(derivedBits);
    
    return {
      rootKey: arrayBufferToBase64(derivedArray.slice(0, 32)),
      sendingKey: arrayBufferToBase64(derivedArray.slice(32, 64)),
      receivingKey: arrayBufferToBase64(derivedArray.slice(64, 96)),
      sendingChainKey: arrayBufferToBase64(derivedArray.slice(96, 128)),
      receivingChainKey: arrayBufferToBase64(derivedArray.slice(128, 160))
    };
  } catch (error) {
    console.error('Feil ved utledning av nøkler fra hemmelighet:', error);
    throw new Error('Kunne ikke utlede nøkler fra hemmelighet');
  }
}

/**
 * Hjelpefunksjon for å importere en kilde-nøkkel for HKDF
 */
async function importSourceKey(keyData: ArrayBufferLike): Promise<CryptoKey> {
  return await window.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HKDF" },
    false,
    ["deriveBits"]
  );
}