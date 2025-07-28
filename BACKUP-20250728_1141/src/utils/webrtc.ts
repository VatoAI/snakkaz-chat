/**
 * WebRTC Module for SnakkaZ Chat
 * 
 * This module exports all WebRTC-related components, hooks, and utilities
 * for use in the SnakkaZ chat application.
 */

// Export hooks
export { useWebRTC } from '../hooks/useWebRTC.new';
export { useWebRTCDirectMessaging } from '../hooks/useWebRTCDirectMessaging.new';
export { useSignaling } from '../hooks/useSignaling.new';
export { useWebRTCMonitoring } from '../hooks/useWebRTCMonitoring.new';
export { useIntegratedChat } from '../hooks/useIntegratedChat.new';

// Export components
export { default as WebRTCStatus } from '../components/chat/WebRTCStatus.new';
export { default as WebRTCMonitor } from '../components/chat/WebRTCMonitor.new';

// Export utilities
export { initializeWebRTCChat, useWebRTCChatStatus, useIntegratedChatWrapper } from './webrtc/chat-integration';

// Export types
export type { ChatIntegrationConfig } from './webrtc/chat-integration';
export type { ConnectionType } from '../hooks/useWebRTCDirectMessaging.new';
