import React, { useState, useEffect, useCallback } from 'react';
import burnOnReadManager, { BurnConfig } from '../../utils/security/burn-on-read';
import { formatTimeLeft } from '../../utils/formatting/time';

interface BurnOnReadMessageProps {
  messageId: string;
  content: string;
  burnConfig?: Partial<BurnConfig>;
  onBurn?: () => void;
}

/**
 * A secure message component that automatically destroys itself after being read
 * Inspired by Wickr's security features
 */
const BurnOnReadMessage: React.FC<BurnOnReadMessageProps> = ({
  messageId,
  content,
  burnConfig,
  onBurn,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [burnToken, setBurnToken] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  // Handle secure message destruction
  const handleReveal = useCallback(() => {
    setIsRevealed(true);
    
    // Schedule message destruction
    const token = burnOnReadManager.scheduleMessageDestruction(
      messageId,
      burnConfig
    );
    
    setBurnToken(token);
    setTimeLeft((burnConfig?.burnTimeout || 30000));
  }, [messageId, burnConfig]);
  
  // Count down timer
  useEffect(() => {
    if (!isRevealed || timeLeft === null) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          if (onBurn) onBurn();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isRevealed, timeLeft, onBurn]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (burnToken && messageId) {
        burnOnReadManager.destroyMessage(messageId, burnToken);
      }
    };
  }, [burnToken, messageId]);
  
  // Prevent screenshots on sensitive content
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isRevealed && burnToken) {
        burnOnReadManager.destroyMessage(messageId, burnToken);
        if (onBurn) onBurn();
      }
    };
    
    if (burnConfig?.preventScreenshot) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [burnConfig, isRevealed, burnToken, messageId, onBurn]);
  
  if (!isRevealed) {
    return (
      <div className="secure-message secure-message--unrevealed">
        <div className="secure-message__container">
          <div className="secure-message__icon">🔒</div>
          <div className="secure-message__status">Encrypted Message</div>
          <button 
            className="secure-message__reveal-btn"
            onClick={handleReveal}
          >
            Tap to reveal (will auto-delete after)
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="secure-message secure-message--revealed">
      <div className="secure-message__container">
        <div className="secure-message__content">{content}</div>
        {timeLeft !== null && timeLeft > 0 && (
          <div className="secure-message__timer">
            Self-destructs in {formatTimeLeft(timeLeft)}
          </div>
        )}
      </div>
    </div>
  );
};

export default BurnOnReadMessage;