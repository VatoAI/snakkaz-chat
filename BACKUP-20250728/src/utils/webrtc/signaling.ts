
import { supabase } from '@/integrations/supabase/client';
import type { SignalingInsert } from './types';

export class SignalingService {
  private connectionRetries: number = 0;
  private maxRetries: number = 5;
  private retryDelay: number = 500; // Start with 500ms delay

  constructor(private userId: string) {}

  setupSignalingListener(onSignal: (signal: any) => Promise<void>) {
    // Health check before setting up the channel
    this.checkConnection();

    const channel = supabase
      .channel('signaling')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'signaling',
          filter: `receiver_id=eq.${this.userId}`
        },
        async (payload) => {
          try {
            console.log('Received signal:', payload);
            await onSignal(payload.new);
            
            // Acknowledge signal processing by updating health record
            if (payload.new && payload.new.id) {
              // Optional: if you want to delete the signal after processing
              // await this.deleteProcessedSignal(payload.new.id);
            }
          } catch (error) {
            console.error('Error processing signal:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Signaling channel subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
          this.connectionRetries = 0; // Reset retries on successful connection
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          this.handleConnectionFailure();
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }

  async sendSignal(signalMessage: SignalingInsert) {
    try {
      const { error } = await supabase
        .from('signaling')
        .insert([signalMessage]);
        
      if (error) {
        console.error('Error sending signal:', error);
        throw error;
      }
      return true;
    } catch (error) {
      console.error('Failed to send signal:', error);
      
      // Attempt retry if we haven't reached max retries
      if (this.connectionRetries < this.maxRetries) {
        this.connectionRetries++;
        console.log(`Retry attempt ${this.connectionRetries}/${this.maxRetries} for sending signal`);
        
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, this.connectionRetries - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.sendSignal(signalMessage);
      }
      
      throw error;
    }
  }

  private async checkConnection() {
    try {
      const { error } = await supabase.from('health').select('status').limit(1);
      if (error) {
        console.error('Supabase connection check failed:', error);
      } else {
        console.log('Supabase connection verified');
      }
    } catch (e) {
      console.error('Connection check error:', e);
    }
  }

  private async deleteProcessedSignal(signalId: string) {
    try {
      await supabase
        .from('signaling')
        .delete()
        .eq('id', signalId);
    } catch (e) {
      console.error('Error deleting processed signal:', e);
    }
  }

  private handleConnectionFailure() {
    if (this.connectionRetries < this.maxRetries) {
      this.connectionRetries++;
      const delay = this.retryDelay * Math.pow(2, this.connectionRetries - 1);
      console.log(`Connection failed. Retry ${this.connectionRetries}/${this.maxRetries} in ${delay}ms`);
      
      setTimeout(() => {
        // Re-establish channel or check health
        this.checkConnection();
      }, delay);
    } else {
      console.error('Max connection retries reached for signaling service');
    }
  }
}
