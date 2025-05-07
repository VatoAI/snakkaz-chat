// Environment configuration for the Snakkaz application
export const environment = {
  production: import.meta.env.PROD || false,
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://wqpoozpbceucynsojmbk.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    customDomain: 'www.snakkaz.com', // Your custom domain
  },
  app: {
    name: 'Snakkaz',
    version: '1.0.0',
    baseUrl: import.meta.env.PROD ? 'https://www.snakkaz.com' : 'http://localhost:5173',
  }
};