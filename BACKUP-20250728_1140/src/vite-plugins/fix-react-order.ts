import { Plugin } from 'vite';

/**
 * Vite plugin to fix React modulepreload order in HTML
 * Ensures React loads before all dependencies that need it
 */
export function fixReactModuleOrder(): Plugin {
  return {
    name: 'fix-react-module-order',
    transformIndexHtml: {
      order: 'post',
      handler(html: string) {
        // Extract all modulepreload links
        const modulepreloadRegex = /<link[^>]+rel="modulepreload"[^>]*>/g;
        const matches = html.match(modulepreloadRegex) || [];
        
        if (matches.length === 0) return html;
        
        // Parse links to get href and full tag
        const links = matches.map(match => {
          const hrefMatch = match.match(/href="([^"]*)"/) || [];
          const href = hrefMatch[1] || '';
          return { href, tag: match };
        });
        
        // Define the priority order for React-related bundles
        const getPriority = (href: string): number => {
          // React core must load first (includes React, use-sync-external-store, Radix UI, etc.)
          if (href.includes('vendor-react-core')) return 1;
          // React DOM second
          if (href.includes('vendor-react-dom')) return 2;
          // Router third (depends on React)
          if (href.includes('vendor-router')) return 3;
          // UI components fourth
          if (href.includes('vendor-ui-components')) return 4;
          // Database/Supabase fifth (may use React)
          if (href.includes('vendor-database')) return 5;
          // Forms sixth (may use React hooks)
          if (href.includes('vendor-forms')) return 6;
          // App services seventh
          if (href.includes('app-services')) return 7;
          // App utilities eighth
          if (href.includes('app-utils')) return 8;
          // All other vendor packages
          if (href.includes('vendor-')) return 9;
          // App components and pages last
          return 10;
        };
        
        // Sort links by priority
        const sortedLinks = links.sort((a, b) => {
          const priorityA = getPriority(a.href);
          const priorityB = getPriority(b.href);
          return priorityA - priorityB;
        });
        
        // Remove all existing modulepreload links from HTML
        let newHtml = html;
        matches.forEach(match => {
          newHtml = newHtml.replace(match, '');
        });
        
        // Find the script tag and insert sorted modulepreload links before it
        const scriptTagMatch = newHtml.match(/<script[^>]+type="module"[^>]*>/);
        if (scriptTagMatch) {
          const scriptTag = scriptTagMatch[0];
          const modulepreloadTags = sortedLinks.map(link => 
            `    ${link.tag}`
          ).join('\n');
          
          newHtml = newHtml.replace(
            scriptTag,
            `${modulepreloadTags}\n    ${scriptTag}`
          );
        }
        
        return newHtml;
      }
    }
  };
}
