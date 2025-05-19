/**
 * Dynamic Chat Components
 * 
 * This module provides utilities for lazy-loading chat components
 * to reduce initial bundle size and improve load times.
 */
import React from 'react';
import { createDynamicComponent } from '@/utils/dynamic-import';

// Loading placeholder for chat components
const ChatComponentLoading = () => (
  <div className="p-4 bg-cyberdark-800/30 rounded-md animate-pulse">
    <div className="h-4 bg-cyberdark-700 rounded w-1/3 mb-3"></div>
    <div className="h-3 bg-cyberdark-700 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-cyberdark-700 rounded w-1/2"></div>
  </div>
);

// Dynamic import for the complex chat feature components
export const ChatMessageList = createDynamicComponent(
  () => import('@/components/chat/MessageList'),
  <ChatComponentLoading />
);

export const GroupMessageList = createDynamicComponent(
  () => import('@/components/chat/GroupMessageList'),
  <ChatComponentLoading />
);

export const ChatList = createDynamicComponent(
  () => import('@/components/chat/ChatList'),
  <ChatComponentLoading />
);

export const GroupList = createDynamicComponent(
  () => import('@/components/chat/GroupList'),
  <ChatComponentLoading />
);

export const MediaUploader = createDynamicComponent(
  () => import('@/components/chat/MediaUploader'),
  <ChatComponentLoading />
);

export const SecureMessageViewer = createDynamicComponent(
  () => import('@/components/chat/SecureMessageViewer'),
  <ChatComponentLoading />
);

// AI feature components - these can be loaded separately
export const AIFeatures = {
  CommandConfirmation: createDynamicComponent(
    () => import('@/components/chat/ai/CommandConfirmationDialog'),
    <ChatComponentLoading />
  ),
  WorkflowDisplay: createDynamicComponent(
    () => import('@/components/chat/ai/features/WorkflowDisplay'),
    <ChatComponentLoading />
  ),
  HelpDetails: createDynamicComponent(
    () => import('@/components/chat/ai/features/HelpDetails'),
    <ChatComponentLoading />
  )
};

// Preload chat components based on user activity
export function preloadChatComponents(componentType: 'direct' | 'group' | 'ai' | 'all') {
  if (componentType === 'direct' || componentType === 'all') {
    import('@/components/chat/MessageList');
    import('@/components/chat/ChatList');
    import('@/components/chat/SecureMessageViewer');
  }
  
  if (componentType === 'group' || componentType === 'all') {
    import('@/components/chat/GroupMessageList');
    import('@/components/chat/GroupList');
  }
  
  if (componentType === 'ai' || componentType === 'all') {
    import('@/components/chat/ai/CommandConfirmationDialog');
    import('@/components/chat/ai/features/WorkflowDisplay');
    import('@/components/chat/ai/features/HelpDetails');
  }
}
