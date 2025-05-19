/**
 * Dynamic Feature Imports
 * 
 * This module provides dynamic imports for feature modules
 * that might be large and aren't needed on initial load.
 */

import { createDynamicComponent } from '@/utils/dynamic-import';

// Profile page and components
export const ProfilePage = createDynamicComponent(
  () => import('@/pages/Profile')
);

// Settings page and components
export const SettingsPage = createDynamicComponent(
  () => import('@/pages/Settings')
);

// Group chat page and components
export const GroupChatPage = createDynamicComponent(
  () => import('@/pages/GroupChatPage')
);

// Preload profile-related components
export const preloadProfileComponents = () => {
  import('@/pages/Profile');
};

// Preload settings-related components
export const preloadSettingsComponents = () => {
  import('@/pages/Settings');
};

// Preload group chat components
export const preloadGroupChatComponents = () => {
  import('@/pages/GroupChatPage');
};
