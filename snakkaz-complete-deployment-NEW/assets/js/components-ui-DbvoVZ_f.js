const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/js/pages-main-CGAuwU2K.js","assets/js/vendor-react-core-peV8eoe8.js","assets/js/vendor-react-dom-DBSIcw_A.js","assets/js/vendor-misc-CCY79dSD.js","assets/js/vendor-database-s2JKKpHA.js","assets/js/app-utils-BV6CnmwB.js","assets/js/vendor-style-utils-nLA3zUC6.js","assets/js/app-services-Dev6HuE6.js","assets/js/vendor-security-LdHy7Pt9.js","assets/js/vendor-router-DR7xMgBe.js","assets/js/vendor-react-hooks-e3EokQmA.js","assets/js/vendor-radix-ui-UJNVxv2C.js","assets/css/pages-main-mrR2Awbu.css"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { r as reactExports, j as jsxRuntimeExports, av as HelmetExport, aw as CircleAlert, ax as RefreshCw, ay as MessageCircle, az as User, aA as Settings, aB as LogOut, aC as ChartColumn, aD as Users, aE as UserPlus, aF as Bot, aG as Mail$1, aH as Info, aI as Shield, aJ as Plus, aK as Menu, X, aL as ArrowLeft, aM as Phone, aN as Video, aO as EllipsisVertical, aP as Hash, aQ as Share2, aR as Sparkles, aS as Gift, M as Check, aT as Copy, aU as MessageSquare, aV as Send, aW as Facebook, aX as Twitter, aY as Smartphone, aZ as ExternalLink, a_ as Star, a$ as Zap, b0 as House, b1 as Heart, b2 as Globe, b3 as Brain, b4 as Search, b5 as ShieldCheck, b6 as EyeOff, a1 as Circle, b7 as Moon, b8 as LoaderCircle, b9 as Clock, ba as dist, bb as UserRoundX, bc as Crown, bd as Bell, be as Palette, bf as Inbox, bg as Archive, bh as Database, bi as QRCodeSVG, bj as Code, bk as Bitcoin, bl as React, bm as Lock, bn as CircleX, bo as CircleCheckBig, bp as Lightbulb, bq as Eye, br as Camera, bs as Image$1, bt as Upload, bu as Link$1, bv as QrCode, bw as Linkedin, bx as Trash2, by as ShieldAlert } from "./vendor-react-core-peV8eoe8.js";
import { L as Label, I as Input, u as useAuth, B as Button, A as Avatar, a as AvatarImage, b as AvatarFallback, c as useIsMobile, d as useToast, C as Card, e as cn$1, f as CardHeader, g as CardTitle, h as CardDescription, i as CardContent, D as Dialog, j as DialogTrigger, k as DialogContent, l as DialogHeader, m as DialogTitle, n as DialogDescription, T as Textarea, o as Badge, p as useIsAdmin, q as useDeviceDetection, r as useMobilePinSecurity, t as supabase, v as TooltipProvider, w as Tooltip, x as TooltipTrigger, y as TooltipContent, z as useToast$1, S as ScrollArea, E as Skeleton, F as CardFooter, G as Tabs, H as TabsList, J as TabsTrigger, K as TabsContent, M as Separator, N as useUsernameValidation, O as useEmailValidation, P as Switch, Q as Alert, R as AlertTitle, U as AlertDescription, V as DialogFooter } from "./app-utils-BV6CnmwB.js";
import "./vendor-database-s2JKKpHA.js";
import { a as useLocation, L as Link, u as useNavigate } from "./vendor-router-DR7xMgBe.js";
import { t as twMerge, c as clsx } from "./vendor-style-utils-nLA3zUC6.js";
import { b as browser } from "./vendor-media-BkkA1nSt.js";
import { A as AnimatePresence$1, m as motion } from "./vendor-animation-Ct_3gxOz.js";
import { a as axios } from "./vendor-network-BSBq6A-N.js";
import { s as subscriptionService, P as PremiumFeature } from "./app-services-Dev6HuE6.js";
import { p as passwordStrength } from "./vendor-misc-CCY79dSD.js";
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const PWAHead = () => {
  reactExports.useEffect(() => {
    const addMetaTag = (name, content) => {
      const existingTag = document.querySelector(`meta[name="${name}"]`);
      if (existingTag) {
        existingTag.setAttribute("content", content);
      } else {
        const metaTag = document.createElement("meta");
        metaTag.name = name;
        metaTag.content = content;
        document.head.appendChild(metaTag);
      }
    };
    addMetaTag("mobile-web-app-capable", "yes");
    addMetaTag("apple-mobile-web-app-capable", "yes");
    addMetaTag("apple-mobile-web-app-status-bar-style", "black-translucent");
    addMetaTag("apple-mobile-web-app-title", "SnakkaZ Beta");
    addMetaTag("application-name", "SnakkaZ Beta");
    addMetaTag("msapplication-TileColor", "#D4AF37");
    addMetaTag("theme-color", "#D4AF37");
    addMetaTag("referrer", "strict-origin-when-cross-origin");
    addMetaTag("content-security-policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https: wss:;");
    addMetaTag("dns-prefetch", "https://fonts.googleapis.com");
    addMetaTag("preconnect", "https://fonts.gstatic.com");
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(HelmetExport, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "SnakkaZ Beta - Sikker Chat med AI" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "description", content: "Fremtidens chat-plattform med end-to-end kryptering, AI-assistanse og viral deling. Last ned som app på mobil!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "keywords", content: "chat, sikker, kryptering, AI, beta, norsk, mobil app, PWA" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "manifest", href: "/manifest.json" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/icons/icon-32x32.png" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "icon", type: "image/png", sizes: "16x16", href: "/icons/icon-16x16.png" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "apple-touch-icon", sizes: "180x180", href: "/icons/icon-180x180.png" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "apple-touch-icon", sizes: "152x152", href: "/icons/icon-152x152.png" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "apple-touch-icon", sizes: "144x144", href: "/icons/icon-144x144.png" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "apple-touch-icon", sizes: "120x120", href: "/icons/icon-120x120.png" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "apple-touch-startup-image", media: "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)", href: "/splash/iphone-xr.png" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "apple-touch-startup-image", media: "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)", href: "/splash/iphone-x.png" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "apple-touch-startup-image", media: "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)", href: "/splash/iphone-8-plus.png" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "apple-touch-startup-image", media: "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)", href: "/splash/iphone-8.png" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "msapplication-config", content: "/browserconfig.xml" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:type", content: "website" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:title", content: "SnakkaZ Beta - Sikker Chat med AI" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:description", content: "Opplev fremtidens chat-plattform. Sikker, rask og med AI-funksjoner. Tilgjengelig som app på mobil!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:image", content: "/og-image.png" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:image:width", content: "1200" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:image:height", content: "630" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:url", content: "https://snakkaz.com" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:site_name", content: "SnakkaZ Beta" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { property: "og:locale", content: "nb_NO" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:title", content: "SnakkaZ Beta - Sikker Chat med AI" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:description", content: "Fremtidens chat-plattform er her! Prøv SnakkaZ Beta med end-to-end kryptering og AI-assistanse." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:image", content: "/twitter-image.png" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "twitter:creator", content: "@SnakkaZApp" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("script", { type: "application/ld+json", children: JSON.stringify({
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
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "preload", href: "/fonts/inter-var.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "preload", href: "/api/auth/session", as: "fetch", crossOrigin: "anonymous" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "dns-prefetch", href: "https://fonts.googleapis.com" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "dns-prefetch", href: "https://fonts.gstatic.com" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "dns-prefetch", href: "https://api.supabase.co" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "preconnect", href: "https://api.supabase.co", crossOrigin: "anonymous" })
  ] });
};
class PWAManager {
  constructor() {
    __publicField(this, "deferredPrompt", null);
    __publicField(this, "isInstalled", false);
    __publicField(this, "swRegistration", null);
    // Handle messages from service worker
    __publicField(this, "handleServiceWorkerMessage", (event) => {
      if (event.data && event.data.type === "NOTIFICATION_CLICKED") {
        window.location.href = event.data.url;
      }
    });
    this.init();
  }
  async init() {
    var _a;
    if ("serviceWorker" in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register("/sw.js");
        console.log("✅ Service Worker registered successfully");
        this.swRegistration.addEventListener("updatefound", () => {
          var _a2;
          const newWorker = (_a2 = this.swRegistration) == null ? void 0 : _a2.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  this.showUpdateAvailable();
                }
              }
            });
          }
        });
      } catch (error) {
        console.error("❌ Service Worker registration failed:", error);
      }
    }
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });
    window.addEventListener("appinstalled", () => {
      this.isInstalled = true;
      this.hideInstallButton();
      this.showToast("🎉 SnakkaZ Beta installert! Åpne fra hjemskjermen.", "success");
    });
    (_a = navigator.serviceWorker) == null ? void 0 : _a.addEventListener("message", this.handleServiceWorkerMessage);
  }
  // Simple toast implementation
  showToast(message, type = "info") {
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500"
    };
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white p-3 rounded-lg shadow-lg z-50 max-w-sm`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4e3);
  }
  // Install PWA
  async installPWA() {
    if (!this.deferredPrompt) {
      this.showToast("Installasjonen er ikke tilgjengelig i denne nettleseren", "error");
      return false;
    }
    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === "accepted") {
        this.showToast("📱 Installerer SnakkaZ Beta...", "success");
        this.deferredPrompt = null;
        return true;
      } else {
        this.showToast("Du kan installere SnakkaZ senere fra nettlesermenyen", "info");
        return false;
      }
    } catch (error) {
      console.error("Installation failed:", error);
      this.showToast("Installasjonen feilet. Prøv igjen.", "error");
      return false;
    }
  }
  // Request notification permission
  async requestNotificationPermission() {
    if (!("Notification" in window)) {
      this.showToast("Denne nettleseren støtter ikke push-notifikasjoner", "error");
      return false;
    }
    if (Notification.permission === "granted") {
      return true;
    }
    if (Notification.permission === "denied") {
      this.showToast("Notifikasjoner er blokkert. Aktiver i nettleserinnstillinger.", "error");
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        this.showToast("🔔 Notifikasjoner aktivert!", "success");
        await this.subscribeToNotifications();
        return true;
      } else {
        this.showToast("Du kan aktivere notifikasjoner senere i innstillinger", "info");
        return false;
      }
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      return false;
    }
  }
  // Subscribe to push notifications
  async subscribeToNotifications() {
    if (!this.swRegistration) {
      console.error("Service Worker not registered");
      return;
    }
    try {
      const dummyKey = "BMqS9KzJRPVLhUxOFTh5MnAzGr8VQJ6JvXb3zPn8F3kQ7CqT9nJ5P7p6Vw1zR3s5Q7L4";
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(dummyKey)
      });
      console.log("✅ Push notification subscription successful");
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
    }
  }
  // Utility function for VAPID key conversion
  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  // Show install button/banner
  showInstallButton() {
    var _a, _b;
    const existingBanner = document.getElementById("pwa-install-banner");
    if (existingBanner) {
      existingBanner.remove();
    }
    const installBanner = document.createElement("div");
    installBanner.id = "pwa-install-banner";
    installBanner.className = "fixed bottom-4 left-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-4 rounded-xl shadow-lg z-50 transform transition-transform duration-300";
    installBanner.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            📱
          </div>
          <div>
            <p class="font-semibold">Installer SnakkaZ Beta</p>
            <p class="text-sm opacity-80">For best opplevelse på mobil</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button id="pwa-install-btn" class="bg-black text-white px-4 py-2 rounded-lg font-medium">
            Installer
          </button>
          <button id="pwa-dismiss-btn" class="text-black opacity-70 px-2">
            ✕
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(installBanner);
    (_a = document.getElementById("pwa-install-btn")) == null ? void 0 : _a.addEventListener("click", () => {
      this.installPWA();
    });
    (_b = document.getElementById("pwa-dismiss-btn")) == null ? void 0 : _b.addEventListener("click", () => {
      this.hideInstallButton();
    });
    setTimeout(() => {
      this.hideInstallButton();
    }, 15e3);
  }
  hideInstallButton() {
    const banner = document.getElementById("pwa-install-banner");
    if (banner) {
      banner.remove();
    }
  }
  // Show update available notification
  showUpdateAvailable() {
    var _a;
    const updateToast = document.createElement("div");
    updateToast.className = "fixed top-4 left-4 right-4 bg-blue-500 text-white p-4 rounded-xl shadow-lg z-50";
    updateToast.innerHTML = `
      <div class="flex items-center justify-between">
        <span>🔄 Ny versjon tilgjengelig!</span>
        <button id="update-btn" class="bg-white text-blue-500 px-3 py-1 rounded text-sm font-medium">
          Oppdater
        </button>
      </div>
    `;
    document.body.appendChild(updateToast);
    (_a = document.getElementById("update-btn")) == null ? void 0 : _a.addEventListener("click", () => {
      window.location.reload();
    });
    setTimeout(() => {
      updateToast.remove();
    }, 1e4);
  }
  // Send test notification
  async sendTestNotification() {
    if (Notification.permission === "granted") {
      new Notification("SnakkaZ Beta Test", {
        body: "Push-notifikasjoner fungerer perfekt! 🎉",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png"
      });
      this.showToast("Test-notifikasjon sendt!", "success");
    } else {
      this.showToast("Aktiver notifikasjoner først", "error");
    }
  }
  // Get install status
  getInstallStatus() {
    return {
      isInstalled: this.isInstalled,
      canInstall: !!this.deferredPrompt,
      notificationPermission: Notification.permission,
      isOnline: navigator.onLine
    };
  }
  // Force update service worker
  async updateServiceWorker() {
    if (this.swRegistration) {
      await this.swRegistration.update();
    }
  }
}
const pwaManager = new PWAManager();
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
};
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = reactExports.useState(navigator.onLine);
  reactExports.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const toast = document.createElement("div");
      toast.className = "fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50";
      toast.textContent = "🌐 Tilkoblet internett";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3e3);
    };
    const handleOffline = () => {
      setIsOnline(false);
      const toast = document.createElement("div");
      toast.className = "fixed top-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50";
      toast.textContent = "📡 Ingen internettforbindelse";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3e3);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return isOnline;
};
const MobileOptimization = ({ children }) => {
  const [installPromptShown, setInstallPromptShown] = reactExports.useState(false);
  const [notificationPermission, setNotificationPermission] = reactExports.useState(Notification.permission);
  const isOnline = useNetworkStatus();
  reactExports.useEffect(() => {
    if (isMobile() && !installPromptShown) {
      const timer = setTimeout(() => {
        showInstallPrompt();
        setInstallPromptShown(true);
      }, 3e4);
      return () => clearTimeout(timer);
    }
  }, [installPromptShown]);
  reactExports.useEffect(() => {
    if (notificationPermission === "default" && isMobile()) {
      const timer = setTimeout(() => {
        showNotificationPrompt();
      }, 5e3);
      return () => clearTimeout(timer);
    }
  }, [notificationPermission]);
  const showInstallPrompt = () => {
    var _a, _b;
    if (!installPromptShown) {
      const toast = document.createElement("div");
      toast.className = "fixed bottom-20 left-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-4 rounded-xl shadow-lg z-50";
      toast.innerHTML = `
        <div class="flex flex-col space-y-2">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">📱</span>
            <div>
              <p class="font-semibold">Installer SnakkaZ Beta</p>
              <p class="text-sm opacity-80">Få app-opplevelse på hjemskjermen</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <button id="install-now-btn" class="bg-black text-white px-4 py-2 rounded-lg font-medium text-sm">
              Installer nå
            </button>
            <button id="install-later-btn" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm">
              Senere
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      (_a = document.getElementById("install-now-btn")) == null ? void 0 : _a.addEventListener("click", () => {
        pwaManager.installPWA();
        toast.remove();
      });
      (_b = document.getElementById("install-later-btn")) == null ? void 0 : _b.addEventListener("click", () => {
        toast.remove();
      });
      setTimeout(() => toast.remove(), 15e3);
    }
  };
  const showNotificationPrompt = () => {
    var _a, _b;
    const toast = document.createElement("div");
    toast.className = "fixed bottom-20 left-4 right-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-xl shadow-lg z-50";
    toast.innerHTML = `
      <div class="flex flex-col space-y-2">
        <div class="flex items-center space-x-2">
          <span class="text-2xl">🔔</span>
          <div>
            <p class="font-semibold">Aktiver notifikasjoner</p>
            <p class="text-sm opacity-80">Få varsler om nye meldinger</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button id="enable-notifications-btn" class="bg-white text-blue-500 px-4 py-2 rounded-lg font-medium text-sm">
            Aktiver
          </button>
          <button id="notifications-later-btn" class="bg-blue-300 text-blue-700 px-4 py-2 rounded-lg text-sm">
            Ikke nå
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    (_a = document.getElementById("enable-notifications-btn")) == null ? void 0 : _a.addEventListener("click", async () => {
      const granted = await pwaManager.requestNotificationPermission();
      if (granted) {
        setNotificationPermission("granted");
      }
      toast.remove();
    });
    (_b = document.getElementById("notifications-later-btn")) == null ? void 0 : _b.addEventListener("click", () => {
      toast.remove();
    });
    setTimeout(() => toast.remove(), 12e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    children,
    isMobile() && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      !isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm z-50", children: "📡 Ingen internettforbindelse - Noen funksjoner kan være begrenset" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-20 right-4 flex flex-col space-y-2 z-40", children: [
        pwaManager.getInstallStatus().canInstall && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => pwaManager.installPWA(),
            className: "bg-yellow-500 text-black p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-colors",
            title: "Installer app",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "📱" })
          }
        ),
        notificationPermission === "granted" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => pwaManager.sendTestNotification(),
            className: "bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors",
            title: "Test notifikasjon",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "🔔" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-1 text-xs", children: "💡 Tips: Installer appen for best opplevelse" })
    ] })
  ] });
};
const icons = {
  Download: () => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "📱" }),
  Bell: () => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🔔" }),
  Share2: () => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "📤" }),
  Shield: () => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "🛡️" }),
  Zap: () => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "⚡" }),
  Users: () => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "👥" })
};
const MobileLaunchBanner = () => {
  const [isVisible, setIsVisible] = reactExports.useState(false);
  const [currentStep, setCurrentStep] = reactExports.useState(0);
  const [hasInteracted, setHasInteracted] = reactExports.useState(false);
  const showToast = (message, type = "info") => {
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500"
    };
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white p-3 rounded-lg shadow-lg z-50 max-w-sm`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3e3);
  };
  const steps = [
    {
      icon: icons.Download,
      title: "Last ned SnakkaZ",
      description: "Installer som app på hjemskjermen",
      action: "installer",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: icons.Bell,
      title: "Aktiver varsler",
      description: "Få push-notifikasjoner for nye meldinger",
      action: "notifications",
      color: "from-green-500 to-green-600"
    },
    {
      icon: icons.Share2,
      title: "Inviter venner",
      description: "Del din invitasjonskode og få bonuser",
      action: "share",
      color: "from-purple-500 to-purple-600"
    }
  ];
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setIsVisible(true);
      }
    }, 3e3);
    const stepTimer = setInterval(() => {
      if (isVisible) {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }
    }, 4e3);
    return () => {
      clearTimeout(timer);
      clearInterval(stepTimer);
    };
  }, [hasInteracted, isVisible]);
  const handleAction = async (action) => {
    setHasInteracted(true);
    switch (action) {
      case "installer":
        const installed = await pwaManager.installPWA();
        if (installed) {
          setIsVisible(false);
        }
        break;
      case "notifications":
        const granted = await pwaManager.requestNotificationPermission();
        if (granted) {
          showToast("🔔 Notifikasjoner aktivert!", "success");
        }
        break;
      case "share":
        if (navigator.share) {
          navigator.share({
            title: "SnakkaZ Beta - Sikker Chat",
            text: "Sjekk ut SnakkaZ Beta - fremtidens chat-plattform!",
            url: window.location.origin + "?ref=" + Date.now()
          });
        } else {
          navigator.clipboard.writeText(window.location.origin + "?ref=" + Date.now());
          showToast("📋 Link kopiert!", "success");
        }
        break;
    }
  };
  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;
  if (!isVisible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 },
      className: "fixed bottom-4 left-4 right-4 z-50 md:hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `bg-gradient-to-r ${currentStepData.color} rounded-2xl p-4 shadow-2xl backdrop-blur-sm border border-white/20`,
            layout: true,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-white", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setIsVisible(false),
                    className: "absolute top-2 right-2 text-white/70 hover:text-white p-1",
                    children: "✕"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      initial: { rotate: 0, scale: 0.8 },
                      animate: { rotate: 360, scale: 1 },
                      transition: { duration: 0.5 },
                      className: "bg-white/20 p-3 rounded-full",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, {})
                    },
                    currentStep
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h3",
                      {
                        initial: { opacity: 0, x: 20 },
                        animate: { opacity: 1, x: 0 },
                        className: "font-bold text-lg",
                        children: currentStepData.title
                      },
                      `title-${currentStep}`
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        initial: { opacity: 0, x: 20 },
                        animate: { opacity: 1, x: 0 },
                        transition: { delay: 0.1 },
                        className: "text-sm opacity-90",
                        children: currentStepData.description
                      },
                      `desc-${currentStep}`
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    whileTap: { scale: 0.95 },
                    onClick: () => handleAction(currentStepData.action),
                    className: "bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors ml-3",
                    children: [
                      currentStepData.action === "installer" && "Installer",
                      currentStepData.action === "notifications" && "Aktiver",
                      currentStepData.action === "share" && "Del"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center space-x-2 mt-3", children: steps.map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  animate: {
                    scale: index === currentStep ? 1.2 : 1,
                    opacity: index === currentStep ? 1 : 0.5
                  },
                  className: "w-2 h-2 bg-white rounded-full cursor-pointer",
                  onClick: () => setCurrentStep(index)
                },
                index
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5 },
            className: "mt-3 bg-black/80 backdrop-blur-sm rounded-xl p-3",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-white text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(icons.Shield, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "End-to-end kryptert" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(icons.Zap, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "AI-assistert" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(icons.Users, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sosial deling" })
              ] })
            ] })
          }
        )
      ]
    }
  ) });
};
const PreviewBanner = () => {
  {
    return null;
  }
};
const DeveloperTools = () => {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  {
    return null;
  }
};
const MathCaptcha = ({
  onVerificationChange,
  isLoading = false,
  error
}) => {
  const [num1, setNum1] = reactExports.useState(0);
  const [num2, setNum2] = reactExports.useState(0);
  const [userAnswer, setUserAnswer] = reactExports.useState("");
  const [isCorrect, setIsCorrect] = reactExports.useState(false);
  const [attempts, setAttempts] = reactExports.useState(0);
  const [isLocked, setIsLocked] = reactExports.useState(false);
  const [checkAttemptTimeout, setCheckAttemptTimeout] = reactExports.useState(null);
  const onVerificationChangeRef = reactExports.useRef(onVerificationChange);
  onVerificationChangeRef.current = onVerificationChange;
  const generateNewProblem = reactExports.useCallback(() => {
    const newNum1 = Math.floor(Math.random() * 10) + 1;
    const newNum2 = Math.floor(Math.random() * 10) + 1;
    setNum1(newNum1);
    setNum2(newNum2);
    setUserAnswer("");
    setIsCorrect(false);
    setAttempts(0);
    onVerificationChangeRef.current(false, "");
  }, []);
  reactExports.useEffect(() => {
    const newNum1 = Math.floor(Math.random() * 10) + 1;
    const newNum2 = Math.floor(Math.random() * 10) + 1;
    setNum1(newNum1);
    setNum2(newNum2);
    setUserAnswer("");
    setIsCorrect(false);
    setAttempts(0);
    onVerificationChangeRef.current(false, "");
  }, []);
  reactExports.useEffect(() => {
    if (!userAnswer) {
      setIsCorrect(false);
      onVerificationChangeRef.current(false, "");
      return;
    }
    const parsedAnswer = parseFloat(userAnswer);
    const correctAnswer = num1 + num2;
    const correct = !isNaN(parsedAnswer) && Math.abs(parsedAnswer - correctAnswer) < 1e-4;
    setIsCorrect(correct);
    if (correct) {
      if (checkAttemptTimeout) {
        clearTimeout(checkAttemptTimeout);
        setCheckAttemptTimeout(null);
      }
      const token = btoa(`${num1}-${num2}-${userAnswer}-${Date.now()}`);
      onVerificationChangeRef.current(true, token);
      setAttempts(0);
    } else {
      onVerificationChangeRef.current(false, "");
      if (checkAttemptTimeout) {
        clearTimeout(checkAttemptTimeout);
      }
      const timeout = setTimeout(() => {
        if (userAnswer.length >= 1 && !isNaN(parsedAnswer)) {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          if (newAttempts >= 3) {
            setIsLocked(true);
            setTimeout(() => {
              setIsLocked(false);
              setAttempts(0);
              const newNum1 = Math.floor(Math.random() * 10) + 1;
              const newNum2 = Math.floor(Math.random() * 10) + 1;
              setNum1(newNum1);
              setNum2(newNum2);
              setUserAnswer("");
              setIsCorrect(false);
              onVerificationChangeRef.current(false, "");
            }, 3e4);
          }
        }
        setCheckAttemptTimeout(null);
      }, 1500);
      setCheckAttemptTimeout(timeout);
    }
  }, [userAnswer, num1, num2, attempts, checkAttemptTimeout]);
  reactExports.useEffect(() => {
    return () => {
      if (checkAttemptTimeout) {
        clearTimeout(checkAttemptTimeout);
      }
    };
  }, [checkAttemptTimeout]);
  const handleRefresh = reactExports.useCallback(() => {
    generateNewProblem();
  }, [generateNewProblem]);
  const handleAnswerChange = (value) => {
    if (isLocked) return;
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return;
    }
    setUserAnswer(numericValue);
  };
  const getStatusColor = () => {
    if (isLocked) return "text-red-500";
    if (userAnswer && isCorrect) return "text-green-500";
    if (userAnswer && !isCorrect) return "text-red-500";
    return "text-cybergold-500";
  };
  const getStatusText = () => {
    if (isLocked) return "🔒 Låst i 30 sekunder";
    if (userAnswer && isCorrect) return "✓ Riktig!";
    if (userAnswer && !isCorrect) return `✗ Feil (${3 - attempts} forsøk igjen)`;
    return "";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-cybergold-300 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
      "Verifisering - Løs regnestykket:"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-cybergold-200 font-mono text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-cyberdark-800 px-3 py-2 rounded border border-cybergold-500/30", children: num1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "+" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-cyberdark-800 px-3 py-2 rounded border border-cybergold-500/30", children: num2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "text",
          value: userAnswer,
          onChange: (e) => handleAnswerChange(e.target.value),
          placeholder: "?",
          className: `w-20 text-center bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 ${isCorrect ? "border-green-500" : ""} ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`,
          disabled: isLoading || isLocked,
          maxLength: 10
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleRefresh,
          disabled: isLoading || isLocked,
          className: "p-2 text-cybergold-500 hover:text-cybergold-400 transition-colors disabled:opacity-50",
          title: "Ny oppgave",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" })
        }
      )
    ] }),
    (userAnswer || isLocked) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm ${getStatusColor()} flex items-center gap-1`, children: getStatusText() }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-red-400 flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
      error
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cyberdark-400", children: "Dette beskytter mot automatiserte angrep" })
  ] });
};
const FreeUserNavigation = () => {
  var _a;
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigationItems = [
    {
      path: "/basic-chat",
      label: "Chat",
      icon: MessageCircle,
      description: "Gratis chat for alle"
    },
    {
      path: "/profile",
      label: "Profil",
      icon: User,
      description: "Din profil"
    },
    {
      path: "/settings",
      label: "Innstillinger",
      icon: Settings,
      description: "Appinnstillinger"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-900 border-r border-cyberdark-700 w-64 h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-cyberdark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-cyberprimary-100 mb-1", children: "Snakkaz" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-300", children: "Velkommen!" }),
      user && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cyberdark-400 mt-1", children: (_a = user.email) == null ? void 0 : _a.split("@")[0] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-4 space-y-2", children: navigationItems.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: item.path, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: isActive ? "default" : "ghost",
          className: `w-full justify-start gap-3 h-auto p-3 ${isActive ? "bg-cyberprimary-600 hover:bg-cyberprimary-700 text-white" : "text-cyberdark-200 hover:text-cyberprimary-200 hover:bg-cyberdark-800"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: item.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-70", children: item.description })
            ] })
          ]
        }
      ) }, item.path);
    }) }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        onClick: () => signOut(),
        variant: "ghost",
        className: "w-full justify-start gap-2 text-cyberdark-300 hover:text-cyberdark-100 hover:bg-cyberdark-800",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
          "Logg ut"
        ]
      }
    ) })
  ] });
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const navigationSections = [
  {
    id: "main",
    title: "Hovedmeny",
    icon: ChartColumn,
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: ChartColumn,
        path: "/dashboard",
        description: "Oversikt med stats og aktivitet"
      }
    ]
  },
  {
    id: "chat-hub",
    title: "Chat Hub",
    icon: MessageCircle,
    items: [
      {
        id: "chat",
        label: "Chat",
        icon: MessageCircle,
        path: "/chat-new",
        badge: 3,
        description: "Private meldinger med brukere"
      },
      {
        id: "groups",
        label: "Grupper",
        icon: Users,
        path: "/groups",
        badge: 1,
        description: "Gruppe-chats og team samtaler"
      }
    ]
  },
  {
    id: "social",
    title: "Sosialt",
    icon: Users,
    items: [
      {
        id: "friends",
        label: "Venner",
        icon: Users,
        path: "/friends",
        description: "Venneliste og kontakter"
      },
      {
        id: "find-friends",
        label: "Finn Venner",
        icon: UserPlus,
        path: "/find-friends",
        description: "Finn nye venner og kontakter"
      }
    ]
  },
  {
    id: "services",
    title: "Tjenester",
    icon: Bot,
    items: [
      {
        id: "ai-assistant",
        label: "AI Assistent",
        icon: Bot,
        path: "/ai-assistant",
        description: "Kundeservice chatbot"
      },
      {
        id: "mail",
        label: "Mail",
        icon: Mail$1,
        path: "/mail",
        badge: 2,
        description: "E-post system"
      }
    ]
  },
  {
    id: "settings",
    title: "Innstillinger",
    icon: Settings,
    items: [
      {
        id: "profile",
        label: "Profil",
        icon: User,
        path: "/profile-new",
        description: "Din brukerprofil"
      },
      {
        id: "app-settings",
        label: "Innstillinger",
        icon: Settings,
        path: "/settings",
        description: "App-innstillinger"
      },
      {
        id: "info",
        label: "Info",
        icon: Info,
        path: "/info",
        description: "Generell informasjon"
      }
    ]
  },
  {
    id: "admin",
    title: "Admin",
    icon: Shield,
    adminOnly: true,
    items: [
      {
        id: "admin-panel",
        label: "Admin Panel",
        icon: Shield,
        path: "/admin",
        description: "Administrative kontroller",
        adminOnly: true
      },
      {
        id: "memory-mcp",
        label: "Memory (MCP)",
        icon: ChartColumn,
        path: "/admin/memory",
        description: "Memory management system",
        adminOnly: true
      }
    ]
  }
];
const mobileBottomTabs = [
  { id: "dashboard", label: "Home", icon: ChartColumn, path: "/dashboard" },
  { id: "chat", label: "Chat", icon: MessageCircle, path: "/chat-new", badge: 3 },
  { id: "friends", label: "Venner", icon: Users, path: "/friends" },
  { id: "menu", label: "Meny", icon: Menu, path: "/menu" }
];
const SmartMobileNav = ({
  isAdmin = false,
  userRole = "user"
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFullMenu, setShowFullMenu] = reactExports.useState(false);
  const visibleSections = navigationSections.filter(
    (section) => !section.adminOnly || isAdmin
  );
  const renderBottomNav = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "fixed bottom-0 left-0 right-0 z-50 bg-cyberdark-900/98 backdrop-blur-xl border-t border-cyberdark-700/50 shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-around px-2 py-1", children: mobileBottomTabs.map((tab) => {
      const isActive = tab.id === "menu" ? showFullMenu : location.pathname.startsWith(tab.path);
      const Icon = tab.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            if (tab.id === "menu") {
              setShowFullMenu(!showFullMenu);
            } else {
              navigate(tab.path);
            }
          },
          className: cn(
            "flex flex-col items-center justify-center relative group",
            "min-h-[60px] min-w-[60px] px-3 py-2",
            "transition-all duration-300 ease-out",
            "active:scale-90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cybergold-500 focus-visible:rounded-lg",
            isActive ? "text-cybergold-400" : "text-cyberdark-300 hover:text-cyberdark-100"
          ),
          children: [
            isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-1 inset-y-1 bg-cybergold-500/10 rounded-lg border border-cybergold-500/20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Icon,
                {
                  size: 22,
                  className: cn(
                    "transition-all duration-300",
                    isActive && "scale-110 drop-shadow-sm"
                  )
                }
              ),
              tab.badge && tab.badge > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium shadow-lg", children: tab.badge > 99 ? "99+" : tab.badge })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
              "text-xs font-medium mt-1 transition-all duration-300 relative z-10",
              isActive ? "opacity-100 text-cybergold-400" : "opacity-70"
            ), children: tab.label })
          ]
        },
        tab.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-safe h-1" })
  ] });
  const renderFullMenu = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
    "fixed inset-0 z-60 bg-cyberdark-950/95 backdrop-blur-xl transition-all duration-300",
    showFullMenu ? "opacity-100" : "opacity-0 pointer-events-none"
  ), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 bg-cyberdark-900/95 backdrop-blur-md border-b border-cyberdark-700 px-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-cybergold-400", children: "SnakkaZ Meny" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowFullMenu(false),
            className: "p-2 text-cyberdark-300 hover:text-white transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 })
          }
        )
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-cybergold-400 bg-cybergold-500/10 px-3 py-1 rounded-full inline-block", children: "👑 Admin Access" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-6 space-y-8 pb-24", children: visibleSections.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(section.icon, { size: 20, className: "text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: section.title }),
        section.adminOnly && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded", children: "ADMIN" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: section.items.filter((item) => !item.adminOnly || isAdmin).map((item) => {
        const isActive = location.pathname === item.path;
        const ItemIcon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              navigate(item.path);
              setShowFullMenu(false);
            },
            className: cn(
              "w-full bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700",
              "flex items-center space-x-4",
              "transition-all duration-200",
              "active:bg-cyberdark-700",
              isActive && "border-cybergold-500/50 bg-cybergold-500/5"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ItemIcon,
                  {
                    size: 24,
                    className: cn(
                      "transition-colors",
                      isActive ? "text-cybergold-400" : "text-cyberdark-300"
                    )
                  }
                ),
                item.badge && item.badge > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center font-medium", children: item.badge > 99 ? "99+" : item.badge })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: cn(
                  "font-medium",
                  isActive ? "text-cybergold-400" : "text-white"
                ), children: item.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyberdark-400", children: item.description })
              ] }),
              item.adminOnly && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded", children: "ADMIN" })
            ]
          },
          item.id
        );
      }) })
    ] }, section.id)) })
  ] }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    renderBottomNav(),
    renderFullMenu(),
    !showFullMenu && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-20 right-4 z-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: cn(
          "bg-cybergold-500 hover:bg-cybergold-400 text-cyberdark-900",
          "w-14 h-14 rounded-full shadow-2xl",
          "flex items-center justify-center",
          "transition-all duration-300 ease-out",
          "active:scale-90 hover:scale-105",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cybergold-300"
        ),
        onClick: () => alert("🚀 Quick actions: Ny chat, Ny gruppe, Søk"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 24, className: "font-bold" })
      }
    ) })
  ] });
};
const MobileChatHeader = ({
  title,
  subtitle,
  avatarUrl,
  isOnline,
  memberCount,
  isGroup,
  isSecure,
  onBack,
  onCall,
  onVideoCall,
  onOptions
}) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 bg-cyberdark-900/95 backdrop-blur-md border-b border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-safe", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: handleBack,
          className: "p-2 -ml-2 hover:bg-cyberdark-800",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20, className: "text-cyberdark-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-10 h-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarUrl, alt: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-cybergold-500/20 text-cybergold-400", children: isGroup ? /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16 }) : title.charAt(0).toUpperCase() })
        ] }),
        isOnline && !isGroup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-cyberdark-900 rounded-full" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-white font-semibold truncate", children: title }),
          isSecure && /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 14, className: "text-cybergold-400 flex-shrink-0" })
        ] }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-300 text-sm truncate", children: isGroup && memberCount ? `${memberCount} members` : subtitle })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
      onCall && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onCall,
          className: "p-2 hover:bg-cyberdark-800",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 20, className: "text-cyberdark-300" })
        }
      ),
      onVideoCall && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onVideoCall,
          className: "p-2 hover:bg-cyberdark-800",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { size: 20, className: "text-cyberdark-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onOptions,
          className: "p-2 hover:bg-cyberdark-800",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { size: 20, className: "text-cyberdark-300" })
        }
      )
    ] })
  ] }) }) });
};
const UnifiedLayout = ({
  children,
  title = "SnakkaZ",
  subtitle = "Secure Chat Platform",
  showHeader = true,
  showNavigation = true,
  headerActions = {}
}) => {
  var _a, _b;
  const { user } = useAuth();
  const isMobile2 = useIsMobile();
  const isAdmin = ((_a = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a.role) === "admin" || ((_b = user == null ? void 0 : user.app_metadata) == null ? void 0 : _b.role) === "admin" || false;
  if (!isMobile2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cyberdark-950", children });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen bg-cyberdark-950", children: [
    showHeader && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MobileChatHeader,
      {
        title,
        subtitle,
        isOnline: !!user,
        isSecure: true,
        onCall: headerActions.onCall || (() => alert("📞 Call funksjon")),
        onVideoCall: headerActions.onVideoCall || (() => alert("📹 Video call funksjon")),
        onOptions: headerActions.onOptions || (() => alert("⚙️ Innstillinger"))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: cn(
      showHeader && "pt-16",
      // Header space
      showNavigation && "pb-24",
      // Navigation space
      "min-h-screen",
      "mobile-theme-dark"
    ), children }),
    showNavigation && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SmartMobileNav,
      {
        isAdmin,
        userRole: isAdmin ? "admin" : "user"
      }
    )
  ] });
};
const tabs$1 = [
  {
    id: "chats",
    label: "Chats",
    icon: MessageCircle,
    path: "/chat",
    badge: 3
  },
  {
    id: "friends",
    label: "Friends",
    icon: Users,
    path: "/friends"
  },
  {
    id: "groups",
    label: "Groups",
    icon: UserPlus,
    path: "/groups"
  },
  {
    id: "profile",
    label: "Me",
    icon: Settings,
    path: "/profile"
  }
];
const MobileBottomNav = () => {
  const location = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 left-0 right-0 z-50 bg-cyberdark-900/95 backdrop-blur-md border-t border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-safe", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-around px-4 py-2", children: tabs$1.map((tab) => {
    const isActive = location.pathname.startsWith(tab.path);
    const Icon = tab.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: tab.path,
        className: cn(
          "flex flex-col items-center justify-center relative",
          "min-h-[56px] min-w-[56px] px-2 py-1",
          "transition-all duration-200 ease-out",
          "active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cybergold-500",
          isActive ? "text-cybergold-400" : "text-cyberdark-300 hover:text-cyberdark-100"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Icon,
              {
                size: 24,
                className: cn(
                  "transition-all duration-200",
                  isActive && "scale-110"
                )
              }
            ),
            tab.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium", children: tab.badge > 99 ? "99+" : tab.badge })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
            "text-xs font-medium mt-1 transition-all duration-200",
            isActive ? "opacity-100" : "opacity-70"
          ), children: tab.label })
        ]
      },
      tab.id
    );
  }) }) }) });
};
const tabs = [
  {
    id: "chats",
    label: "Chats",
    icon: MessageCircle,
    path: "/chat",
    badge: 3,
    description: "Private meldinger og samtaler"
  },
  {
    id: "groups",
    label: "Grupper",
    icon: Hash,
    path: "/groups",
    badge: 1,
    description: "Fellesskap og team-chats"
  },
  {
    id: "contacts",
    label: "Kontakter",
    icon: Users,
    path: "/contacts",
    description: "Venner og kontakter"
  },
  {
    id: "profile",
    label: "Profil",
    icon: User,
    path: "/profile",
    description: "Din profil og innstillinger"
  }
];
const MobileBottomNavImproved = () => {
  const location = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "fixed bottom-0 left-0 right-0 z-50 bg-cyberdark-900/98 backdrop-blur-xl border-t border-cyberdark-700/50 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-around px-2 py-1", children: tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path);
        const Icon = tab.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: tab.path,
            className: cn(
              "flex flex-col items-center justify-center relative group",
              "min-h-[60px] min-w-[60px] px-3 py-2",
              "transition-all duration-300 ease-out",
              "active:scale-90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cybergold-500 focus-visible:rounded-lg",
              isActive ? "text-cybergold-400" : "text-cyberdark-300 hover:text-cyberdark-100"
            ),
            children: [
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-1 inset-y-1 bg-cybergold-500/10 rounded-lg border border-cybergold-500/20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon,
                  {
                    size: 22,
                    className: cn(
                      "transition-all duration-300",
                      isActive && "scale-110 drop-shadow-sm"
                    )
                  }
                ),
                tab.badge && tab.badge > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium shadow-lg", children: tab.badge > 99 ? "99+" : tab.badge })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                "text-xs font-medium mt-1 transition-all duration-300 relative z-10",
                isActive ? "opacity-100 text-cybergold-400" : "opacity-70"
              ), children: tab.label })
            ]
          },
          tab.id
        );
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-safe h-1" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-20 right-4 z-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: cn(
          "bg-cybergold-500 hover:bg-cybergold-400 text-cyberdark-900",
          "w-14 h-14 rounded-full shadow-2xl",
          "flex items-center justify-center",
          "transition-all duration-300 ease-out",
          "active:scale-90 hover:scale-105",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cybergold-300"
        ),
        onClick: () => alert("🚀 Quick actions: Ny chat, Ny gruppe, Legg til kontakt"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 24, className: "font-bold" })
      }
    ) })
  ] });
};
const SnakkaZInviteSystem = ({
  className,
  variant = "button",
  showStats = true
}) => {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [inviteLink, setInviteLink] = reactExports.useState("");
  const [qrCodeUrl, setQrCodeUrl] = reactExports.useState("");
  const [customMessage, setCustomMessage] = reactExports.useState("");
  const [referralCode, setReferralCode] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState(false);
  const [inviteStats, setInviteStats] = reactExports.useState({
    sent: 0,
    joined: 0,
    bonus: 0
  });
  const { user } = useAuth();
  const { toast } = useToast();
  reactExports.useEffect(() => {
    if (user == null ? void 0 : user.id) {
      const code = user.id.slice(-8).toUpperCase();
      setReferralCode(code);
    }
  }, [user]);
  reactExports.useEffect(() => {
    const baseUrl = window.location.origin;
    const linkParams = new URLSearchParams({
      ref: referralCode,
      source: "app-invite"
    });
    const link = `${baseUrl}/beta-chat?${linkParams.toString()}`;
    setInviteLink(link);
    browser.toDataURL(link, {
      width: 200,
      margin: 2,
      color: {
        dark: "#D4AF37",
        light: "#1A1B23"
      }
    }).then(setQrCodeUrl);
  }, [referralCode]);
  reactExports.useEffect(() => {
    if (!customMessage) {
      setCustomMessage(
        `🚀 Bli med meg på SnakkaZ Beta - den nye generasjonen chat!

✨ End-to-end kryptering
💎 AI-assistert chat
🎮 Interaktive funksjoner
🔒 100% privat og sikkert

Vi får begge bonuser når du registrerer deg! 🎁`
      );
    }
  }, [customMessage]);
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
      toast({
        title: `${label} kopiert! 🎉`,
        description: "Invitasjonslenken er kopiert til utklippstavlen."
      });
    } catch (error) {
      toast({
        title: "Kunne ikke kopiere",
        description: "Prøv å kopiere manuelt.",
        variant: "destructive"
      });
    }
  };
  const shareVia = (platform) => {
    const fullMessage = `${customMessage}

${inviteLink}`;
    let shareUrl = "";
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(customMessage)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}&quote=${encodeURIComponent(customMessage)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(customMessage)}&url=${encodeURIComponent(inviteLink)}&hashtags=SnakkaZBeta,SecureChat`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteLink)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent("Bli med på SnakkaZ Beta!")}&body=${encodeURIComponent(fullMessage)}`;
        break;
      case "sms":
        shareUrl = `sms:?body=${encodeURIComponent(fullMessage)}`;
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank");
      setInviteStats((prev) => ({ ...prev, sent: prev.sent + 1 }));
    }
  };
  const InviteContent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-6 w-6 text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold bg-gradient-to-r from-cybergold-400 to-cyberblue-400 bg-clip-text text-transparent", children: "Del SnakkaZ Beta" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-6 w-6 text-cybergold-400" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300", children: "Inviter venner og få bonuser når de blir med!" })
    ] }),
    showStats && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 p-4 rounded-lg text-center border border-cybergold-500/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-cybergold-400", children: inviteStats.sent }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cybergold-500", children: "Invitasjoner sendt" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 p-4 rounded-lg text-center border border-green-500/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-400", children: inviteStats.joined }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cybergold-500", children: "Venner registrert" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyberdark-800 p-4 rounded-lg text-center border border-purple-500/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-purple-400", children: inviteStats.bonus }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-cybergold-500", children: "Bonus poeng" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-cybergold-300", children: "Din invitasjonsmelding" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          value: customMessage,
          onChange: (e) => setCustomMessage(e.target.value),
          className: "bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 min-h-[120px] text-sm",
          placeholder: "Skriv en personlig melding..."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-cybergold-500/10 to-cyberblue-500/10 p-4 rounded-lg border border-cybergold-500/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5 text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-cybergold-300", children: "Din referansekode" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: referralCode,
            readOnly: true,
            className: "bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 font-mono text-lg text-center font-bold"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => copyToClipboard(referralCode, "Referansekode"),
            variant: "outline",
            size: "sm",
            className: "border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
            children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-500 mt-2", children: "Både du og dine venner får bonuser når de registrerer seg med din kode! 🎁" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-cybergold-300", children: "Invitasjonslenke" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: inviteLink,
            readOnly: true,
            className: "bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 font-mono text-sm"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => copyToClipboard(inviteLink, "Lenke"),
            variant: "outline",
            size: "sm",
            className: "border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
            children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-cybergold-300", children: "QR-kode for rask deling" }),
      qrCodeUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block p-4 bg-white rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: qrCodeUrl,
          alt: "SnakkaZ Beta QR-kode",
          className: "mx-auto"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => copyToClipboard(qrCodeUrl, "QR-kode"),
          variant: "outline",
          size: "sm",
          className: "border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4 mr-2" }),
            "Kopier QR-kode"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-cybergold-300", children: "Del direkte til:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("whatsapp"),
            className: "bg-green-600 hover:bg-green-700 text-white",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4 mr-2" }),
              "WhatsApp"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("telegram"),
            className: "bg-blue-500 hover:bg-blue-600 text-white",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
              "Telegram"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("facebook"),
            className: "bg-blue-600 hover:bg-blue-700 text-white",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { className: "h-4 w-4 mr-2" }),
              "Facebook"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("twitter"),
            className: "bg-sky-500 hover:bg-sky-600 text-white",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "h-4 w-4 mr-2" }),
              "Twitter"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("email"),
            variant: "outline",
            className: "border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$1, { className: "h-4 w-4 mr-2" }),
              "E-post"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("sms"),
            variant: "outline",
            className: "border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4 mr-2" }),
              "SMS"
            ]
          }
        )
      ] }),
      navigator.share && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => {
            navigator.share({
              title: "SnakkaZ Beta - Sikker Chat",
              text: customMessage,
              url: inviteLink
            });
          },
          className: "w-full bg-gradient-to-r from-cybergold-600 to-cyberblue-600 hover:from-cybergold-500 hover:to-cyberblue-500 text-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4 mr-2" }),
            "Del med andre apper"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-cybergold-500/5 to-cyberblue-500/5 p-4 rounded-lg border border-cybergold-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-medium text-cybergold-300 mb-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4" }),
        "Hvorfor SnakkaZ Beta?"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-cybergold-400 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
          "Raskeste og sikreste chat-app"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
          "AI-assistert kommunikasjon"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
          "End-to-end kryptering"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
          "Beta-tilgang til nye funksjoner"
        ] })
      ] })
    ] })
  ] });
  if (variant === "card") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn$1("bg-cyberdark-900 border-cybergold-500/30", className), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-cybergold-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-5 w-5" }),
          "Inviter venner til SnakkaZ Beta"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-cybergold-300", children: "Del appen og få bonuser sammen!" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(InviteContent, {}) })
    ] });
  }
  if (variant === "floating") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn$1("fixed bottom-6 right-6 z-50", className), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "lg",
          className: "rounded-full h-14 w-14 bg-gradient-to-r from-cybergold-600 to-cyberblue-600 hover:from-cybergold-500 hover:to-cyberblue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-6 w-6" })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg bg-cyberdark-900 border-cybergold-500/30 max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-cybergold-400", children: "Del SnakkaZ Beta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-cybergold-300", children: "Inviter venner og familie til den sikreste chat-appen!" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InviteContent, {})
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        className: cn$1(
          "bg-gradient-to-r from-cybergold-600 to-cyberblue-600 hover:from-cybergold-500 hover:to-cyberblue-500 text-white",
          className
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4 mr-2" }),
          "Inviter venner"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg bg-cyberdark-900 border-cybergold-500/30 max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-cybergold-400", children: "Del SnakkaZ Beta" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-cybergold-300", children: "Inviter venner og familie til den sikreste chat-appen!" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InviteContent, {})
    ] })
  ] });
};
const SnakkaZLogo = ({
  variant = "header",
  animated = true,
  showCreature = true,
  className = ""
}) => {
  const [isHovered, setIsHovered] = reactExports.useState(false);
  const [creaturePhase, setCreaturePhase] = reactExports.useState("🐛");
  reactExports.useEffect(() => {
    if (!animated) return;
    const phases = ["🐛", "🦋", "✨"];
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % phases.length;
      setCreaturePhase(phases[currentIndex]);
    }, 3e3);
    return () => clearInterval(interval);
  }, [animated]);
  const handleCreatureClick = () => {
    const phases = ["🐛", "🦋", "✨"];
    const currentIndex = phases.indexOf(creaturePhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    setCreaturePhase(phases[nextIndex]);
  };
  const baseClasses = "flex items-center gap-2 font-bold";
  const variantClasses = {
    header: "text-xl",
    hero: "text-4xl",
    compact: "text-lg"
  };
  const logoText = variant === "hero" ? "SnakkaZ Chat Beta" : "SnakkaZ";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `${baseClasses} ${variantClasses[variant]} ${className}`,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        showCreature && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleCreatureClick,
            className: `
            text-2xl transition-all duration-300 cursor-pointer
            ${animated ? "hover:scale-110" : ""}
            ${isHovered ? "animate-pulse" : ""}
          `,
            title: "Klikk for å utvikle SnakkaZ-skapningen!",
            children: creaturePhase
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `
        liquid-text bg-gradient-to-r from-cybergold-400 to-cyberblue-400 
        bg-clip-text text-transparent
        ${animated && isHovered ? "animate-pulse" : ""}
      `, children: logoText }),
        variant !== "compact" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "border-cybergold-500/50 text-cybergold-400 text-xs",
              children: "BETA"
            }
          ),
          animated && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Sparkles,
            {
              className: `
                w-4 h-4 text-cybergold-400 
                ${isHovered ? "animate-spin" : ""}
              `
            }
          )
        ] }),
        animated && isHovered && variant === "hero" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cybergold-500/20 to-cyberblue-500/20 rounded-lg animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "absolute top-2 right-2 w-6 h-6 text-cybergold-400 animate-bounce" })
        ] })
      ]
    }
  );
};
const MobileMenu = ({ isOpen, setIsOpen }) => {
  var _a;
  const isMobile2 = useIsMobile();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const navigationItems = [
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 24 }),
      label: "Hjem",
      action: () => {
        navigate("/");
        setIsOpen(false);
      },
      color: "text-cybergold-400"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 24 }),
      label: "Chat",
      action: () => {
        navigate("/basic-chat");
        setIsOpen(false);
      },
      color: "text-cyberblue-400"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 24 }),
      label: "Venner",
      action: () => {
        navigate("/friends");
        setIsOpen(false);
      },
      color: "text-cyberred-400",
      authRequired: true
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { size: 24 }),
      label: "AI Assistent",
      action: () => {
        navigate("/ai-chat");
        setIsOpen(false);
      },
      color: "text-cyberprimary-400",
      authRequired: true
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 24 }),
      label: "Grupper",
      action: () => {
        navigate("/group-chat");
        setIsOpen(false);
      },
      color: "text-cybergreen-400",
      authRequired: true
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 24 }),
      label: "Profil",
      action: () => {
        navigate("/profile");
        setIsOpen(false);
      },
      color: "text-cybergold-400",
      authRequired: true
    }
  ];
  const settingsItems = [
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 24 }),
      label: "Sikkerhet",
      action: () => {
        navigate("/settings");
        setIsOpen(false);
      },
      color: "text-cybergreen-400",
      authRequired: true
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 24 }),
      label: "Innstillinger",
      action: () => {
        navigate("/settings");
        setIsOpen(false);
      },
      color: "text-cyberdark-400"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 24 }),
      label: "Logg ut",
      action: () => {
        signOut();
        setIsOpen(false);
      },
      color: "text-cyberred-400",
      authRequired: true
    }
  ];
  const filteredNavItems = navigationItems.filter((item) => !item.authRequired || user);
  const filteredSettingsItems = settingsItems.filter((item) => !item.authRequired || user);
  if (!isMobile2) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence$1, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "fixed inset-0 bg-black/50 z-40",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        onClick: () => setIsOpen(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "fixed bottom-0 left-0 right-0 bg-cyberdark-900 rounded-t-2xl z-50 px-4 py-6 shadow-lg border-t border-cyberdark-700 max-h-[80vh] overflow-y-auto",
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { type: "spring", damping: 25, stiffness: 200 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1 rounded-full bg-cyberdark-600 mx-auto mb-6" }),
          user && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6 p-3 bg-cyberdark-800 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-cybergold-600 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 20, className: "text-black" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-400 font-medium", children: ((_a = user.user_metadata) == null ? void 0 : _a.username) || "Bruker" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyberdark-400 text-sm truncate", children: user.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cybergold-400 font-medium mb-3 px-2", children: "Navigasjon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: filteredNavItems.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center p-3 rounded-lg bg-cyberdark-800/50 hover:bg-cyberdark-800 transition-colors cursor-pointer",
                onClick: item.action,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-full bg-cyberdark-700 flex items-center justify-center mb-2 ${item.color}`, children: item.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cybergold-300 text-center", children: item.label })
                ]
              },
              index
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-cybergold-400 font-medium mb-3 px-2", children: "Innstillinger" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filteredSettingsItems.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: `w-full flex items-center gap-3 p-3 rounded-lg bg-cyberdark-800/50 hover:bg-cyberdark-800 transition-colors text-left ${item.color}`,
                onClick: item.action,
                children: [
                  item.icon,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-300", children: item.label })
                ]
              },
              index
            )) })
          ] })
        ]
      }
    )
  ] }) });
};
const AppHeader = ({
  variant = "default",
  context,
  title,
  subtitle,
  avatar,
  actions,
  onBackClick,
  onMenuClick,
  onAddClick,
  children,
  className
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: `bg-cyberdark-900 border-b border-cyberdark-700 p-3 flex items-center ${className || ""}`, children: [
    onMenuClick && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "mr-2 rounded-full h-9 w-9 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800",
        onClick: onMenuClick,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Meny" })
        ]
      }
    ),
    onBackClick && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "mr-2 rounded-full h-9 w-9 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800 lg:hidden",
        onClick: onBackClick,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Tilbake" })
        ]
      }
    ),
    avatar && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mr-3", children: avatar }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-cybergold-400 truncate", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-600 truncate", children: subtitle })
    ] }),
    onAddClick && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "mr-2 rounded-full h-9 w-9 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800",
        onClick: onAddClick,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Legg til" })
        ]
      }
    ),
    actions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-1", children: actions }),
    children && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children })
  ] });
};
const UnifiedNavigation = ({
  variant = "horizontal",
  className,
  activeIndicator = true,
  compact = false,
  showLabels = true,
  onItemSelect
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile2 = useIsMobile();
  const isAdmin = useIsAdmin();
  const [hoveredItem, setHoveredItem] = reactExports.useState(null);
  const navRef = reactExports.useRef(null);
  const activeIndicatorRef = reactExports.useRef(null);
  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-5 w-5" }),
      authRequired: true
    },
    {
      path: "/basic-chat",
      label: "Chat Hub",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5" }),
      authRequired: true
    },
    {
      path: "/ai-chat",
      label: "AI Assistent",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-5 w-5" }),
      authRequired: true
    },
    {
      path: "/group-chat",
      label: "Grupper",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
      authRequired: true
    },
    {
      path: "/friends",
      label: "Venner",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-5 w-5" }),
      authRequired: true
    },
    {
      path: "/mail",
      label: "Mail",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$1, { className: "h-5 w-5" }),
      authRequired: true
    },
    {
      path: "/memory",
      label: "Memory",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-5 w-5" }),
      authRequired: true,
      hideOnMobile: true
    },
    {
      path: "/find-friends",
      label: "Finn Venner",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5" }),
      authRequired: true,
      hideOnMobile: true
    },
    {
      path: "/profile",
      label: "Profil",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }),
      authRequired: true
    },
    {
      path: "/settings",
      label: "Innstillinger",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5" }),
      authRequired: true,
      hideOnMobile: true
    },
    {
      path: "/info",
      label: "Info",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-5 w-5" })
    },
    {
      path: "/admin",
      label: "Admin",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5" }),
      adminRequired: true
    }
  ];
  const filteredNavItems = navItems.filter((item) => {
    if (item.authRequired && !user) return false;
    if (item.adminRequired && !isAdmin) return false;
    if (item.hideOnMobile && isMobile2) return false;
    return true;
  });
  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    } else if (path === "/basic-chat" && (location.pathname.startsWith("/basic-chat") || location.pathname.startsWith("/chat"))) {
      return true;
    } else if (path === "/messages" && location.pathname.startsWith("/messages")) {
      return true;
    } else {
      return location.pathname.startsWith(path);
    }
  };
  const updateActiveIndicator = reactExports.useCallback(() => {
    if (!navRef.current || !activeIndicatorRef.current) return;
    const activeButton = navRef.current.querySelector(".nav-active");
    if (activeButton) {
      const rect = activeButton.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      if (variant === "horizontal") {
        activeIndicatorRef.current.style.width = `${rect.width}px`;
        activeIndicatorRef.current.style.height = "2px";
        activeIndicatorRef.current.style.left = `${rect.left - navRect.left}px`;
        activeIndicatorRef.current.style.top = "auto";
        activeIndicatorRef.current.style.bottom = "0";
      } else if (variant === "vertical") {
        activeIndicatorRef.current.style.width = "2px";
        activeIndicatorRef.current.style.height = `${rect.height}px`;
        activeIndicatorRef.current.style.left = "0";
        activeIndicatorRef.current.style.top = `${rect.top - navRect.top}px`;
      } else {
        activeIndicatorRef.current.style.width = `${rect.width}px`;
        activeIndicatorRef.current.style.height = "2px";
        activeIndicatorRef.current.style.left = `${rect.left - navRect.left}px`;
        activeIndicatorRef.current.style.top = "0";
        activeIndicatorRef.current.style.bottom = "auto";
      }
      activeIndicatorRef.current.style.opacity = "1";
    } else {
      activeIndicatorRef.current.style.opacity = "0";
    }
  }, [variant]);
  reactExports.useEffect(() => {
    if (activeIndicator) {
      updateActiveIndicator();
    }
  }, [location.pathname, activeIndicator, updateActiveIndicator]);
  const handleNavItemHover = (path) => {
    setHoveredItem(path);
  };
  const handleNavItemLeave = () => {
    setHoveredItem(null);
  };
  const handleItemClick = (path) => {
    navigate(path);
    if (onItemSelect) {
      onItemSelect();
    }
  };
  const containerClasses = cn$1(
    "relative",
    variant === "horizontal" && "flex items-center gap-1 p-0.5",
    variant === "vertical" && "flex flex-col gap-2 p-0.5",
    variant === "bottom" && "fixed bottom-0 left-0 right-0 bg-cyberdark-900 border-t border-cyberdark-700 p-2 flex items-center justify-around",
    variant === "mobile" && "fixed bottom-0 left-0 right-0 bg-cyberdark-900 border-t border-cyberdark-700 px-2 pt-3 pb-4 mobile-bottom-safe flex items-center justify-around z-50 shadow-lg backdrop-blur-sm",
    // Enhanced mobile touch targets
    (variant === "mobile" || variant === "bottom") && "min-h-[60px]",
    className
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "nav",
    {
      ref: navRef,
      className: containerClasses,
      "aria-label": "Main Navigation",
      children: [
        filteredNavItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          NavButton,
          {
            path: item.path,
            icon: item.icon,
            label: item.label,
            isActive: isActive(item.path),
            onHover: handleNavItemHover,
            onLeave: handleNavItemLeave,
            isHovered: hoveredItem === item.path,
            onClick: () => handleItemClick(item.path),
            adminButton: item.adminRequired,
            variant,
            compact,
            showLabel: showLabels
          },
          item.path
        )),
        activeIndicator && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: activeIndicatorRef,
            className: "absolute bg-gradient-to-r from-cybergold-400 to-cybergold-500 rounded-full transition-all duration-300 ease-in-out shadow-[0_0_5px_rgba(218,188,69,0.5)]"
          }
        )
      ]
    }
  );
};
const NavButton = ({
  path,
  icon,
  label,
  isActive,
  onHover,
  onLeave,
  isHovered,
  onClick,
  adminButton = false,
  variant,
  compact = false,
  showLabel = true
}) => {
  const buttonClasses = cn$1(
    "group transition-all duration-200 relative flex items-center",
    isActive ? "nav-active" : "",
    // Horizontal variant styling
    variant === "horizontal" && "px-3 py-2 rounded-md gap-2",
    variant === "horizontal" && isActive && "bg-gradient-to-b from-cyberdark-800 to-cyberdark-850",
    variant === "horizontal" && !isActive && "hover:bg-cyberdark-800/40",
    // Vertical variant styling
    variant === "vertical" && "px-3 py-2 rounded-md w-full gap-3 justify-start",
    variant === "vertical" && isActive && "bg-gradient-to-r from-cyberdark-800 to-cyberdark-850",
    variant === "vertical" && !isActive && "hover:bg-cyberdark-800/40",
    // Bottom/Mobile variant styling - Enhanced for better touch UX
    (variant === "bottom" || variant === "mobile") && "flex-col items-center p-3 gap-1 w-full min-h-[48px] touch-manipulation",
    (variant === "bottom" || variant === "mobile") && "active:scale-95 transition-transform duration-150",
    // Compact mode
    compact && "p-1.5",
    // Text colors
    isActive ? adminButton ? "text-emerald-400" : "text-cybergold-400" : adminButton ? "text-emerald-600 hover:text-emerald-400" : "text-cybergold-600 hover:text-cybergold-400"
  );
  const iconClasses = cn$1(
    "transition-transform",
    variant !== "bottom" && variant !== "mobile" && "group-hover:scale-110",
    compact ? "h-4 w-4" : "h-5 w-5",
    isActive ? adminButton ? "text-emerald-400" : "text-cybergold-400" : adminButton ? "text-emerald-600" : "text-cybergold-600",
    (variant === "mobile" || variant === "bottom") && isActive && "animate-pulse-subtle"
  );
  const labelClasses = cn$1(
    "font-medium transition-all",
    compact ? "text-xs" : "text-sm",
    isActive ? adminButton ? "text-emerald-400" : "text-cybergold-400" : adminButton ? "text-emerald-600" : "text-cybergold-600",
    variant === "bottom" || variant === "mobile" ? "text-xs mt-1" : "",
    variant === "horizontal" && !showLabel && "hidden",
    variant === "horizontal" && showLabel && "hidden sm:block"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      className: buttonClasses,
      onClick,
      onMouseEnter: () => onHover(path),
      onMouseLeave: onLeave,
      "aria-label": label,
      "aria-current": isActive ? "page" : void 0,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: iconClasses, children: icon }),
        showLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: labelClasses, children: label }),
        isActive && (variant !== "bottom" && variant !== "mobile") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-cybergold-400 shadow-[0_0_5px_rgba(218,188,69,0.8)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn$1(
          "absolute inset-0 rounded-md opacity-0 transition-opacity duration-300",
          isHovered && !isActive ? "opacity-10" : "",
          adminButton ? "bg-emerald-500" : "bg-cybergold-400"
        ) })
      ]
    }
  );
};
const MobileLayout = ({ children }) => {
  const isMobile2 = useIsMobile();
  useDeviceDetection();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("SnakkaZ");
  const { isLocked, verifyPin } = useMobilePinSecurity();
  const [pinInput, setPinInput] = reactExports.useState("");
  reactExports.useEffect(() => {
    const path = location.pathname;
    if (path.includes("/basic-chat") || path.includes("/chat")) {
      setTitle("Chat");
    } else if (path.includes("/friends")) {
      setTitle("Venner");
    } else if (path.includes("/ai-chat")) {
      setTitle("AI Assistent");
    } else if (path.includes("/global-chat")) {
      setTitle("Global Chat");
    } else if (path.includes("/settings")) {
      setTitle("Innstillinger");
    } else if (path.includes("/security")) {
      setTitle("Sikkerhet");
    } else if (path.includes("/profile")) {
      setTitle("Profil");
    } else {
      setTitle("SnakkaZ");
    }
  }, [location]);
  const handlePinSubmit = () => {
    if (pinInput.length === 4) {
      if (verifyPin(pinInput)) {
        setPinInput("");
      } else {
        setPinInput("");
      }
    }
  };
  const handlePinDigit = (digit) => {
    if (pinInput.length < 4) {
      const newPin = pinInput + digit;
      setPinInput(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          handlePinSubmit();
        }, 200);
      }
    }
  };
  const handlePinDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };
  if (!isMobile2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
  }
  if (isLocked) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-[100svh] bg-background p-6 mobile-safe-padding", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold mb-8", children: "Lås opp SnakkaZ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 mb-8", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-4 h-4 rounded-full ${i < pinInput.length ? "bg-primary" : "bg-muted"}`
        },
        i
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 w-full max-w-xs", children: [
        [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-2xl font-medium mobile-touch-target",
            onClick: () => handlePinDigit(num.toString()),
            children: num
          },
          num
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16" }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-2xl font-medium mobile-touch-target",
            onClick: () => handlePinDigit("0"),
            children: "0"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mobile-touch-target",
            onClick: handlePinDelete,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 19l-7-7 7-7" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 12H5" })
            ] })
          }
        )
      ] })
    ] });
  }
  const handleMenuOpen = () => setMenuOpen(true);
  const handleAddNew = () => {
    const path = location.pathname;
    if (path.includes("/basic-chat") || path.includes("/chat")) {
      navigate("/friends");
    } else if (path.includes("/friends")) {
      navigate("/basic-chat");
    }
  };
  const hideNavigation = location.pathname.includes("/chat/") || location.pathname.includes("/conversation/");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-[100svh] bg-cyberdark-950 mobile-dynamic-height", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppHeader,
      {
        variant: "default",
        title,
        onMenuClick: handleMenuOpen,
        onAddClick: location.pathname === "/messages" || location.pathname === "/basic-chat" ? handleAddNew : void 0,
        className: "mobile-top-safe border-b border-cyberdark-700 bg-cyberdark-900"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-1 overflow-hidden ${!hideNavigation ? "pb-16" : ""}`, children }),
    !hideNavigation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 z-50 bg-cyberdark-900 border-t border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UnifiedNavigation, { variant: "mobile" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileMenu, { isOpen: menuOpen, setIsOpen: setMenuOpen })
  ] });
};
const FriendSearch = ({
  searchUsername,
  setSearchUsername,
  onSearch,
  searchResults,
  onSendFriendRequest
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: searchUsername,
            onChange: (e) => setSearchUsername(e.target.value),
            placeholder: "Søk etter brukernavn",
            className: "w-full px-3 py-2 bg-cyberdark-800 border border-cybergold-500/30 rounded-md text-cybergold-200 placeholder:text-cyberdark-400"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute right-3 top-2.5 h-4 w-4 text-cyberdark-400" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onSearch,
          variant: "outline",
          className: "border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10",
          children: "Søk"
        }
      )
    ] }),
    searchResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-10 w-full mt-1 bg-cyberdark-800 border border-cybergold-500/30 rounded-md shadow-lg", children: searchResults.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between p-2 hover:bg-cyberdark-700",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-200", children: user.username || user.full_name || "Ukjent bruker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => onSendFriendRequest(user.id),
              size: "sm",
              variant: "outline",
              className: "border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4" })
            }
          )
        ]
      },
      user.id
    )) })
  ] });
};
const FriendsSearchSection = ({
  currentUserId,
  onSendFriendRequest,
  existingFriends = []
}) => {
  const [searchUsername, setSearchUsername] = reactExports.useState("");
  const [searchResults, setSearchResults] = reactExports.useState([]);
  const { toast } = useToast();
  const handleSearch = async () => {
    if (!searchUsername.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const { data, error } = await supabase.from("profiles").select("id, username, full_name").ilike("username", `%${searchUsername}%`).limit(5);
      if (error) throw error;
      const filteredResults = (data == null ? void 0 : data.filter(
        (profile) => profile.id !== currentUserId && !existingFriends.includes(profile.id)
      )) || [];
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Søkefeil",
        description: "Kunne ikke søke etter brukere",
        variant: "destructive"
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FriendSearch,
    {
      searchUsername,
      setSearchUsername,
      onSearch: handleSearch,
      searchResults,
      onSendFriendRequest
    }
  );
};
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return name.charAt(0).toUpperCase();
  }
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return "?";
}
const statusColors = {
  online: {
    primary: "text-emerald-500",
    bg: "bg-emerald-500",
    border: "border-emerald-500",
    glow: "shadow-[0_0_10px_theme(colors.emerald.500)]"
  },
  busy: {
    primary: "text-amber-500",
    bg: "bg-amber-500",
    border: "border-amber-500",
    glow: "shadow-[0_0_10px_theme(colors.amber.500)]"
  },
  brb: {
    primary: "text-blue-500",
    bg: "bg-blue-500",
    border: "border-blue-500",
    glow: "shadow-[0_0_10px_theme(colors.blue.500)]"
  },
  away: {
    primary: "text-purple-500",
    bg: "bg-purple-500",
    border: "border-purple-500",
    glow: "shadow-[0_0_10px_theme(colors.purple.500)]"
  },
  offline: {
    primary: "text-gray-500",
    bg: "bg-gray-500",
    border: "border-gray-500",
    glow: "shadow-[0_0_10px_theme(colors.gray.500)]"
  },
  invisible: {
    primary: "text-gray-400",
    bg: "bg-gray-400",
    border: "border-gray-400",
    glow: "shadow-[0_0_10px_theme(colors.gray.400)]"
  }
};
const securityColors = {
  p2p_e2ee: {
    primary: "text-emerald-500",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500",
    glow: "shadow-[0_0_10px_theme(colors.emerald.500)]"
  },
  server_e2ee: {
    primary: "text-blue-500",
    bg: "bg-blue-500/20",
    border: "border-blue-500",
    glow: "shadow-[0_0_10px_theme(colors.blue.500)]"
  },
  standard: {
    primary: "text-amber-500",
    bg: "bg-amber-500/20",
    border: "border-amber-500",
    glow: "shadow-[0_0_10px_theme(colors.amber.500)]"
  }
};
const statusIcons = {
  online: Circle,
  busy: Clock,
  brb: LoaderCircle,
  away: Moon,
  offline: Circle,
  invisible: EyeOff
};
const statusLabels = {
  online: "Online",
  busy: "Opptatt",
  brb: "BRB",
  away: "Borte",
  offline: "Offline",
  invisible: "Usynlig"
};
const StatusIcon = ({ status, className, size = 4, pulseEffect = false }) => {
  const Icon = statusIcons[status] || statusIcons.offline;
  const statusColor = statusColors[status] || statusColors.offline;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn$1(
    `w-${size} h-${size}`,
    statusColor.primary,
    pulseEffect && "animate-pulse",
    className
  ) });
};
function StatusIndicator({
  status,
  size = "md",
  className,
  showLabel = false,
  animated = true,
  lastActive
}) {
  const [timeAgo, setTimeAgo] = reactExports.useState("");
  const sizeMap = {
    sm: 3,
    md: 4,
    lg: 5
  };
  reactExports.useEffect(() => {
    if (!lastActive || status === "online") return;
    const updateTimeAgo = () => {
      if (!lastActive) return "";
      const now = /* @__PURE__ */ new Date();
      const activeTime = typeof lastActive === "string" ? new Date(lastActive) : lastActive;
      const diffMs = now.getTime() - activeTime.getTime();
      const diffMins = Math.floor(diffMs / 6e4);
      if (diffMins < 1) return "nå nettopp";
      if (diffMins < 60) return `${diffMins} min siden`;
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs} t siden`;
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays} d siden`;
    };
    setTimeAgo(updateTimeAgo());
    const interval = setInterval(() => {
      setTimeAgo(updateTimeAgo());
    }, 6e4);
    return () => clearInterval(interval);
  }, [lastActive, status]);
  const label = statusLabels[status] || "Offline";
  const tooltipContent = status === "offline" && timeAgo ? `${label} · Sist aktiv ${timeAgo}` : label;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { delayDuration: 300, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn$1(
      "flex items-center",
      className
    ), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatusIcon,
        {
          status,
          size: sizeMap[size],
          pulseEffect: animated && status === "online",
          className: "mr-1.5"
        }
      ),
      showLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: label })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: tooltipContent }) })
  ] }) });
}
const UserAvatar = ({
  src,
  avatarUrl,
  // Added alternative prop for avatar URL
  alt = "User",
  fallback,
  size = 40,
  status,
  className,
  fallbackClassName,
  isGroup = false
  // Default to false
}) => {
  const imageUrl = src || avatarUrl;
  const initials = fallback || getInitials(alt);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Avatar,
      {
        className: cn$1(
          "border-2",
          isGroup ? "border-cybergold-700" : "border-cyberdark-700",
          className
        ),
        style: { width: size, height: size },
        children: imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: imageUrl, alt }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          AvatarFallback,
          {
            className: cn$1(
              "bg-cyberdark-700 text-cybergold-300",
              fallbackClassName
            ),
            children: initials
          }
        )
      }
    ),
    status && !isGroup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatusIndicator,
      {
        status,
        size: "sm",
        className: "rounded-full border-2 border-cyberdark-900 bg-cyberdark-900 p-0.5"
      }
    ) })
  ] });
};
const EnhancedFriendRequestHandler = ({
  currentUserId,
  onRequestAccepted,
  onRequestRejected,
  onRequestCancelled
}) => {
  dist.useSupabaseClient();
  const { toast } = useToast$1();
  const [incomingRequests, setIncomingRequests] = reactExports.useState([]);
  const [outgoingRequests, setOutgoingRequests] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (currentUserId) {
      fetchFriendRequests();
    }
  }, [currentUserId]);
  const fetchFriendRequests = async () => {
    setIsLoading(true);
    try {
      const incomingResponse = {
        data: [
          {
            id: "req_in1",
            sender_id: "user1",
            recipient_id: currentUserId,
            status: "pending",
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString(),
            sender: {
              id: "user1",
              username: "emma_newuser",
              avatar_url: "/avatars/emma.png"
            }
          },
          {
            id: "req_in2",
            sender_id: "user2",
            recipient_id: currentUserId,
            status: "pending",
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3).toISOString(),
            sender: {
              id: "user2",
              username: "jake_smith",
              avatar_url: "/avatars/jake.png"
            }
          }
        ],
        error: null
      };
      const outgoingResponse = {
        data: [
          {
            id: "req_out1",
            sender_id: currentUserId,
            recipient_id: "user3",
            status: "pending",
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString(),
            recipient: {
              id: "user3",
              username: "david_code",
              avatar_url: "/avatars/david.png"
            }
          }
        ],
        error: null
      };
      if (incomingResponse.error) ;
      if (outgoingResponse.error) ;
      setIncomingRequests(incomingResponse.data);
      setOutgoingRequests(outgoingResponse.data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      toast({
        title: "Error",
        description: "Failed to load friend requests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const acceptFriendRequest = async (requestId, senderId) => {
    try {
      setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast({
        title: "Request Accepted",
        description: "Friend request accepted successfully!"
      });
      if (onRequestAccepted) {
        onRequestAccepted(senderId);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to accept friend request. Please try again.",
        variant: "destructive"
      });
    }
  };
  const rejectFriendRequest = async (requestId, senderId) => {
    try {
      setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast({
        title: "Request Rejected",
        description: "Friend request rejected."
      });
      if (onRequestRejected) {
        onRequestRejected(senderId);
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to reject friend request. Please try again.",
        variant: "destructive"
      });
    }
  };
  const cancelFriendRequest = async (requestId, recipientId) => {
    try {
      setOutgoingRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast({
        title: "Request Cancelled",
        description: "Friend request cancelled."
      });
      if (onRequestCancelled) {
        onRequestCancelled(recipientId);
      }
    } catch (error) {
      console.error("Error cancelling friend request:", error);
      toast({
        title: "Error",
        description: "Failed to cancel friend request. Please try again.",
        variant: "destructive"
      });
    }
  };
  const formatTimeAgo = (dateString) => {
    const now = /* @__PURE__ */ new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1e3));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1e3));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1e3));
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-4", children: "Loading requests..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 text-cybergold-200" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-cybergold-100", children: "Incoming Requests" }),
        incomingRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", className: "bg-cybergold-500 text-black", children: incomingRequests.length })
      ] }),
      incomingRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground p-2", children: "No incoming friend requests" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[150px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: incomingRequests.map((request) => {
        var _a, _b, _c, _d;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between p-2 rounded-md bg-background/50 hover:bg-background/70",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  UserAvatar,
                  {
                    src: (_a = request.sender) == null ? void 0 : _a.avatar_url,
                    fallback: ((_c = (_b = request.sender) == null ? void 0 : _b.username) == null ? void 0 : _c[0]) || "?",
                    className: "h-8 w-8"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: (_d = request.sender) == null ? void 0 : _d.username }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatTimeAgo(request.created_at) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7 text-green-500 hover:text-green-600 hover:bg-green-200/10",
                    onClick: () => acceptFriendRequest(request.id, request.sender_id),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-200/10",
                    onClick: () => rejectFriendRequest(request.id, request.sender_id),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] })
            ]
          },
          request.id
        );
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-cybergold-200" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-cybergold-100", children: "Pending Sent" }),
        outgoingRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-cybergold-200 border-cybergold-200", children: outgoingRequests.length })
      ] }),
      outgoingRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground p-2", children: "No pending sent requests" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[100px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: outgoingRequests.map((request) => {
        var _a, _b, _c, _d;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between p-2 rounded-md bg-background/50 hover:bg-background/70",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  UserAvatar,
                  {
                    src: (_a = request.recipient) == null ? void 0 : _a.avatar_url,
                    fallback: ((_c = (_b = request.recipient) == null ? void 0 : _b.username) == null ? void 0 : _c[0]) || "?",
                    className: "h-8 w-8"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: (_d = request.recipient) == null ? void 0 : _d.username }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatTimeAgo(request.created_at) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-amber-500 hover:text-amber-600 hover:bg-amber-200/10",
                  onClick: () => cancelFriendRequest(request.id, request.recipient_id),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundX, { className: "h-4 w-4" })
                }
              )
            ]
          },
          request.id
        );
      }) }) })
    ] })
  ] });
};
const Profile = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CGAuwU2K.js").then((n) => n.i), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12]) : void 0));
const ProfileLoadingSkeleton = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cyberdark-950 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full bg-cyberdark-800" }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-6 bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-20 w-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-cyberdark-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-8 w-8 text-cybergold-400" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48 bg-cyberdark-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32 bg-cyberdark-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 bg-cyberdark-700 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-5 w-5 text-cybergold-400" })
      ] })
    ] })
  ] }) }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-1 bg-cyberdark-900 p-1 rounded-lg border border-cyberdark-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-24 bg-cyberdark-700 rounded-md" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-28 bg-cyberdark-800 rounded-md" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-20 bg-cyberdark-800 rounded-md" })
  ] }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 bg-cyberdark-700" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-cyberdark-800" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 bg-cyberdark-700" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-cyberdark-800" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-12 bg-cyberdark-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full bg-cyberdark-800" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-3 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-24 bg-cybergold-600/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-20 bg-cyberdark-700" })
    ] })
  ] }) }) })
] }) });
const DynamicProfile = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileLoadingSkeleton, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Profile, {}) });
};
const DynamicProfile$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DynamicProfile,
  default: DynamicProfile
}, Symbol.toStringTag, { value: "Module" }));
const SettingsComponent = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CGAuwU2K.js").then((n) => n.j), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12]) : void 0));
const SettingsLoadingSkeleton = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cyberdark-950 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full bg-cyberdark-800" }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-8 w-8 text-cybergold-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32 bg-cyberdark-700" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-64 bg-cyberdark-700" })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-1 bg-cyberdark-900 p-1 rounded-lg border border-cyberdark-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-cybergold-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 bg-cyberdark-700" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-cybergold-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 bg-cyberdark-800" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 text-cybergold-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 bg-cyberdark-800" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "h-4 w-4 text-cybergold-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-12 bg-cyberdark-800" })
    ] })
  ] }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5 text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-32 bg-cyberdark-700" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 bg-cyberdark-700" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-cyberdark-800" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 bg-cyberdark-700" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-cyberdark-800" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 bg-cyberdark-700" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-48 bg-cyberdark-800" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-12 bg-cyberdark-700 rounded-full" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-28 bg-cyberdark-700" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-3 border-b border-cyberdark-700 last:border-b-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32 bg-cyberdark-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-56 bg-cyberdark-800" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-12 bg-cyberdark-700 rounded-full" })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-28 bg-cyberdark-700" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28 bg-cyberdark-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-40 bg-cyberdark-800" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-12 bg-cyberdark-700 rounded-full" })
      ] }, i)) })
    ] })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex justify-end space-x-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-20 bg-cyberdark-700" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-32 bg-cybergold-600/20" })
  ] })
] }) });
const DynamicSettings = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsLoadingSkeleton, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsComponent, {}) });
};
const DynamicSettings$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DynamicSettings,
  default: DynamicSettings
}, Symbol.toStringTag, { value: "Module" }));
const Mail = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CGAuwU2K.js").then((n) => n.l), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12]) : void 0));
const MailLoadingSkeleton = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cyberdark-950", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-64 bg-cyberdark-900 border-r border-cyberdark-700 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-6 w-6 text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 bg-cyberdark-700" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-cybergold-600/20 rounded-md" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
      { icon: Inbox, label: "Innboks" },
      { icon: Send, label: "Sendt" },
      { icon: Archive, label: "Arkiv" },
      { icon: Star, label: "Stjernert" }
    ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 p-2 rounded-md bg-cyberdark-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-4 w-4 text-cybergold-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 bg-cyberdark-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-6 bg-cyberdark-700 ml-auto rounded-full" })
    ] }, i)) })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-cyberdark-700 bg-cyberdark-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32 bg-cyberdark-700" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 bg-cyberdark-700 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 bg-cyberdark-700 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 bg-cyberdark-700 rounded" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cybergold-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-cyberdark-800 pl-10" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700 hover:bg-cyberdark-800/50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 bg-cyberdark-700 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32 bg-cyberdark-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16 bg-cyberdark-800" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48 bg-cyberdark-700" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 bg-cyberdark-800" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-cyberdark-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4 bg-cyberdark-700 rounded" })
      ] })
    ] }) }) }, i)) }) })
  ] })
] }) });
const DynamicMail = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(MailLoadingSkeleton, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, {}) });
};
const DynamicMail$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DynamicMail,
  default: DynamicMail
}, Symbol.toStringTag, { value: "Module" }));
const MemoryDashboard = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CGAuwU2K.js").then((n) => n.m), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12]) : void 0));
const MemoryDashboardLoadingSkeleton = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cyberdark-950 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full bg-cyberdark-800" }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-10 w-10 text-cybergold-400" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 bg-cyberdark-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-72 bg-cyberdark-800" })
    ] })
  ] }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
    { icon: Database, label: "Total Memories" },
    { icon: Star, label: "Favorites" },
    { icon: Clock, label: "Recent" },
    { icon: ChartColumn, label: "Analytics" }
  ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-8 w-8 text-cybergold-400" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-12 bg-cyberdark-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16 bg-cyberdark-800" })
    ] })
  ] }) }) }, i)) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-1 bg-cyberdark-900 p-1 rounded-lg border border-cyberdark-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-24 bg-cyberdark-700 rounded-md" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-20 bg-cyberdark-800 rounded-md" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-28 bg-cyberdark-800 rounded-md" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-24 bg-cyberdark-800 rounded-md" })
  ] }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cybergold-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-cyberdark-800 pl-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-24 bg-cyberdark-800" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-20 bg-cyberdark-800" })
    ] })
  ] }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cyberdark-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-3/4 bg-cyberdark-700" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 bg-cyberdark-800 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 bg-cyberdark-800 rounded-full" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 bg-cyberdark-700 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 bg-cyberdark-700 rounded" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full bg-cyberdark-800" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-5/6 bg-cyberdark-800" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/6 bg-cyberdark-800" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24 bg-cyberdark-800" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16 bg-cyberdark-800" })
      ] })
    ] })
  ] }, i)) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 right-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-14 bg-cybergold-600/20 rounded-full" }) })
] }) });
const DynamicMemoryDashboard = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryDashboardLoadingSkeleton, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryDashboard, {}) });
};
const DynamicMemoryDashboard$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DynamicMemoryDashboard,
  default: DynamicMemoryDashboard
}, Symbol.toStringTag, { value: "Module" }));
function BitcoinPayment({
  amount,
  productId,
  productType,
  onSuccess,
  onError
}) {
  const { toast } = useToast$1();
  const [loading, setLoading] = reactExports.useState(false);
  const [paymentData, setPaymentData] = reactExports.useState(null);
  const [timeLeft, setTimeLeft] = reactExports.useState(null);
  const [statusChecking, setStatusChecking] = reactExports.useState(false);
  reactExports.useEffect(() => {
    createPaymentRequest();
  }, []);
  reactExports.useEffect(() => {
    if (!(paymentData == null ? void 0 : paymentData.expires_at)) return;
    const calculateTimeLeft = () => {
      const expiresAt = new Date(paymentData.expires_at).getTime();
      const now = (/* @__PURE__ */ new Date()).getTime();
      const difference = expiresAt - now;
      if (difference <= 0) {
        return 0;
      }
      return Math.floor(difference / 1e3);
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (newTimeLeft <= 0) {
        clearInterval(timer);
      }
    }, 1e3);
    return () => clearInterval(timer);
  }, [paymentData == null ? void 0 : paymentData.expires_at]);
  reactExports.useEffect(() => {
    if (!(paymentData == null ? void 0 : paymentData.id)) return;
    const subscription = supabase.channel(`payment-${paymentData.id}`).on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "payments",
        filter: `id=eq.${paymentData.id}`
      },
      (payload) => {
        const updatedPayment = payload.new;
        setPaymentData(updatedPayment);
        if (updatedPayment.status === "confirmed" || updatedPayment.status === "completed") {
          toast({
            title: "Payment confirmed!",
            description: "Your Bitcoin payment has been confirmed."
          });
          handlePaymentSuccess();
        } else if (updatedPayment.status === "failed") {
          toast({
            variant: "destructive",
            title: "Payment failed",
            description: "Your Bitcoin payment has failed."
          });
        }
      }
    ).subscribe();
    const statusCheckInterval = setInterval(() => {
      checkPaymentStatus();
    }, 3e4);
    return () => {
      supabase.removeChannel(subscription);
      clearInterval(statusCheckInterval);
    };
  }, [paymentData == null ? void 0 : paymentData.id]);
  const createPaymentRequest = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/payments", {
        amount,
        currency: "NOK",
        productType,
        productId
      });
      if (response.data.success && response.data.payment) {
        setPaymentData(response.data.payment);
      } else {
        throw new Error("Failed to create payment request");
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      onError(error instanceof Error ? error.message : "Failed to create payment request");
    } finally {
      setLoading(false);
    }
  };
  const checkPaymentStatus = async () => {
    if (!(paymentData == null ? void 0 : paymentData.id) || paymentData.status !== "pending") return;
    try {
      setStatusChecking(true);
      const response = await axios.get(`/api/payments/${paymentData.id}`);
      if (response.data.success && response.data.payment) {
        setPaymentData(response.data.payment);
        if (["confirmed", "completed"].includes(response.data.payment.status)) {
          handlePaymentSuccess();
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    } finally {
      setStatusChecking(false);
    }
  };
  const handlePaymentSuccess = async () => {
    try {
      await onSuccess();
    } catch (error) {
      console.error("Error in onSuccess callback:", error);
    }
  };
  const formatTimeLeft = (seconds) => {
    if (seconds === null || seconds <= 0) return "00:00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const remainingSeconds = seconds % 60;
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      remainingSeconds.toString().padStart(2, "0")
    ].join(":");
  };
  const copyAddressToClipboard = () => {
    if (!(paymentData == null ? void 0 : paymentData.bitcoin_address)) return;
    navigator.clipboard.writeText(paymentData.bitcoin_address).then(() => {
      toast({
        title: "Address copied",
        description: "Bitcoin address copied to clipboard"
      });
    }).catch((err) => {
      console.error("Failed to copy address:", err);
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4 flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-12 w-12 animate-spin text-cybergold-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm", children: "Creating your Bitcoin payment..." })
    ] });
  }
  if (paymentData && ["confirmed", "completed"].includes(paymentData.status)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4 border border-green-600/30 rounded-lg bg-green-900/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-8 w-8 text-green-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-medium text-green-400", children: "Payment Successful" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2", children: "Your payment has been confirmed." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400", children: [
          "Transaction ID: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs", children: [
            paymentData.id.substring(0, 8),
            "..."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 p-3 bg-green-900/30 rounded-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-green-300", children: "Visste du?" }),
        " Snakkaz Chat tilbyr også integrering med Electrum Bitcoin Wallet. Som premium bruker, kan du opprette og administrere din Bitcoin-lommebok direkte i appen."
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "w-full bg-green-700 hover:bg-green-600 text-white",
          onClick: () => onSuccess(),
          children: "Continue"
        }
      )
    ] });
  }
  if (paymentData && timeLeft === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4 border border-red-600/30 rounded-lg bg-red-900/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-8 w-8 text-red-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-medium text-red-400", children: "Payment Expired" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2", children: "This payment request has expired." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "Please create a new payment request to continue." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "w-full bg-cybergold-600 hover:bg-cybergold-500 text-black",
          onClick: createPaymentRequest,
          children: "Create New Payment"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border border-cyberdark-700 rounded-lg bg-cyberdark-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-cybergold-400", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-semibold text-cybergold-200", children: [
          amount,
          " kr"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-cybergold-400", children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-cybergold-300", children: productType || "Premium Membership" })
      ] }),
      paymentData && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-center text-cybergold-500 mb-1", children: [
            "Time remaining: ",
            formatTimeLeft(timeLeft)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-cyberdark-700 h-2 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-cybergold-500",
              style: {
                width: `${timeLeft && timeLeft > 0 ? timeLeft / (24 * 60 * 60) * 100 : 0}%`
              }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center rounded-md p-4 bg-cyberdark-700 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-3 rounded-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            QRCodeSVG,
            {
              value: `bitcoin:${paymentData.bitcoin_address}?amount=${paymentData.btc_amount}`,
              size: 150
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white mb-1", children: "Send exactly:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-mono font-bold text-cybergold-400", children: [
              paymentData.btc_amount,
              " BTC"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-cyberdark-900 rounded-md font-mono text-xs break-all text-center text-gray-300", children: paymentData.bitcoin_address }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2",
              onClick: copyAddressToClipboard,
              children: "Copy"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: checkPaymentStatus,
        className: "w-full bg-cyberdark-700 hover:bg-cyberdark-600",
        disabled: statusChecking || !paymentData || paymentData.status !== "pending",
        children: statusChecking ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Checking..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4" }),
          "Check Payment Status"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-center text-gray-500 space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Send the exact amount of Bitcoin to the address above." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The payment will be automatically confirmed after transaction is detected." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Payment will expire in 24 hours if not completed." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 p-4 bg-cyberdark-900 border border-cyberdark-700 rounded-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-medium text-cybergold-400 mb-2 flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4 text-red-400" }),
        "Din støtte betyr mye for oss"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-xs text-gray-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Ved å bli premium bruker støtter du Snakkaz Chat med å:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 shrink-0 mt-0.5 text-cyberblue-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Forbedre sikkerheten og personvernet for alle brukere" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-4 w-4 shrink-0 mt-0.5 text-cyberblue-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Utvikle nye funksjoner og forbedringer av plattformen" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bitcoin, { className: "h-4 w-4 shrink-0 mt-0.5 text-cybergold-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Holde tjenesten uavhengig og reklamefri" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "pt-2", children: [
          "Vi tar også gjerne imot donasjoner for å støtte videre utvikling. For donasjoner, send valgfritt beløp til vår Bitcoin-adresse: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cybergold-400 font-mono", children: "bc1qz7q6hxlevr8y9kgff2p6m2c9t95x85h2knz0wz" })
        ] })
      ] })
    ] })
  ] });
}
const SubscriptionTiers = () => {
  const [plans, setPlans] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [selectedPlan, setSelectedPlan] = reactExports.useState(null);
  const [paymentOpen, setPaymentOpen] = reactExports.useState(false);
  const { user, subscription, refreshSubscription, isPremium } = useAuth();
  const { toast } = useToast$1();
  reactExports.useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await subscriptionService.getSubscriptionPlans();
        setPlans(plansData);
      } catch (error) {
        console.error("Failed to load subscription plans", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setPaymentOpen(true);
  };
  const handleSupportSuccess = async () => {
    if (!user || !selectedPlan) return;
    try {
      await subscriptionService.createSubscription(user.id, selectedPlan.id);
      await refreshSubscription();
      toast({
        title: "Takk for din støtte!",
        description: `Du støtter nå fellesskapet med ${selectedPlan.name}!`,
        variant: "default"
      });
      setPaymentOpen(false);
    } catch (error) {
      console.error("Failed to create subscription", error);
      toast({
        title: "Støtte Error",
        description: "Kunne ikke aktivere din støtte. Prøv igjen.",
        variant: "destructive"
      });
    }
  };
  const handleSupportError = (errorMessage) => {
    toast({
      title: "Støtte mislyktes",
      description: errorMessage,
      variant: "destructive"
    });
  };
  const handleStartSupport = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const success = await subscriptionService.createTrialSubscription(user.id);
      if (success) {
        await refreshSubscription();
        toast({
          title: "Velkommen til fellesskapet!",
          description: "Du har nå tilgang til alle funksjonene våre!",
          variant: "default"
        });
      } else {
        throw new Error("Failed to start trial");
      }
    } catch (error) {
      console.error("Failed to start trial", error);
      toast({
        title: "Oppstart feilet",
        description: "Kunne ikke starte din tilgang. Prøv igjen.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-green-500" }) });
  }
  if (isPremium && subscription) {
    const expiryDate = subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : "Unknown";
    const currentPlan = plans.find((p) => p.id === subscription.plan_id);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-green-500 bg-slate-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center justify-between", children: [
            "Aktiv fellesskapsstøtte",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-green-700 text-green-100", children: subscription.status === "trial" ? "GRATIS TILGANG" : "SUPPORTER" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
            "Takk for at du støtter ",
            (currentPlan == null ? void 0 : currentPlan.name) || "SnakkaZ",
            " fellesskapet"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: "Støttenivå:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: (currentPlan == null ? void 0 : currentPlan.name) || "Fellesskapsstøtte" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: "Status:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: subscription.status === "trial" ? "Gratis tilgang" : "Aktiv støtte" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: "Fornyelse:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: expiryDate })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: "Bidrag:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              (currentPlan == null ? void 0 : currentPlan.price) || 0,
              " kr / måned"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "destructive",
            className: "w-full",
            onClick: async () => {
              if (user) {
                await subscriptionService.cancelSubscription(user.id);
                await refreshSubscription();
                toast({
                  title: "Støtte avsluttet",
                  description: "Din støtte til fellesskapet er avsluttet."
                });
              }
            },
            children: "Avslutt støtte"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-center text-green-500", children: [
        "Din støtte forblir aktiv til ",
        expiryDate,
        ". Takk for at du hjelper oss bygge et bedre fellesskap!"
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight text-green-100", children: "Støtt fellesskapet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-green-400", children: "Valgfri støtte som hjelper oss bygge en bedre plattform for alle" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: plans.map((plan) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: `relative overflow-hidden transition-all border-green-500/20 hover:border-green-400/40 ${plan.highlighted ? "border-2 border-green-500 shadow-lg shadow-green-900/20" : ""}`,
        children: [
          plan.badge_text && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: "absolute top-4 right-4 bg-green-600 text-xs font-semibold uppercase",
              children: plan.badge_text
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-green-200", children: plan.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-slate-400", children: plan.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-bold text-green-300", children: [
                plan.price,
                " kr"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-400", children: [
                " / ",
                plan.interval
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Object.entries(plan.features).map(([feature, enabled]) => {
            if (typeof enabled !== "boolean") return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
              enabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-2 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-2 text-slate-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: !enabled ? "text-slate-600" : "text-slate-300", children: feature.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") })
            ] }, feature);
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full bg-green-600 hover:bg-green-500 text-white",
              onClick: () => handleSelectPlan(plan),
              children: "Støtt med denne"
            }
          ) })
        ]
      },
      plan.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-400 mb-4", children: "Vil du teste alle funksjonene først? Få gratis tilgang og se hva vi bygger sammen." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "border-green-600 text-green-400 hover:text-green-200 hover:bg-green-600/10",
          onClick: handleStartSupport,
          disabled: loading,
          children: [
            loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
            "Få gratis tilgang"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: paymentOpen, onOpenChange: setPaymentOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Støtt fellesskapet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: selectedPlan ? `Støtt ${selectedPlan.name} med ${selectedPlan.price} kr per ${selectedPlan.interval}` : "" })
      ] }),
      selectedPlan && /* @__PURE__ */ jsxRuntimeExports.jsx(
        BitcoinPayment,
        {
          amount: selectedPlan.price,
          productId: selectedPlan.id,
          productType: selectedPlan.name,
          onSuccess: handleSupportSuccess,
          onError: handleSupportError
        }
      )
    ] }) })
  ] });
};
const SubscriptionPage = () => {
  const { isPremium, subscription } = useAuth();
  const navigate = useNavigate();
  const [dbError, setDbError] = React.useState(false);
  React.useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(" ");
      if (errorMessage.includes("PGRST200") && errorMessage.includes("subscription")) {
        setDbError(true);
      }
      originalConsoleError(...args);
    };
    return () => {
      console.error = originalConsoleError;
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container py-10 max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        onClick: () => navigate("/beta-chat"),
        className: "text-cybergold-400 hover:text-cybergold-300",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
          "Tilbake til Chat"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight text-cybergold-100", children: "Subscription Management" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-400 mt-2", children: "Manage your subscription and access premium features" })
    ] }),
    dbError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-yellow-900/30 border border-yellow-800 rounded-md p-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-yellow-500 mr-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-yellow-500 font-medium", children: "Database Setup Required" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-yellow-300/80 text-sm", children: [
        "The subscription tables are not properly set up in the database. Run ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-black/30 px-1 py-0.5 rounded", children: "./fix-subscription-schema.sh" }),
        " to fix this issue."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "mt-3 border-yellow-800 bg-yellow-900/20 text-yellow-500 hover:bg-yellow-900/40",
          onClick: () => setDbError(false),
          children: "Dismiss"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "subscription", className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full max-w-md mx-auto grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "subscription", children: "Subscription" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "features", children: "Premium Features" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "subscription", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SubscriptionTiers, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "features", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center", children: [
            "Premium Features",
            isPremium ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-cybergold-900/50 text-cybergold-400 rounded-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 mr-1" }),
              "Active"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-cyberdark-700 text-cybergold-600 rounded-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3 mr-1" }),
              "Locked"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isPremium ? "Enjoy all the premium features available with your subscription" : "Upgrade to premium to access these features" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FeatureCard,
            {
              title: "Extended Storage",
              description: "Store up to 50GB of files and media in your chats",
              featureKey: PremiumFeature.EXTENDED_STORAGE,
              unlocked: isPremium
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FeatureCard,
            {
              title: "End-to-End Encryption",
              description: "Enhanced security with end-to-end encryption for all your messages",
              featureKey: PremiumFeature.END_TO_END_ENCRYPTION,
              unlocked: isPremium
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FeatureCard,
            {
              title: "Premium Groups",
              description: "Create groups with up to 500 members and enhanced controls",
              featureKey: PremiumFeature.PREMIUM_GROUPS,
              unlocked: isPremium
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FeatureCard,
            {
              title: "Custom Email Domain",
              description: "Use your own email domain for Snakkaz communications",
              featureKey: PremiumFeature.CUSTOM_EMAIL,
              unlocked: isPremium
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FeatureCard,
            {
              title: "Priority Support",
              description: "Get priority customer support with 24/7 availability",
              featureKey: PremiumFeature.PRIORITY_SUPPORT,
              unlocked: isPremium
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FeatureCard,
            {
              title: "Custom Themes",
              description: "Access exclusive themes and customization options",
              featureKey: PremiumFeature.CUSTOM_THEMES,
              unlocked: isPremium
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FeatureCard,
            {
              title: "API Access",
              description: "Access to the Snakkaz API for custom integrations",
              featureKey: PremiumFeature.API_ACCESS,
              unlocked: isPremium
            }
          ),
          !isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full bg-cybergold-600 hover:bg-cybergold-500 text-black",
              onClick: () => {
                const element = document.querySelector('[data-value="subscription"]');
                if (element instanceof HTMLElement) {
                  element.click();
                }
              },
              children: "Upgrade to Premium"
            }
          ) })
        ] })
      ] }) })
    ] })
  ] });
};
const FeatureCard = ({
  title,
  description,
  featureKey,
  unlocked
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-medium text-cybergold-200", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-cybergold-400", children: description })
      ] }),
      unlocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-5 w-5 text-cybergold-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5 text-cybergold-700" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4 bg-cyberdark-700" })
  ] });
};
const EnhancedRegisterForm = ({
  onSuccess,
  inviteCode
}) => {
  const [formData, setFormData] = reactExports.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = reactExports.useState(false);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [passwordStrength2, setPasswordStrength] = reactExports.useState(0);
  const [touchedFields, setTouchedFields] = reactExports.useState(/* @__PURE__ */ new Set());
  const { signUp } = useAuth();
  const { toast } = useToast();
  const { validationState: usernameState, validateUsername } = useUsernameValidation();
  const { validationState: emailState, validateEmail } = useEmailValidation();
  reactExports.useEffect(() => {
    if (formData.username && touchedFields.has("username")) {
      const timeoutId = setTimeout(() => {
        validateUsername(formData.username);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.username, validateUsername, touchedFields]);
  reactExports.useEffect(() => {
    if (formData.email && touchedFields.has("email")) {
      const timeoutId = setTimeout(() => {
        validateEmail(formData.email);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.email, validateEmail, touchedFields]);
  reactExports.useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[a-z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(formData.password)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);
  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };
  const handleFieldBlur = (field) => () => {
    setTouchedFields((prev) => /* @__PURE__ */ new Set([...prev, field]));
  };
  const getValidationIcon = (field) => {
    const state = field === "username" ? usernameState : emailState;
    if (state.isChecking) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-cyberblue-400" });
    }
    if (state.isAvailable === true) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-500" });
    }
    if (state.isAvailable === false || state.error) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-red-500" });
    }
    return null;
  };
  const getPasswordStrengthColor = () => {
    if (passwordStrength2 <= 1) return "bg-red-500";
    if (passwordStrength2 <= 2) return "bg-orange-500";
    if (passwordStrength2 <= 3) return "bg-yellow-500";
    if (passwordStrength2 <= 4) return "bg-green-500";
    return "bg-emerald-500";
  };
  const getPasswordStrengthText = () => {
    if (passwordStrength2 <= 1) return "Svakt";
    if (passwordStrength2 <= 2) return "Middels";
    if (passwordStrength2 <= 3) return "Bra";
    if (passwordStrength2 <= 4) return "Sterkt";
    return "Veldig sterkt";
  };
  const isFormValid = () => {
    return usernameState.isAvailable === true && emailState.isAvailable === true && passwordStrength2 >= 3 && formData.password === formData.confirmPassword && formData.username && formData.email && formData.password && formData.confirmPassword;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast({
        title: "Registrering ikke komplett",
        description: "Vennligst fyll ut alle felt korrekt før du fortsetter.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await signUp(formData.email, formData.password, {
        username: formData.username,
        inviteCode
      });
      if (result.success) {
        toast({
          title: "🎉 Velkommen til SnakkaZ Beta!",
          description: "Sjekk e-posten din for å bekrefte kontoen."
        });
        onSuccess == null ? void 0 : onSuccess();
      } else {
        toast({
          title: "Registrering feilet",
          description: result.error || "En feil oppstod. Prøv igjen.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Uventet feil",
        description: "Noe gikk galt. Prøv igjen senere.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSuggestionClick = (suggestion, field) => {
    {
      setFormData((prev) => ({ ...prev, username: suggestion }));
      setTouchedFields((prev) => /* @__PURE__ */ new Set([...prev, "username"]));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md mx-auto bg-cyberdark-900 border-cybergold-500/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl text-cybergold-400", children: "Bli med i SnakkaZ Beta" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "text-cybergold-300", children: [
        "Opprett din konto og start å chatte sikkert",
        inviteCode && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 px-3 py-1 bg-cybergold-500/20 rounded-full text-xs text-cybergold-400", children: "🎉 Du er invitert til beta!" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "username", className: "text-cybergold-300", children: "Brukernavn" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cybergold-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "username",
              type: "text",
              value: formData.username,
              onChange: handleInputChange("username"),
              onBlur: handleFieldBlur("username"),
              placeholder: "Velg ditt brukernavn",
              className: cn$1(
                "pl-10 pr-10 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200",
                usernameState.isAvailable === true && "border-green-500/50",
                usernameState.isAvailable === false && "border-red-500/50"
              ),
              disabled: isSubmitting
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: getValidationIcon("username") })
        ] }),
        touchedFields.has("username") && usernameState.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-red-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
          usernameState.error
        ] }),
        touchedFields.has("username") && usernameState.isAvailable === true && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-green-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }),
          "✅ Dette brukernavnet er tilgjengelig!"
        ] }),
        usernameState.suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cybergold-400 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-3 w-3" }),
            "Forslag:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: usernameState.suggestions.map((suggestion, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleSuggestionClick(suggestion),
              className: "px-2 py-1 text-xs bg-cybergold-500/20 text-cybergold-300 rounded-md hover:bg-cybergold-500/30 transition-colors",
              children: suggestion
            },
            index
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "text-cybergold-300", children: "E-postadresse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$1, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cybergold-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "email",
              type: "email",
              value: formData.email,
              onChange: handleInputChange("email"),
              onBlur: handleFieldBlur("email"),
              placeholder: "din@epost.no",
              className: cn$1(
                "pl-10 pr-10 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200",
                emailState.isAvailable === true && "border-green-500/50",
                emailState.isAvailable === false && "border-red-500/50"
              ),
              disabled: isSubmitting
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: getValidationIcon("email") })
        ] }),
        touchedFields.has("email") && emailState.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-red-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
          emailState.error
        ] }),
        touchedFields.has("email") && emailState.isAvailable === true && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-green-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }),
          "✅ E-posten er tilgjengelig!"
        ] }),
        emailState.suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-400", children: emailState.suggestions[0] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "text-cybergold-300", children: "Passord" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cybergold-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "password",
              type: showPassword ? "text" : "password",
              value: formData.password,
              onChange: handleInputChange("password"),
              placeholder: "Opprett et sterkt passord",
              className: "pl-10 pr-10 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200",
              disabled: isSubmitting
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-cybergold-500 hover:text-cybergold-400",
              children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
            }
          )
        ] }),
        formData.password && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-cyberdark-700 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn$1(
                  "h-full rounded-full transition-all duration-300",
                  getPasswordStrengthColor()
                ),
                style: { width: `${passwordStrength2 / 5 * 100}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cybergold-400", children: getPasswordStrengthText() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-500", children: "Bruk minst 8 tegn med store og små bokstaver, tall og symboler" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirmPassword", className: "text-cybergold-300", children: "Bekreft passord" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cybergold-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "confirmPassword",
              type: showConfirmPassword ? "text" : "password",
              value: formData.confirmPassword,
              onChange: handleInputChange("confirmPassword"),
              placeholder: "Gjenta passordet",
              className: cn$1(
                "pl-10 pr-10 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200",
                formData.confirmPassword && formData.password === formData.confirmPassword && "border-green-500/50",
                formData.confirmPassword && formData.password !== formData.confirmPassword && "border-red-500/50"
              ),
              disabled: isSubmitting
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowConfirmPassword(!showConfirmPassword),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-cybergold-500 hover:text-cybergold-400",
              children: showConfirmPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
            }
          )
        ] }),
        formData.confirmPassword && formData.password !== formData.confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-red-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
          "Passordene stemmer ikke overens"
        ] }),
        formData.confirmPassword && formData.password === formData.confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-green-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }),
          "Passordene stemmer overens"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          disabled: !isFormValid() || isSubmitting,
          className: "w-full bg-cybergold-600 hover:bg-cybergold-500 text-black font-medium h-12 text-lg transition-all duration-200",
          children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }),
            "Oppretter konto..."
          ] }) : "🚀 Opprett SnakkaZ Beta konto"
        }
      )
    ] }) })
  ] });
};
const compressImage = async (file, options = {}) => {
  const { maxWidth = 800, maxHeight = 600, quality = 0.8 } = options;
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = height * maxWidth / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = width * maxHeight / height;
        height = maxHeight;
      }
      canvas.width = width;
      canvas.height = height;
      ctx == null ? void 0 : ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };
    img.src = URL.createObjectURL(file);
  });
};
const createThumbnail = async (file, options = {}) => {
  const { width = 150, height = 150, quality = 0.7 } = options;
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      const scale = Math.max(width / img.width, height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (width - scaledWidth) / 2;
      const y = (height - scaledHeight) / 2;
      ctx == null ? void 0 : ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], `thumb_${file.name}`, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(thumbnailFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };
    img.src = URL.createObjectURL(file);
  });
};
const uploadChunkedFile = async (file, uploadUrl, options = {}) => {
  const { chunkSize = 1024 * 1024, onProgress, onChunkComplete } = options;
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData
    });
    if (response.ok) {
      const result = await response.json();
      onProgress == null ? void 0 : onProgress(100);
      return { success: true, url: result.url };
    } else {
      return { success: false, error: "Upload failed" };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};
