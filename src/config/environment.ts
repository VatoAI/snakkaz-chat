
// Environment configuration for the Snakkaz application
export const environment = {
  production: import.meta.env.PROD || false,
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://wqpoozpbceucynsojmbk.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8',
    customDomain: 'www.snakkaz.com', // Your custom domain
  },
  app: {
    name: 'Snakkaz',
    version: '1.0.0',
    baseUrl: import.meta.env.PROD ? 'https://www.snakkaz.com' : 'http://localhost:5173',
  }
};
