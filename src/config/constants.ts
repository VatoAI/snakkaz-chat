/**
 * Applikasjonskonstanter
 * 
 * Denne filen definerer konstanter som brukes på tvers av applikasjonen.
 */

// MCP server URL
export const MCP_SERVER_URL = process.env.REACT_APP_MCP_SERVER_URL || 'wss://mcp.snakkaz.com';

// WebRTC konfigurasjon
export const WEBRTC_CONFIG = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
    {
      urls: process.env.REACT_APP_TURN_SERVER || 'turn:turn.snakkaz.com:3478',
      username: process.env.REACT_APP_TURN_USERNAME || 'snakkaz',
      credential: process.env.REACT_APP_TURN_CREDENTIAL || 'snakkaz2025',
    }
  ],
  iceCandidatePoolSize: 10,
};

// Timeout og forsøk
export const CONNECTION_TIMEOUT = 15000; // 15 sekunder
export const MAX_RETRY_ATTEMPTS = 3;

// Kryptering
export const DEFAULT_ENCRYPTION_ENABLED = true;

// Chat konfigurasjon
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_OFFLINE_MESSAGES = 1000;
export const MESSAGE_HISTORY_LIMIT = 50;

// Tilkoblingstype prioritering
export const CONNECTION_PRIORITY = {
  WEBRTC: 1,  // Høyest prioritet
  MCP: 2,     // Middels prioritet
  SUPABASE: 3 // Laveste prioritet
};

// Metrics og logging
export const METRICS_ENABLED = true;
export const METRICS_INTERVAL = 60000; // 60 sekunder
