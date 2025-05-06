
import { useState, useCallback } from 'react';
import { UserStatus } from '@/types/presence';

export const useChatState = () => {
  const [status, setStatus] = useState<UserStatus>(UserStatus.ONLINE);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const handleStatusChange = useCallback((newStatus: UserStatus) => {
    setStatus(newStatus);
  }, []);

  const handleSetOnline = useCallback(() => {
    setStatus(UserStatus.ONLINE);
  }, []);

  const handleSetAway = useCallback(() => {
    setStatus(UserStatus.AWAY);
  }, []);

  const handleSetBusy = useCallback(() => {
    setStatus(UserStatus.BUSY);
  }, []);
  
  const handleSetBRB = useCallback(() => {
    setStatus(UserStatus.BRB);
  }, []);

  const handleSetOffline = useCallback(() => {
    setStatus(UserStatus.OFFLINE);
  }, []);
  
  return {
    status,
    isTyping,
    isRecording,
    setStatus: handleStatusChange,
    setIsTyping,
    setIsRecording,
    handleSetOnline,
    handleSetAway,
    handleSetBusy,
    handleSetBRB,
    handleSetOffline
  };
};
