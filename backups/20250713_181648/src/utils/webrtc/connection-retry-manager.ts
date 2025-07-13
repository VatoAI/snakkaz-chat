
export class ConnectionRetryManager {
  private connectionAttempts: Map<string, number> = new Map();
  private lastRetryTime: Map<string, number> = new Map();
  private connectionErrors: Map<string, string> = new Map();
  
  constructor(
    private maxConnectionAttempts: number = 5, 
    private retryTimeout: number = 10000,
    private initialBackoff: number = 1000,
    private maxBackoff: number = 30000
  ) {}
  
  public incrementAttempts(peerId: string, errorMessage?: string): number {
    const attempts = this.getAttempts(peerId);
    this.connectionAttempts.set(peerId, attempts + 1);
    this.lastRetryTime.set(peerId, Date.now());
    
    if (errorMessage) {
      this.connectionErrors.set(peerId, errorMessage);
    }
    
    console.log(`Connection attempt ${attempts + 1} for peer ${peerId}${errorMessage ? ': ' + errorMessage : ''}`);
    return attempts + 1;
  }
  
  public getAttempts(peerId: string): number {
    return this.connectionAttempts.get(peerId) || 0;
  }
  
  public getLastError(peerId: string): string | undefined {
    return this.connectionErrors.get(peerId);
  }
  
  public resetAttempts(peerId: string): void {
    this.connectionAttempts.delete(peerId);
    this.lastRetryTime.delete(peerId);
    this.connectionErrors.delete(peerId);
    console.log(`Reset connection attempts for peer ${peerId}`);
  }
  
  public resetAllAttempts(): void {
    this.connectionAttempts.clear();
    this.lastRetryTime.clear();
    this.connectionErrors.clear();
    console.log('Reset all connection attempts');
  }
  
  public hasReachedMaxAttempts(peerId: string): boolean {
    return this.getAttempts(peerId) >= this.maxConnectionAttempts;
  }
  
  public shouldRetry(peerId: string): boolean {
    const attempts = this.getAttempts(peerId);
    
    // If we've hit max attempts, don't retry
    if (attempts >= this.maxConnectionAttempts) {
      console.log(`Max connection attempts reached for peer ${peerId}, will not retry`);
      return false;
    }
    
    // If this is the first attempt, always allow it
    if (attempts === 0) {
      return true;
    }
    
    // Check if enough time has passed since last attempt using exponential backoff
    const lastRetry = this.lastRetryTime.get(peerId) || 0;
    const currentTime = Date.now();
    const backoffTime = Math.min(
      this.initialBackoff * Math.pow(2, attempts - 1),
      this.maxBackoff
    );
    
    const shouldRetry = currentTime - lastRetry >= backoffTime;
    
    if (shouldRetry) {
      console.log(`Should retry connection to peer ${peerId} after backoff of ${backoffTime}ms`);
    } else {
      console.log(`Not enough time elapsed since last retry for peer ${peerId}, waiting...`);
    }
    
    return shouldRetry;
  }
  
  public getBackoffTime(peerId: string): number {
    const attempts = this.getAttempts(peerId);
    return Math.min(
      this.initialBackoff * Math.pow(2, attempts),
      this.maxBackoff
    );
  }
  
  public scheduleRetryReset(peerId: string): void {
    const attempts = this.getAttempts(peerId);
    setTimeout(() => {
      const currentAttempts = this.getAttempts(peerId);
      if (currentAttempts === attempts) {
        this.connectionAttempts.set(peerId, Math.max(0, currentAttempts - 1));
        console.log(`Scheduled reset for peer ${peerId}, reducing attempts to ${Math.max(0, currentAttempts - 1)}`);
      }
    }, this.retryTimeout);
  }
}