const EnhancedAvatarUpload = ({
  currentAvatar,
  onAvatarChange,
  onUploadProgress,
  maxSize = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  className
}) => {
  const [preview, setPreview] = reactExports.useState(currentAvatar || null);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [error, setError] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const { toast } = useToast();
  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return `Ugyldig filtype. Tillatt: ${allowedTypes.map((type) => type.split("/")[1]).join(", ")}`;
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `Filen er for stor. Maksimal størrelse: ${maxSize}MB`;
    }
    return null;
  };
  const processAndUploadFile = async (file) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        var _a;
        setPreview((_a = e.target) == null ? void 0 : _a.result);
      };
      fileReader.readAsDataURL(file);
      let processedFile = file;
      if (file.size > 500 * 1024) {
        setUploadProgress(20);
        processedFile = await compressImage(file, {
          maxWidth: 400,
          maxHeight: 400,
          quality: 0.8
        });
      }
      setUploadProgress(40);
      const thumbnail = await createThumbnail(processedFile, {
        width: 150,
        height: 150,
        quality: 0.7
      });
      setUploadProgress(60);
      const uploadResult = await uploadChunkedFile(processedFile, {
        bucket: "avatars",
        folder: "profile-pictures",
        onProgress: (progress) => {
          const totalProgress = 60 + progress * 0.4;
          setUploadProgress(totalProgress);
          onUploadProgress == null ? void 0 : onUploadProgress(totalProgress);
        }
      });
      if (uploadResult.success && uploadResult.url) {
        setUploadProgress(100);
        onAvatarChange(uploadResult.url);
        toast({
          title: "🎉 Profilbilde opplastet!",
          description: "Ditt nye profilbilde er nå aktivt."
        });
      } else {
        throw new Error(uploadResult.error || "Upload failed");
      }
    } catch (error2) {
      console.error("Avatar upload error:", error2);
      setError(error2 instanceof Error ? error2.message : "Opplasting feilet");
      setPreview(currentAvatar || null);
      toast({
        title: "Opplasting feilet",
        description: "Kunne ikke laste opp profilbildet. Prøv igjen.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    processAndUploadFile(file);
  };
  const handleDrop = reactExports.useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, []);
  const handleDragOver = reactExports.useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = reactExports.useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const removeAvatar = () => {
    setPreview(null);
    setError(null);
    onAvatarChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const openFileDialog = () => {
    var _a;
    (_a = fileInputRef.current) == null ? void 0 : _a.click();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn$1("w-full max-w-md bg-cyberdark-900 border-cybergold-500/30", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg text-cybergold-400 flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5" }),
        "Profilbilde"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-cybergold-300", children: "Last opp et bilde som representerer deg" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn$1(
              "w-32 h-32 rounded-full border-2 border-dashed border-cybergold-500/50 flex items-center justify-center bg-cyberdark-800 transition-all duration-200",
              preview && "border-solid border-cybergold-500",
              isDragging && "border-cybergold-400 bg-cybergold-500/10 scale-105"
            ),
            children: [
              preview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: preview,
                  alt: "Profilbilde forhåndsvisning",
                  className: "w-full h-full rounded-full object-cover"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-12 w-12 text-cybergold-500/50" }),
              isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-cybergold-400 mx-auto mb-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-cybergold-300", children: [
                  Math.round(uploadProgress),
                  "%"
                ] })
              ] }) })
            ]
          }
        ),
        preview && !isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: removeAvatar,
            className: "absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
          }
        ),
        preview && !isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          onDrop: handleDrop,
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          onClick: openFileDialog,
          className: cn$1(
            "border-2 border-dashed border-cybergold-500/30 rounded-lg p-6 text-center cursor-pointer transition-all duration-200 hover:border-cybergold-500/50 hover:bg-cybergold-500/5",
            isDragging && "border-cybergold-400 bg-cybergold-500/10",
            isUploading && "pointer-events-none opacity-50"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            isDragging ? /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-8 w-8 text-cybergold-400 mx-auto" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 text-cybergold-500 mx-auto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300 font-medium", children: isDragging ? "Slipp bildet her!" : "Dra og slipp eller klikk for å velge" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cybergold-500 mt-1", children: [
                "JPG, PNG, WebP eller GIF • Maks ",
                maxSize,
                "MB"
              ] })
            ] })
          ] })
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-red-400 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-400", children: error })
      ] }),
      isUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-cybergold-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Laster opp..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            Math.round(uploadProgress),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-cyberdark-700 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-cybergold-500 h-2 rounded-full transition-all duration-300",
            style: { width: `${uploadProgress}%` }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: openFileDialog,
            disabled: isUploading,
            className: "flex-1 border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
              "Velg fil"
            ]
          }
        ),
        preview && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: removeAvatar,
            disabled: isUploading,
            className: "border-red-500/30 text-red-400 hover:bg-red-500/10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          accept: allowedTypes.join(","),
          onChange: (e) => handleFileSelect(e.target.files),
          className: "hidden"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-cybergold-500 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "💡 Tips for best resultat:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "ml-4 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Bruk kvadratiske bilder (1:1 ratio)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Minimum 200x200 piksler anbefales" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Ansiktet bør være godt synlig og sentrert" })
        ] })
      ] })
    ] })
  ] });
};
const GroupInviteSystem = ({
  groupId,
  groupName,
  groupDescription,
  isAdmin,
  currentSettings,
  onSettingsChange
}) => {
  const [inviteLink, setInviteLink] = reactExports.useState("");
  const [qrCodeUrl, setQrCodeUrl] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [customMessage, setCustomMessage] = reactExports.useState("");
  const [expiresIn, setExpiresIn] = reactExports.useState("never");
  const [maxUses, setMaxUses] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState(false);
  const [settings, setSettings] = reactExports.useState(currentSettings);
  const { toast } = useToast();
  reactExports.useEffect(() => {
    const baseUrl = window.location.origin;
    const linkParams = new URLSearchParams({
      group: groupId,
      name: groupName
    });
    if (password) {
      linkParams.set("password", password);
    }
    const link = `${baseUrl}/beta-chat/join?${linkParams.toString()}`;
    setInviteLink(link);
    browser.toDataURL(link, {
      width: 200,
      margin: 2,
      color: {
        dark: "#D4AF37",
        light: "#1A1B23"
      }
    }).then(setQrCodeUrl);
  }, [groupId, groupName, password]);
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
      toast({
        title: `${label} kopiert!`,
        description: "Invitasjonslenken er kopiert til utklippstavlen."
      });
    } catch (error) {
      toast({
        title: "Kunne ikke kopiere",
        description: "Prøv å kopiere manuelt.",
        variant: "destructive"
      });
    }
  };
  const shareVia = (platform) => {
    const message = customMessage || `Bli med i "${groupName}" gruppen på SnakkaZ Beta! 🚀`;
    const fullMessage = `${message}

${inviteLink}`;
    let shareUrl = "";
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(inviteLink)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteLink)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(`Invitasjon til ${groupName}`)}&body=${encodeURIComponent(fullMessage)}`;
        break;
      case "sms":
        shareUrl = `sms:?body=${encodeURIComponent(fullMessage)}`;
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };
  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };
  const generateNewLink = () => {
    toast({
      title: "Ny invitasjonslenke generert",
      description: "Den gamle lenken er ikke lenger gyldig."
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-cybergold-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
          "Gruppeinnstillinger"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-cybergold-300", children: "Kontroller hvem som kan bli med i gruppen" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-cybergold-300", children: "Offentlig gruppe" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-500", children: "Alle kan finne og bli med i gruppen" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: settings.isPublic,
              onCheckedChange: (checked) => handleSettingChange("isPublic", checked)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-cybergold-300", children: "Krev godkjenning" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-500", children: "Nye medlemmer må godkjennes av admin" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: settings.requireApproval,
              onCheckedChange: (checked) => handleSettingChange("requireApproval", checked)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-cybergold-300", children: "Medlemmer kan invitere" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cybergold-500", children: "La medlemmer lage invitasjonslenker" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: settings.allowInvites,
              onCheckedChange: (checked) => handleSettingChange("allowInvites", checked)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-cybergold-300", children: "Gruppepassord" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: showPassword ? "text" : "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: "Sett et passord for gruppen",
                className: "pr-10 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowPassword(!showPassword),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-cybergold-500",
                children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-500", children: "La stå tom for ingen passord-beskyttelse" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-cybergold-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link$1, { className: "h-5 w-5" }),
          "Invitasjonslenke"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-cybergold-300", children: "Del denne lenken for å invitere nye medlemmer" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-cybergold-300", children: "Personlig melding" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: customMessage,
              onChange: (e) => setCustomMessage(e.target.value),
              placeholder: `Bli med i "${groupName}" gruppen på SnakkaZ Beta! 🚀`,
              className: "bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 min-h-[80px]"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-cybergold-300", children: "Utløper" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: expiresIn,
                onChange: (e) => setExpiresIn(e.target.value),
                className: "w-full mt-1 bg-cyberdark-800 border border-cybergold-500/30 rounded-md px-3 py-2 text-cybergold-200",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "never", children: "Aldri" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "1h", children: "1 time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "24h", children: "24 timer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "7d", children: "7 dager" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "30d", children: "30 dager" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-cybergold-300", children: "Maks bruk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: maxUses,
                onChange: (e) => setMaxUses(e.target.value),
                placeholder: "Ubegrenset",
                className: "bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-cybergold-300", children: "Invitasjonslenke" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: inviteLink,
                readOnly: true,
                className: "bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 font-mono text-sm"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => copyToClipboard(inviteLink, "Lenke"),
                variant: "outline",
                size: "sm",
                className: "border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
                children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: generateNewLink,
            variant: "outline",
            size: "sm",
            className: "border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
            children: "Generer ny lenke"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-cybergold-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-5 w-5" }),
          "QR-kode"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-cybergold-300", children: "La andre skanne for rask tilgang" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "text-center", children: qrCodeUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: qrCodeUrl,
            alt: "QR-kode for gruppeinnvitasjon",
            className: "mx-auto border border-cybergold-500/30 rounded-lg"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => copyToClipboard(qrCodeUrl, "QR-kode"),
            variant: "outline",
            size: "sm",
            className: "border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4 mr-2" }),
              "Kopier QR-kode"
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-cyberdark-900 border-cybergold-500/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-cybergold-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-5 w-5" }),
          "Hurtigdeling"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-cybergold-300", children: "Del direkte til sosiale medier og meldingsapper" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("whatsapp"),
            variant: "outline",
            size: "sm",
            className: "border-green-500/30 text-green-400 hover:bg-green-500/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4 mr-2" }),
              "WhatsApp"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("telegram"),
            variant: "outline",
            size: "sm",
            className: "border-blue-500/30 text-blue-400 hover:bg-blue-500/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
              "Telegram"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("facebook"),
            variant: "outline",
            size: "sm",
            className: "border-blue-600/30 text-blue-500 hover:bg-blue-600/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { className: "h-4 w-4 mr-2" }),
              "Facebook"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("twitter"),
            variant: "outline",
            size: "sm",
            className: "border-sky-500/30 text-sky-400 hover:bg-sky-500/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "h-4 w-4 mr-2" }),
              "Twitter"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("linkedin"),
            variant: "outline",
            size: "sm",
            className: "border-blue-700/30 text-blue-600 hover:bg-blue-700/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-4 w-4 mr-2" }),
              "LinkedIn"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("email"),
            variant: "outline",
            size: "sm",
            className: "border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$1, { className: "h-4 w-4 mr-2" }),
              "E-post"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => shareVia("sms"),
            variant: "outline",
            size: "sm",
            className: "border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4 mr-2" }),
              "SMS"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => {
              if (navigator.share) {
                navigator.share({
                  title: `Bli med i ${groupName}`,
                  text: customMessage || `Bli med i "${groupName}" gruppen på SnakkaZ Beta!`,
                  url: inviteLink
                });
              } else {
                copyToClipboard(inviteLink, "Lenke");
              }
            },
            variant: "outline",
            size: "sm",
            className: "border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4 mr-2" }),
              "Mer"
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-sm text-cybergold-500", children: settings.isPublic ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
      "Offentlig gruppe - alle kan bli med"
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }),
      "Privat gruppe - kun inviterte kan bli med"
    ] }) })
  ] });
};
function CommunityEmailManager() {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [emails, setEmails] = reactExports.useState([]);
  const [isLoadingEmails, setIsLoadingEmails] = reactExports.useState(false);
  const [newEmailUsername, setNewEmailUsername] = reactExports.useState("");
  const [newEmailPassword, setNewEmailPassword] = reactExports.useState("");
  const [newEmailQuota, setNewEmailQuota] = reactExports.useState(250);
  const [passwordStrengthLevel, setPasswordStrengthLevel] = reactExports.useState(0);
  const [newPasswordVisible, setNewPasswordVisible] = reactExports.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = reactExports.useState(false);
  const [isCreatingEmail, setIsCreatingEmail] = reactExports.useState(false);
  const [isDeleting, setIsDeleting] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = reactExports.useState(false);
  const [resetUsername, setResetUsername] = reactExports.useState("");
  const [resetPassword, setResetPassword] = reactExports.useState("");
  const [isChangingPassword, setIsChangingPassword] = reactExports.useState(false);
  const [resetPasswordVisible, setResetPasswordVisible] = reactExports.useState(false);
  const [resetPasswordError, setResetPasswordError] = reactExports.useState(null);
  const [resetPasswordStrength, setResetPasswordStrength] = reactExports.useState(0);
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const strengthLabels = ["Svakt", "Middels", "Sterkt", "Svært sterkt"];
  reactExports.useEffect(() => {
    const fetchEmails = async () => {
      if (!user || !isPremium) return;
      setIsLoadingEmails(true);
      setError(null);
      try {
        const response = await fetch("/api/community/emails");
        const data = await response.json();
        if (data.success) {
          setEmails(data.emails || []);
        } else {
          setError(data.message || "Failed to load email accounts");
        }
      } catch (err) {
        setError("Could not connect to server");
        console.error("Error fetching emails:", err);
      } finally {
        setIsLoadingEmails(false);
      }
    };
    fetchEmails();
  }, [user, isPremium]);
  reactExports.useEffect(() => {
    if (newEmailPassword) {
      const strength = passwordStrength(newEmailPassword);
      setPasswordStrengthLevel(strength.id);
    } else {
      setPasswordStrengthLevel(0);
    }
  }, [newEmailPassword]);
  reactExports.useEffect(() => {
    if (resetPassword) {
      const strength = passwordStrength(resetPassword);
      setResetPasswordStrength(strength.id);
    } else {
      setResetPasswordStrength(0);
    }
  }, [resetPassword]);
  const handleCreateEmail = async (e) => {
    e.preventDefault();
    if (passwordStrengthLevel < 1) {
      toast({
        title: "Svakt passord",
        description: "Vennligst velg et sterkere passord",
        variant: "destructive"
      });
      return;
    }
    setIsCreatingEmail(true);
    setError(null);
    try {
      const response = await fetch("/api/community/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: newEmailUsername,
          password: newEmailPassword,
          quota: newEmailQuota
        })
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "E-post opprettet",
          description: `${data.email} har blitt opprettet`,
          variant: "default"
        });
        setEmails((prev) => [...prev, data.email]);
        setNewEmailUsername("");
        setNewEmailPassword("");
        setIsCreateDialogOpen(false);
      } else {
        setError(data.message || "Kunne ikke opprette e-postkonto");
        toast({
          title: "Feil ved opprettelse",
          description: data.message || "Kunne ikke opprette e-postkonto",
          variant: "destructive"
        });
      }
    } catch (err) {
      setError("Kunne ikke koble til serveren");
      console.error("Error creating email:", err);
    } finally {
      setIsCreatingEmail(false);
    }
  };
  const handleDeleteEmail = async (username) => {
    if (!confirm(`Er du sikker på at du vil slette ${username}@snakkaz.com?`)) {
      return;
    }
    setIsDeleting(username);
    try {
      const response = await fetch(`/api/community/emails/${username}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "E-post slettet",
          description: `${username}@snakkaz.com har blitt slettet`,
          variant: "default"
        });
        setEmails((prev) => prev.filter((email) => email.email_username !== username));
      } else {
        toast({
          title: "Feil ved sletting",
          description: data.message || "Kunne ikke slette e-postkonto",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error deleting email:", err);
      toast({
        title: "Feil ved sletting",
        description: "Kunne ikke koble til serveren",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };
  const handleResetPassword = async (username) => {
    setResetUsername(username);
    setResetPassword("");
    setResetPasswordError(null);
    setResetPasswordStrength(0);
    setIsResetPasswordDialogOpen(true);
  };
  const handleSubmitPasswordReset = async (e) => {
    e.preventDefault();
    if (resetPasswordStrength < 1) {
      toast({
        title: "Svakt passord",
        description: "Vennligst velg et sterkere passord",
        variant: "destructive"
      });
      return;
    }
    setIsChangingPassword(true);
    setResetPasswordError(null);
    try {
      const response = await fetch(`/api/community/emails/${resetUsername}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: resetPassword
        })
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Passord endret",
          description: `Passordet for ${resetUsername}@snakkaz.com har blitt endret`,
          variant: "default"
        });
        setIsResetPasswordDialogOpen(false);
        setResetPassword("");
      } else {
        setResetPasswordError(data.message || "Kunne ikke endre passord");
        toast({
          title: "Feil ved passordendring",
          description: data.message || "Kunne ikke endre passord",
          variant: "destructive"
        });
      }
    } catch (err) {
      setResetPasswordError("Kunne ikke koble til serveren");
      console.error("Error changing password:", err);
      toast({
        title: "Feil ved passordendring",
        description: "Kunne ikke koble til serveren",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopiert",
      description: `${text} kopiert til utklippstavlen`,
      variant: "default"
    });
  };
  const isLoading = isLoadingEmails || !user;
  if (!isPremium && !isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Fellesskap E-post" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Støtt felleskapet for å få din egen @snakkaz.com e-postadresse" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8 space-y-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$1, { size: 64, className: "text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "Få din egen @snakkaz.com e-postadresse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Som en del av vårt fellesskap kan du opprette din egen e-postadresse og bruke den med hvilken som helst e-postklient. Dette bidrar til å støtte plattformen." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "default", size: "lg", children: "Støtt Felleskapet" })
      ] }) })
    ] });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 24, className: "animate-spin" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 w-full max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isResetPasswordDialogOpen, onOpenChange: setIsResetPasswordDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Endre passord" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Endre passord for ",
          resetUsername,
          "@snakkaz.com"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmitPasswordReset, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reset-password", className: "text-right", children: "Nytt passord" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "reset-password",
                  type: resetPasswordVisible ? "text" : "password",
                  value: resetPassword,
                  onChange: (e) => setResetPassword(e.target.value),
                  placeholder: "********",
                  required: true,
                  minLength: 8
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "absolute inset-y-0 right-0 pr-3 flex items-center",
                  onClick: () => setResetPasswordVisible(!resetPasswordVisible),
                  children: resetPasswordVisible ? "Skjul" : "Vis"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex gap-1", children: [0, 1, 2, 3].map((level) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-1 flex-1 rounded ${level <= resetPasswordStrength ? strengthColors[resetPasswordStrength] : "bg-gray-200"}`
              },
              level
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-right mt-1", children: resetPassword ? strengthLabels[resetPasswordStrength] : "" })
          ] })
        ] }) }),
        resetPasswordError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { children: "Feil" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: resetPasswordError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isChangingPassword || !resetPassword,
            children: isChangingPassword ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Endrer passord..."
            ] }) : "Endre passord"
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Fellesskap E-postadresser" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Administrer dine @snakkaz.com e-postadresser" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isCreateDialogOpen, onOpenChange: setIsCreateDialogOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Ny e-postadresse"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Opprett ny e-postadresse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Lag en ny @snakkaz.com e-postadresse som støtter vårt fellesskap" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreateEmail, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "username", className: "text-right", children: "Brukernavn" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3 flex items-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "username",
                        value: newEmailUsername,
                        onChange: (e) => setNewEmailUsername(e.target.value.toLowerCase()),
                        placeholder: "brukernavn",
                        required: true,
                        autoComplete: "off",
                        pattern: "[a-zA-Z0-9._-]+",
                        title: "Kun bokstaver, tall, punktum, bindestrek og understrek er tillatt"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-muted-foreground", children: "@snakkaz.com" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "text-right", children: "Passord" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "password",
                          type: newPasswordVisible ? "text" : "password",
                          value: newEmailPassword,
                          onChange: (e) => setNewEmailPassword(e.target.value),
                          placeholder: "********",
                          required: true,
                          minLength: 8
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          className: "absolute inset-y-0 right-0 pr-3 flex items-center",
                          onClick: () => setNewPasswordVisible(!newPasswordVisible),
                          children: newPasswordVisible ? "Skjul" : "Vis"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex gap-1", children: [0, 1, 2, 3].map((level) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `h-1 flex-1 rounded ${level <= passwordStrengthLevel ? strengthColors[passwordStrengthLevel] : "bg-gray-200"}`
                      },
                      level
                    )) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-right mt-1", children: newEmailPassword ? strengthLabels[passwordStrengthLevel] : "" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "quota", className: "text-right", children: "Kvote" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "quota",
                        type: "number",
                        value: newEmailQuota,
                        onChange: (e) => setNewEmailQuota(parseInt(e.target.value) || 250),
                        min: 100,
                        max: 2e3
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "MB" })
                  ] })
                ] })
              ] }),
              error && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { children: "Feil" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: isCreatingEmail || !newEmailUsername || !newEmailPassword,
                  children: isCreatingEmail ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4 animate-spin" }),
                    "Oppretter..."
                  ] }) : "Opprett e-postadresse"
                }
              ) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoadingEmails ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 24, className: "animate-spin" }) }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { children: "Feil" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error })
      ] }) : emails.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$1, { className: "mx-auto h-12 w-12 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-lg font-semibold", children: "Ingen e-postadresser" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Du har ikke opprettet noen @snakkaz.com e-postadresser ennå." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: emails.map((email) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", children: email.email_address }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => copyToClipboard(email.email_address),
                className: "text-muted-foreground hover:text-foreground",
                title: "Kopier e-postadresse",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            new Date(email.created_at).toLocaleDateString("nb-NO"),
            " • ",
            email.quota_mb,
            " MB kvote"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => handleResetPassword(email.email_username),
              children: "Nytt passord"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              asChild: true,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://webmail.snakkaz.com",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$1, { className: "mr-1 h-4 w-4" }),
                    " Webmail",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "ml-1 h-3 w-3" })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              size: "sm",
              disabled: isDeleting === email.email_username,
              onClick: () => handleDeleteEmail(email.email_username),
              children: isDeleting === email.email_username ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }) }, email.id)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "E-postinnstillinger" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Bruk disse innstillingene for å konfigurere din e-postklient" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-2", children: "Innkommende e-post (IMAP)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Server:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "mail.snakkaz.com" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Port:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "993" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Sikkerhet:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "SSL/TLS" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-2", children: "Utgående e-post (SMTP)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Server:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "mail.snakkaz.com" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Port:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "465" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Sikkerhet:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "SSL/TLS" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-2", children: "Webmail" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Du kan også få tilgang til din e-post gjennom webmail:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "https://webmail.snakkaz.com",
              target: "_blank",
              rel: "noopener noreferrer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$1, { className: "mr-2 h-4 w-4" }),
                "Åpne Webmail",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "ml-2 h-4 w-4" })
              ]
            }
          ) })
        ] })
      ] }) })
    ] })
  ] });
}
const EnhancedFriendsList = ({ currentUserId }) => {
  dist.useSupabaseClient();
  const { toast } = useToast$1();
  const [friends, setFriends] = reactExports.useState([]);
  const [incomingRequests, setIncomingRequests] = reactExports.useState([]);
  const [outgoingRequests, setOutgoingRequests] = reactExports.useState([]);
  const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = reactExports.useState(false);
  const [searchUsername, setSearchUsername] = reactExports.useState("");
  const [searchResults, setSearchResults] = reactExports.useState([]);
  const [isSearching, setIsSearching] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!currentUserId) return;
    fetchFriendsAndRequests();
  }, [currentUserId]);
  const fetchFriendsAndRequests = async () => {
    try {
      setFriends([
        {
          id: "1",
          username: "alex_tech",
          avatar_url: "/avatars/alex.png",
          status: "online",
          lastActive: /* @__PURE__ */ new Date()
        },
        {
          id: "2",
          username: "sarah_design",
          avatar_url: "/avatars/sarah.png",
          status: "offline",
          lastActive: new Date(Date.now() - 8 * 60 * 60 * 1e3)
        },
        {
          id: "3",
          username: "mike_dev",
          avatar_url: "/avatars/mike.png",
          status: "away",
          lastActive: new Date(Date.now() - 30 * 60 * 1e3)
        }
      ]);
      setIncomingRequests([
        {
          id: "4",
          username: "emma_newuser",
          avatar_url: "/avatars/emma.png",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3)
        }
      ]);
      setOutgoingRequests([
        {
          id: "5",
          username: "david_code",
          avatar_url: "/avatars/david.png",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3)
        }
      ]);
    } catch (error) {
      console.error("Error fetching friends data:", error);
      toast({
        title: "Error",
        description: "Failed to load friends list. Please try again.",
        variant: "destructive"
      });
    }
  };
  const searchUsers = async () => {
    if (!searchUsername.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      setTimeout(() => {
        setSearchResults([
          {
            id: "6",
            username: `${searchUsername}_matched`,
            avatar_url: "/avatars/user1.png"
          },
          {
            id: "7",
            username: `user_${searchUsername}`,
            avatar_url: "/avatars/user2.png"
          }
        ]);
        setIsSearching(false);
      }, 500);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Search Error",
        description: "Failed to search for users. Please try again.",
        variant: "destructive"
      });
      setIsSearching(false);
    }
  };
  const sendFriendRequest = async (userId) => {
    try {
      const user = searchResults.find((user2) => user2.id === userId);
      setOutgoingRequests((prev) => [...prev, {
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        createdAt: /* @__PURE__ */ new Date()
      }]);
      setSearchResults((prev) => prev.filter((user2) => user2.id !== userId));
      toast({
        title: "Friend Request Sent",
        description: `Friend request sent to ${user.username}`
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive"
      });
    }
  };
  const acceptFriendRequest = async (requestId) => {
    try {
      const request = incomingRequests.find((req) => req.id === requestId);
      setFriends((prev) => [...prev, {
        id: request.id,
        username: request.username,
        avatar_url: request.avatar_url,
        status: "offline",
        lastActive: /* @__PURE__ */ new Date()
      }]);
      setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast({
        title: "Friend Request Accepted",
        description: `You are now friends with ${request.username}`
      });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to accept friend request. Please try again.",
        variant: "destructive"
      });
    }
  };
  const rejectFriendRequest = async (requestId) => {
    try {
      const request = incomingRequests.find((req) => req.id === requestId);
      setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast({
        title: "Friend Request Rejected",
        description: `Rejected friend request from ${request.username}`
      });
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to reject friend request. Please try again.",
        variant: "destructive"
      });
    }
  };
  const cancelFriendRequest = async (requestId) => {
    try {
      const request = outgoingRequests.find((req) => req.id === requestId);
      setOutgoingRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast({
        title: "Request Cancelled",
        description: `Cancelled friend request to ${request.username}`
      });
    } catch (error) {
      console.error("Error cancelling friend request:", error);
      toast({
        title: "Error",
        description: "Failed to cancel friend request. Please try again.",
        variant: "destructive"
      });
    }
  };
  const removeFriend = async (friendId) => {
    try {
      const friend = friends.find((f) => f.id === friendId);
      setFriends((prev) => prev.filter((f) => f.id !== friendId));
      toast({
        title: "Friend Removed",
        description: `${friend.username} has been removed from your friends`
      });
    } catch (error) {
      console.error("Error removing friend:", error);
      toast({
        title: "Error",
        description: "Failed to remove friend. Please try again.",
        variant: "destructive"
      });
    }
  };
  const formatTimeAgo = (date) => {
    const now = /* @__PURE__ */ new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1e3));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1e3));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1e3));
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-cybergold-200", children: "Friends" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "flex items-center gap-1",
          onClick: () => setIsAddFriendDialogOpen(true),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "all", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "all", children: [
          "All",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-2", children: friends.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "online", children: [
          "Online",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-2", children: friends.filter((f) => f.status === "online").length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "pending", children: [
          "Pending",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-2", children: incomingRequests.length + outgoingRequests.length })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "all", className: "space-y-4", children: friends.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 text-sm text-cybergold-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your friends list is empty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Add friends to start chatting" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[400px] pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: friends.map((friend) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between rounded-md p-2 hover:bg-cyberdark-800/50 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  UserAvatar,
                  {
                    src: friend.avatar_url,
                    alt: friend.username,
                    className: "h-10 w-10"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(friend.status)}`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-cybergold-200", children: friend.username }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-500", children: friend.status === "online" ? "Online" : `Last seen ${formatTimeAgo(friend.lastActive)}` })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 px-2", children: "Message" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20",
                  onClick: () => removeFriend(friend.id),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundX, { className: "h-4 w-4" })
                }
              )
            ] })
          ]
        },
        friend.id
      )) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "online", className: "space-y-4", children: friends.filter((f) => f.status === "online").length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-sm text-cybergold-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No friends are currently online" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[400px] pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: friends.filter((f) => f.status === "online").map((friend) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between rounded-md p-2 hover:bg-cyberdark-800/50 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  UserAvatar,
                  {
                    src: friend.avatar_url,
                    alt: friend.username,
                    className: "h-10 w-10"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-cybergold-200", children: friend.username }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cybergold-500", children: "Online" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 px-2", children: "Message" })
          ]
        },
        friend.id
      )) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "pending", className: "space-y-6", children: incomingRequests.length === 0 && outgoingRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-sm text-cybergold-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No pending friend requests" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        incomingRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-cybergold-300", children: "Incoming Requests" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[150px] pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: incomingRequests.map((request) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between rounded-md p-2 bg-cyberdark-800/30",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    UserAvatar,
                    {
                      src: request.avatar_url,
                      alt: request.username,
                      className: "h-10 w-10"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-cybergold-200", children: request.username }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cybergold-500", children: [
                      "Requested ",
                      formatTimeAgo(request.createdAt)
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-900/20",
                      onClick: () => acceptFriendRequest(request.id),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20",
                      onClick: () => rejectFriendRequest(request.id),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ]
            },
            request.id
          )) }) })
        ] }),
        outgoingRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-cybergold-300", children: "Outgoing Requests" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[150px] pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: outgoingRequests.map((request) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between rounded-md p-2 bg-cyberdark-800/30",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    UserAvatar,
                    {
                      src: request.avatar_url,
                      alt: request.username,
                      className: "h-10 w-10"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-cybergold-200", children: request.username }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cybergold-500", children: [
                      "Sent ",
                      formatTimeAgo(request.createdAt)
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-8 w-8 text-gray-400 hover:text-gray-300",
                      onClick: () => cancelFriendRequest(request.id),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "h-8 px-2 flex items-center gap-1",
                      disabled: true,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pending" })
                      ]
                    }
                  )
                ] })
              ]
            },
            request.id
          )) }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isAddFriendDialogOpen, onOpenChange: setIsAddFriendDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Friend" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search by username",
              value: searchUsername,
              onChange: (e) => setSearchUsername(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") searchUsers();
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "default",
              onClick: searchUsers,
              disabled: isSearching,
              children: isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", children: "Searching..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 mr-1" }),
                "Search"
              ] })
            }
          )
        ] }),
        searchResults.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: searchResults.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between p-2 rounded-md hover:bg-cyberdark-800/50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  UserAvatar,
                  {
                    src: user.avatar_url,
                    alt: user.username,
                    className: "h-10 w-10"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: user.username })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => sendFriendRequest(user.id),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-1" }),
                    "Send Request"
                  ]
                }
              )
            ]
          },
          user.id
        )) }) }) : searchUsername && !isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-cybergold-500 py-6", children: [
          "No users found matching '",
          searchUsername,
          "'"
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setIsAddFriendDialogOpen(false), children: "Close" }) })
    ] }) })
  ] });
};
const SecurityBadge = ({
  securityLevel,
  connectionState,
  dataChannelState,
  usingServerFallback,
  size = "md",
  isPremium = false
  // Standard verdi
}) => {
  const isConnected = connectionState === "connected" && dataChannelState === "open";
  const fallback = usingServerFallback === true;
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7"
  };
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  let Icon = Shield;
  const colors = securityColors[securityLevel];
  let title = "";
  switch (securityLevel) {
    case "p2p_e2ee":
      if (fallback) {
        Icon = ShieldAlert;
        title = isPremium ? "Premium P2P Kryptering (Fallback)" : "P2P Kryptering (Fallback)";
      } else if (!isConnected && (connectionState || dataChannelState)) {
        Icon = ShieldAlert;
        title = isPremium ? "Premium P2P Kryptering (Kobler til...)" : "P2P Kryptering (Kobler til...)";
      } else {
        Icon = ShieldCheck;
        title = isPremium ? "256-bit Peer-to-Peer Kryptering" : "Peer-to-Peer End-to-End Kryptering";
      }
      break;
    case "server_e2ee":
      Icon = ShieldCheck;
      title = isPremium ? "256-bit Server Kryptering" : "Server End-to-End Kryptering";
      break;
    case "standard":
      Icon = Shield;
      title = isPremium ? "Forbedret Standard Kryptering" : "Standard Kryptering";
      break;
  }
  const premiumGlowClass = isPremium ? "shadow-lg shadow-cybergold-500/20" : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn$1(
        "flex items-center justify-center rounded-full transition-all duration-300",
        colors.bg,
        colors.glow,
        sizeClasses[size],
        isPremium && "border border-cybergold-500/40",
        premiumGlowClass
      ),
      title,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn$1(
        iconSizes[size],
        isPremium ? "text-cybergold-300" : colors.primary
      ) })
    }
  );
};
export {
  AppHeader as A,
  CommunityEmailManager as C,
  DeveloperTools as D,
  EnhancedFriendRequestHandler as E,
  FreeUserNavigation as F,
  GroupInviteSystem as G,
  MathCaptcha as M,
  PreviewBanner as P,
  SnakkaZLogo as S,
  UnifiedLayout as U,
  __vitePreload as _,
  SnakkaZInviteSystem as a,
  MobileBottomNav as b,
  cn as c,
  MobileChatHeader as d,
  MobileBottomNavImproved as e,
  SmartMobileNav as f,
  MobileLayout as g,
  UnifiedNavigation as h,
  isMobile as i,
  FriendsSearchSection as j,
  SubscriptionPage as k,
  EnhancedRegisterForm as l,
  EnhancedAvatarUpload as m,
  EnhancedFriendsList as n,
  UserAvatar as o,
  pwaManager as p,
  SecurityBadge as q,
  PWAHead as r,
  MobileOptimization as s,
  MobileLaunchBanner as t,
  DynamicProfile$1 as u,
  DynamicSettings$1 as v,
  DynamicMail$1 as w,
  DynamicMemoryDashboard$1 as x
};
//# sourceMappingURL=components-ui-DbvoVZ_f.js.map
