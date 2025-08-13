// WebRTC hooks exports
export { useWebRTC } from './useWebRTC.new';
export { useSignaling } from './useSignaling.new';
export { useWebRTCDirectMessaging } from './useWebRTCDirectMessaging.new';
export { useIntegratedChat } from './useIntegratedChat.new';
export { useWebRTCMonitoring } from './useWebRTCMonitoring.new';

// Re-export types
export type { WebRTCConnectionStats, WebRTCHookResult } from './useWebRTC.new';
export type { ConnectionType, DirectMessage } from './useWebRTCDirectMessaging.new';
export type { Message, DirectChatOptions } from './useIntegratedChat.new';

// For backward compatibility
import { useWebRTC as _useWebRTC } from './useWebRTC';
import { useSignaling as _useSignaling } from './useSignaling';
import { useWebRTCDirectMessaging as _useWebRTCDirectMessaging } from './useWebRTCDirectMessaging';
import { useIntegratedChat as _useIntegratedChat } from './useIntegratedChat';
import { useWebRTCMonitoring as _useWebRTCMonitoring } from './useWebRTCMonitoring';

// Legacy exports
export const useWebRTCLegacy = _useWebRTC;
export const useSignalingLegacy = _useSignaling;
export const useWebRTCDirectMessagingLegacy = _useWebRTCDirectMessaging;
export const useIntegratedChatLegacy = _useIntegratedChat;
export const useWebRTCMonitoringLegacy = _useWebRTCMonitoring;
