/**
 * ENHANCED USER EXPERIENCE FOR NORWEGIAN TECH COMMUNITY
 * Juni 7, 2025 - Fokus på hastighet, stabilitet og brukeropplevelse
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Norwegian UX Preferences
export interface NorwegianUXConfig {
  theme: 'dark' | 'light' | 'auto';
  language: 'no' | 'en';
  animations: boolean;
  notifications: {
    sound: boolean;
    desktop: boolean;
    importance: 'all' | 'mentions' | 'none';
  };
  performance: {
    preloadImages: boolean;
    reduceMotion: boolean;
    backgroundSync: boolean;
  };
}

// Default config for Norwegian tech professionals
const DEFAULT_CONFIG: NorwegianUXConfig = {
  theme: 'dark', // Cyberpunk aesthetic popular with Norwegian devs
  language: 'no',
  animations: true,
  notifications: {
    sound: false, // Respectful for open offices
    desktop: true,
    importance: 'mentions'
  },
  performance: {
    preloadImages: true,
    reduceMotion: false,
    backgroundSync: true
  }
};

export function useNorwegianUX() {
  const [config, setConfig] = useState<NorwegianUXConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'slow'>('online');

  // Load user preferences from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('snakkaz-norwegian-ux');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      }
    } catch (error) {
      console.warn('Could not load UX preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences when changed
  const updateConfig = useCallback((updates: Partial<NorwegianUXConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    
    try {
      localStorage.setItem('snakkaz-norwegian-ux', JSON.stringify(newConfig));
      toast.success('Innstillinger lagret', {
        description: 'Dine preferanser er oppdatert'
      });
    } catch (error) {
      toast.error('Feil ved lagring', {
        description: 'Kunne ikke lagre innstillinger'
      });
    }
  }, [config]);

  // Monitor connection quality for Norwegian users
  useEffect(() => {
    const updateConnectionStatus = () => {
      if (!navigator.onLine) {
        setConnectionStatus('offline');
        return;
      }

      // Check connection speed (Norwegian context)
      const connection = (navigator as any).connection;
      if (connection) {
        if (connection.effectiveType === '2g' || connection.downlink < 0.5) {
          setConnectionStatus('slow');
        } else {
          setConnectionStatus('online');
        }
      }
    };

    updateConnectionStatus();
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, []);

  // Performance optimizations for Norwegian users
  const optimizeForNorwegianUsers = useCallback(() => {
    // Preload critical resources
    if (config.performance.preloadImages) {
      const criticalImages = [
        '/icons/snakkaz-icon-192.png',
        '/assets/auth-bg.css'
      ];
      
      criticalImages.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = url.endsWith('.css') ? 'style' : 'image';
        document.head.appendChild(link);
      });
    }

    // Respect reduced motion preferences
    if (config.performance.reduceMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    }

    // Norwegian time format
    if (config.language === 'no') {
      document.documentElement.lang = 'no';
    }
  }, [config]);

  useEffect(() => {
    optimizeForNorwegianUsers();
  }, [optimizeForNorwegianUsers]);

  // Accessibility for Norwegian tech professionals
  const applyAccessibilityEnhancements = useCallback(() => {
    // High contrast for late-night coding sessions
    if (config.theme === 'dark') {
      document.documentElement.classList.add('dark-mode-enhanced');
    }

    // Keyboard navigation for power users
    document.addEventListener('keydown', (e) => {
      // Norwegian keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            // Open command palette
            document.dispatchEvent(new CustomEvent('open-command-palette'));
            break;
          case '/':
            e.preventDefault();
            // Focus search
            document.dispatchEvent(new CustomEvent('focus-search'));
            break;
        }
      }
    });
  }, [config.theme]);

  useEffect(() => {
    applyAccessibilityEnhancements();
  }, [applyAccessibilityEnhancements]);

  // Norwegian-specific notifications
  const showNorwegianNotification = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    if (config.notifications.desktop && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/icons/snakkaz-icon-192.png',
          badge: '/icons/snakkaz-badge.png',
          lang: config.language,
          tag: 'snakkaz-notification'
        });
      }
    }

    // Also show toast for immediate feedback
    const toastOptions = {
      description: message
    };

    switch (type) {
      case 'success':
        toast.success(title, toastOptions);
        break;
      case 'warning':
        toast.warning(title, toastOptions);
        break;
      case 'error':
        toast.error(title, toastOptions);
        break;
      default:
        toast(title, toastOptions);
    }
  }, [config.notifications, config.language]);

  // Performance metrics specifically for Norwegian users
  const trackNorwegianUserMetrics = useCallback((action: string, data?: any) => {
    if (typeof window !== 'undefined' && window.snakkazPerformance) {
      console.log(`🇳🇴 Norwegian User Action: ${action}`, data);
      
      // Track specific actions important for Norwegian tech community
      switch (action) {
        case 'chat_message_sent':
          window.dispatchEvent(new CustomEvent('chat-message-sent', { detail: data }));
          break;
        case 'navigation_start':
          window.dispatchEvent(new CustomEvent('navigation-start'));
          break;
        case 'navigation_complete':
          window.dispatchEvent(new CustomEvent('navigation-complete'));
          break;
      }
    }
  }, []);

  return {
    config,
    updateConfig,
    isLoading,
    connectionStatus,
    showNotification: showNorwegianNotification,
    trackUserAction: trackNorwegianUserMetrics,
    
    // Norwegian-specific helpers
    formatTime: (date: Date) => {
      return config.language === 'no' 
        ? date.toLocaleString('nb-NO')
        : date.toLocaleString('en-US');
    },
    
    getGreeting: () => {
      const hour = new Date().getHours();
      if (config.language === 'no') {
        if (hour < 6) return 'God natt';
        if (hour < 10) return 'God morgen';
        if (hour < 18) return 'God dag';
        return 'God kveld';
      }
      
      if (hour < 6) return 'Good night';
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    },
    
    isOptimalForNorwegianUsers: () => {
      return connectionStatus === 'online' && !isLoading;
    }
  };
}

// Norwegian UX Performance Hook
export function useNorwegianPerformance() {
  const [metrics, setMetrics] = useState<any>({});
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.snakkazPerformance) {
        setMetrics(window.snakkazPerformance.getMetrics());
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    metrics,
    grade: window.snakkazPerformance?.getPerformanceGrade() || 'F',
    isOptimal: window.snakkazPerformance?.getPerformanceGrade() === 'A' || 
               window.snakkazPerformance?.getPerformanceGrade() === 'B'
  };
}

// Export for global use
declare global {
  interface Window {
    snakkazPerformance?: any;
  }
}
