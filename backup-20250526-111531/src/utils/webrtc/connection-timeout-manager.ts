
export class ConnectionTimeoutManager {
  private connectionTimeouts: Map<string, NodeJS.Timeout> = new Map();

  public setTimeout(peerId: string, callback: () => void, timeout: number): void {
    // Clear any existing timeout for this peer
    this.clearTimeout(peerId);
    
    // Set new timeout
    const timeoutId = setTimeout(callback, timeout);
    this.connectionTimeouts.set(peerId, timeoutId);
  }

  public clearTimeout(peerId: string): void {
    const timeout = this.connectionTimeouts.get(peerId);
    if (timeout) {
      clearTimeout(timeout);
      this.connectionTimeouts.delete(peerId);
    }
  }

  public clearAllTimeouts(): void {
    this.connectionTimeouts.forEach(timeout => clearTimeout(timeout));
    this.connectionTimeouts.clear();
  }
}
