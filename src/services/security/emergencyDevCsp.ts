/**
 * Emergency CSP Fix for Development
 * Direct fix for Google Fonts and Supabase WebSocket issues
 */

export function applyEmergencyDevCsp() {
  // Only run in browser environment
  if (typeof document === 'undefined') return;
  
  // Remove existing CSP
  const existingCsp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (existingCsp) {
    existingCsp.remove();
  }
  
  // Create new CSP with Google Fonts support
  const meta = document.createElement('meta');
  meta.setAttribute('http-equiv', 'Content-Security-Policy');
  meta.setAttribute('content', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: *.amazonaws.com storage.googleapis.com *.supabase.co *.supabase.in",
    "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com",
    "connect-src 'self' https://wqpoozpbceucynsojmbk.supabase.co wss://wqpoozpbceucynsojmbk.supabase.co https://wqp0ozrbxcucynsojmbk.supabase.co wss://wqp0ozrbxcucynsojmbk.supabase.co *.supabase.co *.supabase.in wss://*.supabase.co *.amazonaws.com storage.googleapis.com *.snakkaz.com https://fonts.googleapis.com https://fonts.gstatic.com",
    "media-src 'self' blob:",
    "object-src 'none'",
    "frame-src 'self'",
    "worker-src 'self' blob:"
  ].join('; '));
  
  document.head.appendChild(meta);
  console.log('🔧 Emergency dev CSP applied with Google Fonts support');
}
