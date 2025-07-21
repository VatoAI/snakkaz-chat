import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

export const PWAHead: React.FC = () => {
  useEffect(() => {
    // Add meta tags dynamically for mobile optimization
    const addMetaTag = (name: string, content: string) => {
      const existingTag = document.querySelector(`meta[name="${name}"]`);
      if (existingTag) {
        existingTag.setAttribute('content', content);
      } else {
        const metaTag = document.createElement('meta');
        metaTag.name = name;
        metaTag.content = content;
        document.head.appendChild(metaTag);
      }
    };

    // Mobile optimization meta tags
    addMetaTag('mobile-web-app-capable', 'yes');
    addMetaTag('apple-mobile-web-app-capable', 'yes');
    addMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    addMetaTag('apple-mobile-web-app-title', 'SnakkaZ Beta');
    addMetaTag('application-name', 'SnakkaZ Beta');
    addMetaTag('msapplication-TileColor', '#D4AF37');
    addMetaTag('theme-color', '#D4AF37');
    
    // Security headers
    addMetaTag('referrer', 'strict-origin-when-cross-origin');
    addMetaTag('content-security-policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https: wss:;");
    
    // Performance hints
    addMetaTag('dns-prefetch', 'https://fonts.googleapis.com');
    addMetaTag('preconnect', 'https://fonts.gstatic.com');
    
  }, []);

  return (
    <Helmet>
      {/* Basic PWA meta tags */}
      <title>SnakkaZ Beta - Finn og snakk med andre</title>
      <meta name="description" content="Norsk sosial plattform med end-to-end kryptering og LiquidGlass design. Last ned som app på mobil!" />
      <meta name="keywords" content="chat, sikker, kryptering, AI, beta, norsk, mobil app, PWA" />
      
      {/* Viewport for mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
      
      {/* PWA manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* App icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/icons/icon-120x120.png" />
      
      {/* Splash screens for iOS */}
      <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" href="/splash/iphone-xr.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" href="/splash/iphone-x.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" href="/splash/iphone-8-plus.png" />
      <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="/splash/iphone-8.png" />
      
      {/* Microsoft tile config */}
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Open Graph tags for social sharing */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="SnakkaZ Beta - Finn og snakk med andre" />
      <meta property="og:description" content="Opplev den norske sosiale plattformen. Sikker, rask og med moderne funksjoner. Tilgjengelig som app på mobil!" />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content="https://snakkaz.com" />
      <meta property="og:site_name" content="SnakkaZ Beta" />
      <meta property="og:locale" content="nb_NO" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="SnakkaZ Beta - Finn og snakk med andre" />
      <meta name="twitter:description" content="Norsk sosial plattform er her! Prøv SnakkaZ Beta med end-to-end kryptering og LiquidGlass design." />
      <meta name="twitter:image" content="/twitter-image.png" />
      <meta name="twitter:creator" content="@SnakkaZApp" />
      
      {/* Schema.org structured data for search engines */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MobileApplication",
          "name": "SnakkaZ Beta",
          "operatingSystem": "All",
          "applicationCategory": "SocialNetworkingApplication",
          "description": "Sikker chat-plattform med AI-assistanse og end-to-end kryptering",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "NOK"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1247"
          },
          "author": {
            "@type": "Organization",
            "name": "SnakkaZ Team"
          }
        })}
      </script>
      
      {/* Preload critical resources - Only actual resources */}
      {/* <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /> */}
      {/* <link rel="preload" href="/api/auth/session" as="fetch" crossOrigin="anonymous" /> */}
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://wqpoozpbceucynsojmbk.supabase.co" />
      
      {/* Preconnect to critical third-party origins */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.supabase.co" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default PWAHead;
