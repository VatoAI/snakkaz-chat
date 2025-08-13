
import { establishSecureConnection } from '../encryption';

export class SecureConnectionManager {
  constructor(private secureConnections: Map<string, CryptoKey>) {}
  
  public async establishSecureConnection(
    peerId: string,
    localPublicKey: JsonWebKey,
    localPrivateKey: JsonWebKey,
    peerPublicKey: JsonWebKey
  ): Promise<boolean> {
    try {
      if (this.secureConnections.has(peerId)) {
        return true; // Already have a secure connection
      }
      
      console.log(`Establishing secure connection with peer ${peerId}`);
      const secureConnection = await establishSecureConnection(
        localPublicKey,
        localPrivateKey,
        peerPublicKey
      );
      
      this.secureConnections.set(peerId, secureConnection);
      return true;
    } catch (error) {
      console.error(`Error establishing secure connection with peer ${peerId}:`, error);
      return false;
    }
  }
  
  public hasSecureConnection(peerId: string): boolean {
    return this.secureConnections.has(peerId);
  }
  
  public removeSecureConnection(peerId: string): void {
    this.secureConnections.delete(peerId);
  }
  
  public clearAllSecureConnections(): void {
    this.secureConnections.clear();
  }
}
