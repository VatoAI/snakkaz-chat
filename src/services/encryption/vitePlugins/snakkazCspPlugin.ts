/**
 * Snakkaz CSP Plugin
 * 
 * This plugin ensures that our Content Security Policy (CSP) is correctly applied
 * during Vite builds and that Cloudflare Analytics is properly initialized.
 */

import type { Plugin, HtmlTagDescriptor } from 'vite';

// Export the plugin function as default and named export
export { snakkazCspPlugin };

export interface SnakkazCspPluginOptions {
  /**
   * Enable or disable debug mode
   */
  debug?: boolean;
  
  /**
   * Cloudflare beacon token
   */
  cloudflareToken?: string;
  
  /**
   * Additional CSP directives to add
   */
  additionalDirectives?: Record<string, string[]>;
}

/**
 * Create a Vite plugin that injects CSP meta tags and Cloudflare Analytics
 */
export function snakkazCspPlugin(options: SnakkazCspPluginOptions = {}): Plugin {
  const {
    debug = false,
    cloudflareToken = 'c5bd7bbfe41c47c2a5ec',
    additionalDirectives = {}
  } = options;
  
  // Default CSP directives
  const defaultDirectives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'cdn.gpteng.co', '*.cloudflareinsights.com', 'static.cloudflareinsights.com'],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', '*.amazonaws.com', 'storage.googleapis.com', '*.supabase.co', '*.supabase.in'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'", 
      '*.supabase.co', 
      '*.supabase.in',
      'wss://*.supabase.co',
      '*.amazonaws.com',
      'storage.googleapis.com',
      '*.snakkaz.com',
      'dash.snakkaz.com',
      'business.snakkaz.com', 
      'docs.snakkaz.com',
      'analytics.snakkaz.com',
      'static.cloudflareinsights.com',
      'cloudflareinsights.com',
      '*.cloudflareinsights.com',
      'cdn.gpteng.co',
      'https://cdn.gpteng.co'
    ],
    'media-src': ["'self'", 'blob:'],
    'object-src': ["'none'"],
    'frame-src': ["'self'"],
    'worker-src': ["'self'", 'blob:']
  };
  
  // Merge additional directives
  const directives = { ...defaultDirectives };
  Object.entries(additionalDirectives).forEach(([key, values]) => {
    if (directives[key]) {
      directives[key] = [...new Set([...directives[key], ...values])];
    } else {
      directives[key] = values;
    }
  });
  
  // Build CSP string
  const buildCspString = () => {
    return Object.entries(directives)
      .map(([directive, values]) => `${directive} ${values.join(' ')}`)
      .join('; ');
  };
  
  return {
    name: 'snakkaz-csp-plugin',
    
    transformIndexHtml(html) {
      const cspPolicy = buildCspString();
      
      if (debug) {
        console.log('Applying CSP Policy:', cspPolicy);
      }
      
      const tags: HtmlTagDescriptor[] = [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: cspPolicy
          },
          injectTo: 'head'
        },
        {
          tag: 'script',
          attrs: {
            defer: true,
            crossorigin: 'anonymous',
            referrerpolicy: 'no-referrer-when-downgrade',
            src: 'https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015',
            'data-cf-beacon': `{"token":"${cloudflareToken}","version":"2023.10.0","spa":true,"spaMode":"auto","cookieDomain":"snakkaz.com","referrerPolicy":"no-referrer-when-downgrade"}`
          },
          injectTo: 'head'
        }
      ];
      
      return {
        html,
        tags
      };
    }
  };
}
