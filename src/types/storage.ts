/**
 * Storage keys used throughout the Snakkaz Chat application
 * 
 * This file defines constants for all localStorage/sessionStorage keys
 * to prevent typos and provide a central place to manage storage keys.
 */

export enum StorageKeys {
  // User settings
  USER_SETTINGS = 'userSettings',
  THEME_SETTINGS = 'themeSettings',
  NOTIFICATION_SETTINGS = 'notificationSettings',
  LANGUAGE_SETTINGS = 'languageSettings',
  
  // Authentication
  AUTH_TOKEN = 'authToken',
  REFRESH_TOKEN = 'refreshToken',
  USER_PROFILE = 'userProfile',
  
  // Application state
  LAST_VISITED_CHANNEL = 'lastVisitedChannel',
  CHAT_DRAFT_MESSAGES = 'chatDraftMessages',
  UNREAD_MESSAGES_COUNT = 'unreadMessagesCount',
  
  // Feature flags
  FEATURE_FLAGS = 'featureFlags',
  
  // Application version and updates
  APP_VERSION = 'appVersion',
  LAST_UPDATE_CHECK = 'lastUpdateCheck'
}