import { defineConfig } from 'vite'

declare module 'vite' {
  interface ImportMetaEnv {
    readonly VITE_AI_ENABLED: string
    readonly VITE_AI_DEFAULT_PROVIDER: string
    readonly VITE_AI_DEFAULT_MODEL: string
    readonly VITE_AI_MAX_TOKENS: string
    readonly VITE_AI_TEMPERATURE: string
    readonly VITE_DEBUG_MODE: string
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_API_ENDPOINT: string
    readonly VITE_SENTRY_DSN: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}