const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/js/pages-auth-C99zA94W.js","assets/js/vendor-react-core-CyGCi7_O.js","assets/js/vendor-react-dom-CmO8M2b9.js","assets/js/vendor-misc-CRWzYzLL.js","assets/js/vendor-database-B5DXUHcM.js","assets/js/components-ui-Sda0rfnS.js","assets/js/app-utils-CtXfdYCF.js","assets/js/vendor-style-utils-nLA3zUC6.js","assets/js/app-services-BZbsNCWt.js","assets/js/vendor-security-LdHy7Pt9.js","assets/js/vendor-router-CZX58RAI.js","assets/js/vendor-media-C0-DdFv4.js","assets/js/vendor-animation-CVvLNU1S.js","assets/js/vendor-network-BSBq6A-N.js","assets/js/vendor-react-hooks-BjXJdcQR.js","assets/js/vendor-radix-ui-UJNVxv2C.js","assets/js/vendor-validation-CGrgBlxR.js","assets/js/pages-main-CUJyNFRV.js","assets/css/pages-main-mrR2Awbu.css","assets/js/pages-chat-DwozXIlq.js","assets/js/DynamicGroupChatPage-BXGf9Plw.js","assets/js/GroupChatPage-C1xp79yM.js","assets/js/EnhancedGroupChat-DMH6uWtJ.js","assets/js/vendor-date-utils-D2GbuEg1.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { r as reactExports, j as jsxRuntimeExports } from "./vendor-react-core-CyGCi7_O.js";
import { h as bootstrapSecurityFeatures, v as verifySupabaseConfig } from "./app-services-BZbsNCWt.js";
import { c as createRoot } from "./vendor-react-dom-CmO8M2b9.js";
import { _ as __vitePreload, P as PreviewBanner, D as DeveloperTools, r as PWAHead, s as MobileOptimization, t as MobileLaunchBanner } from "./components-ui-Sda0rfnS.js";
import { B as BrowserRouter, R as Routes, d as Route, N as Navigate, a as useLocation } from "./vendor-router-CZX58RAI.js";
import { ap as AuthProvider, aq as Toaster, u as useAuth } from "./app-utils-CtXfdYCF.js";
import "./vendor-radix-ui-UJNVxv2C.js";
import "./vendor-misc-CRWzYzLL.js";
import "./vendor-database-B5DXUHcM.js";
import "./vendor-react-hooks-BjXJdcQR.js";
import "./vendor-security-LdHy7Pt9.js";
import "./vendor-style-utils-nLA3zUC6.js";
import "./vendor-media-C0-DdFv4.js";
import "./vendor-animation-CVvLNU1S.js";
import "./vendor-network-BSBq6A-N.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
(function patchVendorMiscReactExports() {
  if (typeof window === "undefined") return;
  console.log("🚨 VENDOR-MISC PATCH: Applying specific fix for reactExports.useLayoutEffect issue");
  window.reactExports = window.reactExports || {};
  window.reactExports.useLayoutEffect = window.reactExports.useLayoutEffect || function(effect, deps) {
    console.log("🔧 VENDOR-MISC PATCH: Emergency useLayoutEffect called");
    if (typeof effect === "function") {
      try {
        const cleanup = effect();
        return typeof cleanup === "function" ? cleanup : () => {
        };
      } catch (e) {
        console.warn("VENDOR-MISC PATCH: useLayoutEffect error:", e);
        return () => {
        };
      }
    }
    return () => {
    };
  };
  window.reactExports.useEffect = window.reactExports.useEffect || window.reactExports.useLayoutEffect;
  window.reactExports.useState = window.reactExports.useState || function(initialState) {
    console.log("🔧 VENDOR-MISC PATCH: Emergency useState called");
    let state = initialState;
    const setState = (newState) => {
      if (typeof newState === "function") {
        state = newState(state);
      } else {
        state = newState;
      }
    };
    return [state, setState];
  };
  if (typeof Proxy !== "undefined") {
    try {
      window.reactExports = new Proxy(window.reactExports, {
        set(target, prop, value) {
          if (prop === "useLayoutEffect" && typeof value === "function") {
            console.log("🔧 VENDOR-MISC PATCH: Real useLayoutEffect detected, using it");
            target[prop] = value;
          } else if (!target[prop] || typeof value === "function") {
            target[prop] = value;
          }
          return true;
        },
        get(target, prop) {
          if (prop in target) {
            return target[prop];
          }
          if (typeof prop === "string" && prop.startsWith("use")) {
            console.warn(`🔧 VENDOR-MISC PATCH: Missing React hook ${prop}, providing emergency fallback`);
            return () => {
            };
          }
          return target[prop];
        }
      });
    } catch (e) {
      console.warn("VENDOR-MISC PATCH: Proxy not supported, using direct object");
    }
  }
  console.log("✅ VENDOR-MISC PATCH: Applied successfully");
})();
class SnakkazPerformanceMonitor {
  constructor() {
    __publicField(this, "metrics", {});
    __publicField(this, "observers", []);
    this.initializeMonitoring();
  }
  initializeMonitoring() {
    this.observeLargestContentfulPaint();
    this.observeFirstInputDelay();
    this.observeCumulativeLayoutShift();
    this.observePageLoadMetrics();
    this.monitorChatResponseTime();
    this.monitorNavigationSpeed();
    console.log("🇳🇴 Snakkaz Performance Monitor: Active for norsk tech community");
  }
  observeLargestContentfulPaint() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      if (lastEntry.startTime > 2500) {
        console.warn("🚨 LCP > 2.5s - May impact Norwegian user experience");
        this.reportSlowPerformance("LCP", lastEntry.startTime);
      } else {
        console.log(`✅ LCP: ${Math.round(lastEntry.startTime)}ms - Excellent for norsk community`);
      }
    });
    observer.observe({ entryTypes: ["largest-contentful-paint"] });
    this.observers.push(observer);
  }
  observeFirstInputDelay() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = entry.processingStart - entry.startTime;
        this.metrics.fid = fid;
        if (fid > 100) {
          console.warn("🚨 FID > 100ms - Chat responsiveness may be affected");
        } else {
          console.log(`✅ FID: ${Math.round(fid)}ms - Responsive for norsk tech users`);
        }
      }
    });
    observer.observe({ entryTypes: ["first-input"] });
    this.observers.push(observer);
  }
  observeCumulativeLayoutShift() {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.cls = clsValue;
      if (clsValue > 0.1) {
        console.warn("🚨 CLS > 0.1 - Layout shifts may confuse Norwegian users");
      } else {
        console.log(`✅ CLS: ${clsValue.toFixed(3)} - Stable layout for community`);
      }
    });
    observer.observe({ entryTypes: ["layout-shift"] });
    this.observers.push(observer);
  }
  observePageLoadMetrics() {
    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType("navigation")[0];
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      const firstByte = navigation.responseStart - navigation.fetchStart;
      this.metrics.loadTime = loadTime;
      this.metrics.domContentLoaded = domContentLoaded;
      this.metrics.ttfb = firstByte;
      console.log(`📊 Page Load Metrics for Norwegian Tech Community:`);
      console.log(`   ⚡ Total Load: ${Math.round(loadTime)}ms`);
      console.log(`   🏗️  DOM Ready: ${Math.round(domContentLoaded)}ms`);
      console.log(`   🌐 First Byte: ${Math.round(firstByte)}ms`);
      this.reportLoadMetrics({
        loadTime,
        domContentLoaded,
        firstByte,
        userAgent: navigator.userAgent,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        location: "Norway"
        // Can be enhanced with IP geolocation
      });
    });
  }
  monitorChatResponseTime() {
    window.addEventListener("chat-message-sent", (event) => {
      const startTime = performance.now();
      const responseHandler = (responseEvent) => {
        if (responseEvent.detail.messageId === event.detail.messageId) {
          const responseTime = performance.now() - startTime;
          this.metrics.chatResponseTime = responseTime;
          if (responseTime > 500) {
            console.warn(`🚨 Chat response time: ${Math.round(responseTime)}ms - May affect UX`);
          } else {
            console.log(`💬 Chat response: ${Math.round(responseTime)}ms - Good for community`);
          }
          window.removeEventListener("chat-message-received", responseHandler);
        }
      };
      window.addEventListener("chat-message-received", responseHandler);
    });
  }
  monitorNavigationSpeed() {
    let navigationStart = 0;
    window.addEventListener("navigation-start", () => {
      navigationStart = performance.now();
    });
    window.addEventListener("navigation-complete", () => {
      if (navigationStart > 0) {
        const navigationTime = performance.now() - navigationStart;
        this.metrics.navigationTime = navigationTime;
        if (navigationTime > 200) {
          console.warn(`🚨 Navigation time: ${Math.round(navigationTime)}ms - Consider optimization`);
        } else {
          console.log(`🧭 Navigation: ${Math.round(navigationTime)}ms - Smooth for users`);
        }
      }
    });
  }
  reportSlowPerformance(metric, value) {
    console.log(`📈 Performance Alert: ${metric} = ${Math.round(value)}ms`);
    if (typeof window !== "undefined" && "navigator" in window) {
      const connection = navigator.connection;
      if (connection) {
        console.log(`📶 Connection: ${connection.effectiveType} (${connection.downlink}Mbps)`);
      }
    }
  }
  reportLoadMetrics(metrics) {
    console.log("📊 Detailed Performance Report for Norwegian Tech Community:");
    console.table(metrics);
  }
  getMetrics() {
    return { ...this.metrics };
  }
  getPerformanceGrade() {
    const { lcp, fid, cls, loadTime } = this.metrics;
    if (lcp <= 2e3 && fid <= 50 && cls <= 0.05 && loadTime <= 3e3) return "A";
    if (lcp <= 2500 && fid <= 100 && cls <= 0.1 && loadTime <= 4e3) return "B";
    if (lcp <= 3e3 && fid <= 200 && cls <= 0.15 && loadTime <= 5e3) return "C";
    if (lcp <= 4e3 && fid <= 300 && cls <= 0.25 && loadTime <= 7e3) return "D";
    return "F";
  }
  generateReport() {
    const grade = this.getPerformanceGrade();
    const metrics = this.getMetrics();
    return `
🇳🇴 SNAKKAZ PERFORMANCE RAPPORT
===============================
Grade: ${grade} ${grade === "A" ? "🏆" : grade === "B" ? "✅" : grade === "C" ? "⚠️" : "🚨"}

Core Web Vitals:
- LCP: ${Math.round(metrics.lcp || 0)}ms ${(metrics.lcp || 0) <= 2500 ? "✅" : "🚨"}
- FID: ${Math.round(metrics.fid || 0)}ms ${(metrics.fid || 0) <= 100 ? "✅" : "🚨"}  
- CLS: ${(metrics.cls || 0).toFixed(3)} ${(metrics.cls || 0) <= 0.1 ? "✅" : "🚨"}

App Performance:
- Load Time: ${Math.round(metrics.loadTime || 0)}ms
- Chat Response: ${Math.round(metrics.chatResponseTime || 0)}ms
- Navigation: ${Math.round(metrics.navigationTime || 0)}ms

Status: ${grade === "A" || grade === "B" ? "Ready for Norwegian tech community! 🚀" : "Needs optimization for optimal UX 🔧"}
    `.trim();
  }
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    console.log("🔌 Performance Monitor: Disconnected");
  }
}
if (typeof window !== "undefined") {
  window.snakkazPerformance = new SnakkazPerformanceMonitor();
  setTimeout(() => {
    const report = window.snakkazPerformance.generateReport();
    console.log(report);
  }, 5e3);
}
const Login = reactExports.lazy(() => __vitePreload(() => import("./pages-auth-C99zA94W.js").then((n) => n.L), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]) : void 0));
const Register = reactExports.lazy(() => __vitePreload(() => import("./pages-auth-C99zA94W.js").then((n) => n.R), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]) : void 0));
const EmailConfirmation = reactExports.lazy(() => __vitePreload(() => import("./pages-auth-C99zA94W.js").then((n) => n.E), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]) : void 0));
const ForgotPassword = reactExports.lazy(() => __vitePreload(() => import("./pages-auth-C99zA94W.js").then((n) => n.F), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]) : void 0));
const ResetPassword = reactExports.lazy(() => __vitePreload(() => import("./pages-auth-C99zA94W.js").then((n) => n.a), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]) : void 0));
const Info = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.I), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
reactExports.lazy(() => __vitePreload(() => import("./pages-chat-DwozXIlq.js").then((n) => n.B), true ? __vite__mapDeps([19,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) : void 0));
const ChatPageNew = reactExports.lazy(() => __vitePreload(() => import("./pages-chat-DwozXIlq.js").then((n) => n.C), true ? __vite__mapDeps([19,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) : void 0));
const BasicChatPage = reactExports.lazy(() => __vitePreload(() => import("./pages-chat-DwozXIlq.js").then((n) => n.B), true ? __vite__mapDeps([19,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) : void 0));
const AIChatPage$1 = reactExports.lazy(() => __vitePreload(() => Promise.resolve().then(() => AIChatPage), true ? void 0 : void 0));
const PWADemo = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.P), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const MobileTestPage = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.M), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const ImprovedMobileTest = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.a), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const FinalMobileTest = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.F), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const CompleteMobileTest = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.C), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const LiquidGlassDemo = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.L), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0).then((module) => ({ default: module.LiquidGlassDemo })));
const SnakkaZChatBeta = reactExports.lazy(() => __vitePreload(() => import("./pages-chat-DwozXIlq.js").then((n) => n.S), true ? __vite__mapDeps([19,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) : void 0));
const SnakkaZBetaLanding = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.S), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const CreateGroupPage = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.b), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const GroupChatPage = reactExports.lazy(() => __vitePreload(() => import("./DynamicGroupChatPage-BXGf9Plw.js"), true ? __vite__mapDeps([20,5,1,2,3,4,6,7,8,9,10,14,15,11,12,13]) : void 0));
const FriendsPage = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.c), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const FindFriends = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.d), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const ProfilePage = reactExports.lazy(() => __vitePreload(() => import("./components-ui-Sda0rfnS.js").then((n) => n.u), true ? __vite__mapDeps([5,1,2,3,4,6,7,8,9,10,14,15,11,12,13]) : void 0));
const ProfilePageNew = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.e), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const SettingsPage = reactExports.lazy(() => __vitePreload(() => import("./components-ui-Sda0rfnS.js").then((n) => n.v), true ? __vite__mapDeps([5,1,2,3,4,6,7,8,9,10,14,15,11,12,13]) : void 0));
const DashboardPage = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.D), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const Mail = reactExports.lazy(() => __vitePreload(() => import("./components-ui-Sda0rfnS.js").then((n) => n.w), true ? __vite__mapDeps([5,1,2,3,4,6,7,8,9,10,14,15,11,12,13]) : void 0));
const MCPDashboard = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.f), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const MemoryDashboard = reactExports.lazy(() => __vitePreload(() => import("./components-ui-Sda0rfnS.js").then((n) => n.x), true ? __vite__mapDeps([5,1,2,3,4,6,7,8,9,10,14,15,11,12,13]) : void 0));
const Subscription = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.g), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const AdminSecurityPanel = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.A), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const InviteSystemDemo = reactExports.lazy(() => __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.h), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0));
const LoadingSpinner = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen flex items-center justify-center bg-cyberdark-950", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cybergold-500 mb-4" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-400", children: "Laster inn..." })
] }) });
const SimpleFallbackError = ({ resetApp }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen flex items-center justify-center bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center max-w-md p-6 bg-gray-900 rounded-lg shadow-lg", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl text-yellow-400 mb-4", children: "Noe gikk galt" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white mb-4", children: "Vi beklager, men det har oppstått en feil i Snakkaz Chat." }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: resetApp,
      className: "px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-medium rounded",
      children: "Last siden på nytt"
    }
  )
] }) });
function SuperSimpleErrorBoundary({ children }) {
  const [hasError, setHasError] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);
  const resetApp = () => {
    window.location.reload();
  };
  if (hasError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleFallbackError, { resetApp });
  }
  return children;
}
const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
  }
  return children;
};
const AuthAwareRedirect = ({ fallback = "/beta" }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {});
  }
  if (user) {
    const isBetaUser = localStorage.getItem("snakkaz_beta_user") === "true";
    if (isBetaUser) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/beta-chat", replace: true });
    } else {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/basic-chat", replace: true });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: fallback, replace: true });
};
const preloadComponents = () => {
  try {
    setTimeout(() => {
      __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.i), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0);
      __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.j), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0);
    }, 2e3);
    setTimeout(() => {
      if (localStorage.getItem("sb-xkrjfnrrngwovrhcotpj-auth-token")) {
        __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.k), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0);
        __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.d), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0);
      }
    }, 4e3);
    setTimeout(() => {
      var _a;
      const userProfile = localStorage.getItem("snakkaz_user_profile");
      if (userProfile && ((_a = JSON.parse(userProfile)) == null ? void 0 : _a.isPremium)) {
        __vitePreload(() => Promise.resolve().then(() => AIChatPage), true ? void 0 : void 0);
      }
    }, 6e3);
    setTimeout(() => {
      __vitePreload(() => import("./pages-main-CUJyNFRV.js").then((n) => n.b), true ? __vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,18]) : void 0);
      __vitePreload(() => import("./GroupChatPage-C1xp79yM.js"), true ? __vite__mapDeps([21,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,22,23]) : void 0);
    }, 8e3);
  } catch (e) {
  }
};
const detectSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  if (parts.length > 2) {
    const subdomain = parts[0];
    const allowedSubdomains = ["dash", "business", "docs", "analytics", "mcp", "help"];
    if (allowedSubdomains.includes(subdomain)) {
      console.log(`🌐 Snakkaz Chat: Detected subdomain "${subdomain}" - configuring app...`);
      return subdomain;
    } else {
      console.log(`⚠️ Snakkaz Chat: Unknown subdomain "${subdomain}" detected`);
    }
  } else {
    console.log(`🏠 Snakkaz Chat: Running on main domain (${hostname})`);
  }
  return null;
};
const SubdomainRouter = () => {
  const subdomain = detectSubdomain();
  reactExports.useEffect(() => {
    if (subdomain) {
      sessionStorage.setItem("snakkaz_subdomain", subdomain);
      sessionStorage.setItem("snakkaz_subdomain_timestamp", (/* @__PURE__ */ new Date()).toISOString());
      switch (subdomain) {
        case "dash":
          document.title = "Snakkaz Chat - Dashboard";
          console.log("📊 Dashboard mode activated");
          break;
        case "business":
          document.title = "Snakkaz Chat - Business";
          console.log("💼 Business mode activated");
          break;
        case "docs":
          document.title = "Snakkaz Chat - Documentation";
          console.log("📚 Documentation mode activated");
          break;
        case "analytics":
          document.title = "Snakkaz Chat - Analytics";
          console.log("📈 Analytics mode activated");
          break;
        case "mcp":
          document.title = "Snakkaz Chat - MCP";
          console.log("🔗 MCP mode activated");
          break;
        case "help":
          document.title = "Snakkaz Chat - Help";
          console.log("❓ Help mode activated");
          break;
      }
      sessionStorage.setItem("snakkaz_app_mode", subdomain);
    } else {
      document.title = "Snakkaz Chat";
      sessionStorage.setItem("snakkaz_app_mode", "main");
      console.log("🏠 Main app mode activated");
    }
  }, [subdomain]);
  if (subdomain === "mcp") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MCPDashboard, {});
  }
  return null;
};
function App() {
  const [isPreviewEnv, setIsPreviewEnv] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const initApp = async () => {
      try {
        await bootstrapSecurityFeatures();
        console.log("Security features initialized");
        verifySupabaseConfig();
        setIsPreviewEnv(false);
        console.log("Running in PRODUCTION environment - preview disabled");
      } catch (error) {
        console.error("Failed to initialize application:", error);
      }
    };
    initApp();
  }, []);
  reactExports.useEffect(() => {
    preloadComponents();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SuperSimpleErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BrowserRouter, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SubdomainRouter, {}),
      isPreviewEnv && /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewBanner, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/login", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Login, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/register", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Register, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/email-confirmation", element: /* @__PURE__ */ jsxRuntimeExports.jsx(EmailConfirmation, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/forgot-password", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ForgotPassword, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/reset-password", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ResetPassword, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/info", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/mobile-test", element: /* @__PURE__ */ jsxRuntimeExports.jsx(MobileTestPage, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/complete-mobile-test", element: /* @__PURE__ */ jsxRuntimeExports.jsx(CompleteMobileTest, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/improved-mobile-test", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ImprovedMobileTest, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/final-mobile-test", element: /* @__PURE__ */ jsxRuntimeExports.jsx(FinalMobileTest, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/final-mobile-test", element: /* @__PURE__ */ jsxRuntimeExports.jsx(FinalMobileTest, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/liquid-glass-demo", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LiquidGlassDemo, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/beta", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SnakkaZBetaLanding, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/beta-chat",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SnakkaZChatBeta, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/basic-chat",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BasicChatPage, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/chat",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/basic-chat", replace: true }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/chat/*",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/basic-chat", replace: true }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/friends",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FriendsPage, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/find-friends",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FindFriends, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/group-chat",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(GroupChatPage, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/ai-chat",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AIChatPage$1, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/create-group",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreateGroupPage, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/profile",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfilePage, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/profile-new",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfilePageNew, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/dashboard",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/mail",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/settings",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPage, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/group/:id",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(GroupChatPage, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/subscription",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Subscription, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/memory",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryDashboard, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/admin",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cyberdark-950 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl text-cybergold-400 mb-4", children: "Admin Panel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cybergold-300", children: "Admin-funksjonalitet kommer snart" })
            ] }) }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/admin/security",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSecurityPanel, {})
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthAwareRedirect, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthAwareRedirect, { fallback: "/info" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/chat-new",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChatPageNew, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Route,
          {
            path: "/invite-system-demo",
            element: /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(InviteSystemDemo, {}) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/invite-demo", element: /* @__PURE__ */ jsxRuntimeExports.jsx(InviteSystemDemo, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/pwa-demo", element: /* @__PURE__ */ jsxRuntimeExports.jsx(PWADemo, {}) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DeveloperTools, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PWAHead, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileOptimization, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(MobileLaunchBanner, {}) })
  ] }) });
}
const handleGlobalError = (event) => {
  try {
    console.log("🇳🇴 Global error handlers initialized for Norwegian tech community");
    if (window.snakkazPerformance) {
      console.log("📊 Performance monitoring active");
    }
  } catch (e) {
  }
  return true;
};
window.addEventListener("error", handleGlobalError);
window.addEventListener("unhandledrejection", handleGlobalError);
function renderApp() {
  try {
    const container = document.getElementById("root");
    if (!container) {
      document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h2>Laster Snakkaz Chat...</h2><p>Kunne ikke finne root-element. Vennligst last inn siden på nytt.</p><button onclick="window.location.reload()">Last inn på nytt</button></div>';
      return;
    }
    const root = createRoot(container);
    root.render(
      /* @__PURE__ */ jsxRuntimeExports.jsx(App, {})
    );
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
  } catch (error) {
    document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h2>Snakkaz Chat</h2><p>Vi beklager, men det oppstod et problem ved lasting av appen.</p><button onclick="window.location.reload()" style="padding: 8px 16px; margin-top: 20px;">Last inn på nytt</button></div>';
  }
}
renderApp();
const AIChatPage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
//# sourceMappingURL=index-BGGDecvP.js.map
