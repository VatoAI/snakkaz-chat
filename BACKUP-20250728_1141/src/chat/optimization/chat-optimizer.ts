// Chat System Performance Optimizer

export interface ChatOptimizationConfig {
  messageBufferSize: number;
  virtualScrollThreshold: number;
  typingIndicatorTimeout: number;
  messageSearchIndexSize: number;
  emojiCacheSize: number;
  imageCompressionQuality: number;
}

export const chatConfig: ChatOptimizationConfig = {
  messageBufferSize: 100, // Keep last 100 messages in memory
  virtualScrollThreshold: 50, // Start virtual scrolling after 50 messages
  typingIndicatorTimeout: 3000, // 3 seconds
  messageSearchIndexSize: 1000, // Index last 1000 messages for search
  emojiCacheSize: 500, // Cache 500 most used emojis
  imageCompressionQuality: 0.8 // 80% quality for image compression
};

class ChatOptimizer {
  private messageBuffer: Map<string, any[]> = new Map();
  private searchIndex: Map<string, any[]> = new Map();
  private emojiCache: Map<string, string> = new Map();
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();

  // Message buffer management
  addToBuffer(chatId: string, messages: any[]): void {
    const buffer = this.messageBuffer.get(chatId) || [];
    const newBuffer = [...buffer, ...messages].slice(-chatConfig.messageBufferSize);
    this.messageBuffer.set(chatId, newBuffer);
  }

  getFromBuffer(chatId: string): any[] {
    return this.messageBuffer.get(chatId) || [];
  }

  clearBuffer(chatId: string): void {
    this.messageBuffer.delete(chatId);
  }

  // Message search optimization
  indexMessage(message: any): void {
    const searchTerms = this.extractSearchTerms(message.content);
    
    searchTerms.forEach(term => {
      const existing = this.searchIndex.get(term) || [];
      existing.push(message);
      
      // Keep only recent messages in index
      const trimmed = existing.slice(-chatConfig.messageSearchIndexSize);
      this.searchIndex.set(term, trimmed);
    });
  }

  searchMessages(query: string): any[] {
    const terms = query.toLowerCase().split(' ');
    const results = new Set<any>();
    
    terms.forEach(term => {
      const matches = this.searchIndex.get(term) || [];
      matches.forEach(match => results.add(match));
    });
    
    return Array.from(results);
  }

  private extractSearchTerms(content: string): string[] {
    return content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2);
  }

  // Emoji optimization
  cacheEmoji(emoji: string, url: string): void {
    if (this.emojiCache.size >= chatConfig.emojiCacheSize) {
      // Remove oldest emoji
      const firstKey = this.emojiCache.keys().next().value;
      this.emojiCache.delete(firstKey);
    }
    this.emojiCache.set(emoji, url);
  }

  getEmojiFromCache(emoji: string): string | undefined {
    return this.emojiCache.get(emoji);
  }

  // Typing indicator optimization
  startTyping(userId: string, chatId: string, callback: () => void): void {
    const key = `${userId}-${chatId}`;
    
    // Clear existing timeout
    const existingTimeout = this.typingTimeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      callback();
      this.typingTimeouts.delete(key);
    }, chatConfig.typingIndicatorTimeout);
    
    this.typingTimeouts.set(key, timeout);
  }

  stopTyping(userId: string, chatId: string): void {
    const key = `${userId}-${chatId}`;
    const timeout = this.typingTimeouts.get(key);
    
    if (timeout) {
      clearTimeout(timeout);
      this.typingTimeouts.delete(key);
    }
  }

  // Image optimization
  async compressImage(file: File): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 800px)
        const maxSize = 800;
        let { width, height } = img;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve!, 'image/jpeg', chatConfig.imageCompressionQuality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Performance monitoring
  measurePerformance<T>(operation: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`Chat operation "${operation}" took ${end - start} milliseconds`);
    return result;
  }
}

export const chatOptimizer = new ChatOptimizer();
