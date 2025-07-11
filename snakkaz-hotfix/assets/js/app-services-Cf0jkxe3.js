var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { s as supabase } from "./app-utils-CvwRV1zG.js";
import { n as nanoid } from "./vendor-misc-guM_vOlB.js";
import { s as secureKeyStorage } from "./vendor-security-LdHy7Pt9.js";
class SubscriptionService {
  /**
   * Get all available subscription plans
   * @returns {Promise<SubscriptionPlan[]>} The list of subscription plans
   */
  async getSubscriptionPlans() {
    try {
      const { data, error } = await supabase.from("subscription_plans").select("*").order("price", { ascending: true });
      if (error) {
        if (!globalThis._subscriptionErrorLogged) {
          console.warn("⚠️ Database schema fix needed: subscription_plans table missing");
          console.info("📋 Apply fix: Copy CRITICAL-DATABASE-FIX.sql to Supabase SQL Editor");
          globalThis._subscriptionErrorLogged = true;
        }
        if (error.code === "PGRST116" || error.code === "PGRST200") {
          return [
            {
              id: "basic",
              name: "Basic",
              price: 0,
              interval: "monthly",
              features: {
                "e2ee": true,
                "extended_storage": false,
                "premium_groups": false
              }
            },
            {
              id: "premium",
              name: "Premium",
              price: 5.99,
              interval: "monthly",
              features: {
                "e2ee": true,
                "extended_storage": true,
                "premium_groups": true,
                "advanced_security": true,
                "file_sharing": true
              },
              badge_text: "Popular",
              highlighted: true
            }
          ];
        }
        return [];
      }
      return data;
    } catch (err) {
      console.error("Exception fetching subscription plans:", err);
      return [];
    }
  }
  /**
   * Get a user's active subscription
   * @param {string} userId - The user ID to check for subscription
   * @returns {Promise<Subscription | null>} The subscription or null if none exists
   */
  async getUserSubscription(userId) {
    if (!userId) return null;
    try {
      const { data, error } = await supabase.from("subscriptions").select("*, subscription_plans(*)").eq("user_id", userId).eq("status", "active").single();
      if (error) {
        if (error.code !== "PGRST116") {
          if (!globalThis._subscriptionTableErrorLogged && error.code === "PGRST200") {
            console.warn("⚠️ Database schema fix needed: subscription foreign key relationship missing");
            console.info("📋 Apply fix: Copy CRITICAL-DATABASE-FIX.sql to Supabase SQL Editor");
            globalThis._subscriptionTableErrorLogged = true;
          } else if (error.code !== "PGRST200") {
            console.error("Error fetching user subscription:", error);
          }
        }
        return null;
      }
      return data;
    } catch (err) {
      console.error("Exception fetching subscription:", err);
      return null;
    }
  }
  /**
   * Check if a user has an active premium subscription
   * @param {string} userId - The user ID to check
   * @returns {Promise<boolean>} True if the user has an active subscription
   */
  async hasActivePremium(userId) {
    if (!userId) return false;
    try {
      const subscription = await this.getUserSubscription(userId);
      if (subscription === null) {
        console.info("No subscription found, using fallback basic features");
        return false;
      }
      return !!subscription;
    } catch (error) {
      console.error("Error checking active premium:", error);
      return false;
    }
  }
  /**
   * Create a new subscription for a user
   * @param {string} userId - The user ID for the subscription
   * @param {string} planId - The plan ID to subscribe to
   * @returns {Promise<Subscription | null>} The created subscription or null on error
   */
  async createSubscription(userId, planId) {
    if (!userId || !planId) return null;
    const currentDate = /* @__PURE__ */ new Date();
    const endDate = /* @__PURE__ */ new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    const { data, error } = await supabase.from("subscriptions").insert([
      {
        user_id: userId,
        plan_id: planId,
        status: "active",
        created_at: currentDate.toISOString(),
        updated_at: currentDate.toISOString(),
        current_period_end: endDate.toISOString()
      }
    ]).select().single();
    if (error) {
      console.error("Error creating subscription:", error);
      return null;
    }
    return data;
  }
  /**
   * Cancel a user's subscription
   * @param {string} userId - The user ID 
   * @returns {Promise<boolean>} Success or failure
   */
  async cancelSubscription(userId) {
    if (!userId) return false;
    const { error } = await supabase.from("subscriptions").update({ status: "canceled", updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("user_id", userId).eq("status", "active");
    if (error) {
      console.error("Error canceling subscription:", error);
      return false;
    }
    return true;
  }
  /**
   * Check if a user has access to a specific premium feature
   * @param {string} userId - The user ID
   * @param {string} featureKey - The feature key to check
   * @returns {Promise<boolean>} True if the user has access to the feature
   */
  async hasFeatureAccess(userId, featureKey) {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription || !subscription.subscription_plans) return false;
    const planFeatures = subscription.subscription_plans.features;
    return planFeatures && planFeatures[featureKey] === true;
  }
  /**
   * Create or update a trial subscription for a user
   * @param {string} userId - The user ID for the trial
   * @param {number} daysToExpire - Number of days the trial should last
   * @returns {Promise<boolean>} Success or failure
   */
  async createTrialSubscription(userId, daysToExpire = 14) {
    if (!userId) return false;
    const { data: plans, error: planError } = await supabase.from("subscription_plans").select("id").eq("name", "Premium").single();
    if (planError || !plans) {
      console.error("Error finding premium plan:", planError);
      return false;
    }
    const currentDate = /* @__PURE__ */ new Date();
    const endDate = /* @__PURE__ */ new Date();
    endDate.setDate(endDate.getDate() + daysToExpire);
    const { error } = await supabase.from("subscriptions").insert([
      {
        user_id: userId,
        plan_id: plans.id,
        status: "trial",
        created_at: currentDate.toISOString(),
        updated_at: currentDate.toISOString(),
        current_period_end: endDate.toISOString()
      }
    ]);
    if (error) {
      console.error("Error creating trial subscription:", error);
      return false;
    }
    return true;
  }
  /**
   * Check if a user's subscription is about to expire
   * @param {string} userId - The user ID to check
   * @param {number} daysThreshold - Days threshold for warning (default: 5)
   * @returns {Promise<boolean>} True if subscription is expiring soon
   */
  async isSubscriptionExpiringSoon(userId, daysThreshold = 5) {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) return false;
    const expiryDate = new Date(subscription.current_period_end);
    const currentDate = /* @__PURE__ */ new Date();
    const diffTime = expiryDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    return diffDays <= daysThreshold && diffDays >= 0;
  }
}
const subscriptionService = new SubscriptionService();
var define_process_env_default$1 = {};
const ENV_CHECK = !!define_process_env_default$1.VITE_SUPABASE_URL && !!define_process_env_default$1.VITE_SUPABASE_ANON_KEY;
const verifySupabaseConfig = () => {
  try {
    const isConfigValid = !!supabase && ENV_CHECK;
    if (false) ;
    return isConfigValid;
  } catch (error) {
    console.error("Error verifying Supabase configuration:", error);
    return false;
  }
};
verifySupabaseConfig();
var define_process_env_default = {};
function applyCspPolicy() {
  if (typeof document === "undefined") return;
  const isDev = window.location.hostname === "localhost";
  const cspDirectives = {
    // Default source directive - restrict by default
    "default-src": ["'self'"],
    // Script sources - more restricted in production
    "script-src": isDev ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"] : [
      "'self'",
      // Allow specific hashes for critical inline scripts
      "'sha256-1SuipMDplXoKeoH5h0AccIQrF7qwRCEFPCuoNSA6NrM='",
      "'sha256-hR8LUoFSvUqLEELJErbmI2vwnXpAjz1dpHxy2vpLRKQ='"
    ],
    // Style sources
    "style-src": ["'self'", "'unsafe-inline'"],
    // Inline styles still needed for some UI libraries
    // Image sources
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      "*.amazonaws.com",
      "storage.googleapis.com",
      "*.supabase.co",
      "*.supabase.in",
      "secure.gravatar.com"
      // For profile images
    ],
    // Font sources - restrict to self and data URIs
    "font-src": ["'self'", "data:"],
    // Connection sources for APIs and WebSockets
    "connect-src": [
      "'self'",
      "*.supabase.co",
      "*.supabase.in",
      "wss://*.supabase.co",
      "*.amazonaws.com",
      "storage.googleapis.com",
      "*.snakkaz.com",
      "www.snakkaz.com",
      // Added explicit www subdomain
      "dash.snakkaz.com",
      "business.snakkaz.com",
      "docs.snakkaz.com",
      "analytics.snakkaz.com",
      "mcp.snakkaz.com",
      "help.snakkaz.com"
    ],
    // Media sources for audio/video content
    "media-src": ["'self'", "blob:"],
    // Prevent object embedding completely
    "object-src": ["'none'"],
    // Frame sources - restrict to same origin
    "frame-src": ["'self'"],
    // Worker sources - allow service workers and blobs
    "worker-src": ["'self'", "blob:"],
    // Form submission targets - restrict to same origin
    "form-action": ["'self'"],
    // Base URI restriction - prevent base tag hijacking
    "base-uri": ["'self'"],
    // Frame ancestors - prevent clickjacking
    "frame-ancestors": ["'self'"],
    // Implementation of Trusted Types policy (modern browsers)
    ...isDev ? {} : {
      "require-trusted-types-for": ["'script'"]
    },
    // Content Security Policy Level 3 features
    "upgrade-insecure-requests": [],
    // Add report-to for collecting violation reports in production
    ...isDev ? {} : {
      "report-to": ["csp-endpoint"]
    }
  };
  const cspString = Object.entries(cspDirectives).map(([directive, sources]) => {
    if (sources.length === 0) return directive;
    return `${directive} ${sources.join(" ")}`;
  }).join("; ");
  try {
    const existingMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const httpEquiv = isDev ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only";
    if (existingMetaTag) {
      existingMetaTag.setAttribute("content", cspString);
      existingMetaTag.setAttribute("http-equiv", httpEquiv);
    } else {
      const metaTag = document.createElement("meta");
      metaTag.setAttribute("http-equiv", httpEquiv);
      metaTag.setAttribute("content", cspString);
      const head = document.head || document.getElementsByTagName("head")[0];
      if (head.firstChild) {
        head.insertBefore(metaTag, head.firstChild);
      } else {
        head.appendChild(metaTag);
      }
    }
    if (!isDev) {
      setupCspReporting();
    }
    console.log(`CSP policy applied successfully in ${isDev ? "development" : "production"} mode`);
  } catch (error) {
    console.error("Failed to apply CSP policy:", error);
  }
}
function setupCspReporting() {
  if (typeof window === "undefined") return;
  if ("ReportingObserver" in window) {
    const reportingEndpoint = define_process_env_default.VITE_CSP_REPORT_ENDPOINT || "https://analytics.snakkaz.com/api/csp-report";
    try {
      navigator.sendBeacon(reportingEndpoint, JSON.stringify({
        type: "csp-endpoint-test",
        message: "CSP reporting initialized",
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn("CSP reporting test failed:", e);
    }
  } else {
    console.warn("ReportingObserver not supported in this browser. CSP violations will not be reported.");
  }
}
const DB_NAME = "snakkaz-storage";
const DB_VERSION = 1;
const _IndexedDBStorage = class _IndexedDBStorage {
  constructor() {
    __publicField(this, "database", null);
    __publicField(this, "isInitializing", false);
    __publicField(this, "initPromise", null);
  }
  /**
   * Get singleton instance of storage manager
   */
  static getInstance() {
    if (!_IndexedDBStorage.instance) {
      _IndexedDBStorage.instance = new _IndexedDBStorage();
    }
    return _IndexedDBStorage.instance;
  }
  /**
   * Initialize the database connection
   */
  async init() {
    if (this.database) {
      return this.database;
    }
    if (this.initPromise) {
      return this.initPromise;
    }
    this.initPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB is not supported in this browser"));
        return;
      }
      console.log("[IndexedDB] Opening database...");
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        console.log(`[IndexedDB] Upgrading database to version ${DB_VERSION}`);
        const db = event.target.result;
        if (!db.objectStoreNames.contains("messages")) {
          const messageStore = db.createObjectStore("messages", { keyPath: "id" });
          messageStore.createIndex("status", "status", { unique: false });
          messageStore.createIndex("recipientId", "recipientId", { unique: false });
          messageStore.createIndex("groupId", "groupId", { unique: false });
          messageStore.createIndex("createdAt", "createdAt", { unique: false });
        }
        if (!db.objectStoreNames.contains("media")) {
          const mediaStore = db.createObjectStore("media", { keyPath: "id" });
          mediaStore.createIndex("createdAt", "createdAt", { unique: false });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }
      };
      request.onsuccess = (event) => {
        this.database = event.target.result;
        console.log(`[IndexedDB] Database opened successfully, version ${this.database.version}`);
        this.database.onerror = (event2) => {
          console.error("[IndexedDB] Database error:", event2);
        };
        resolve(this.database);
      };
      request.onerror = (event) => {
        console.error("[IndexedDB] Error opening database:", event.target.error);
        this.initPromise = null;
        reject(event.target.error);
      };
    });
    return this.initPromise;
  }
  /**
   * Add an item to a specific object store
   */
  async add(storeName, item) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(item);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        console.error(`[IndexedDB] Error adding item to ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  /**
   * Get an item from a specific object store by ID
   */
  async get(storeName, id) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => {
        console.error(`[IndexedDB] Error getting item from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  /**
   * Get all items from a specific object store
   */
  async getAll(storeName) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        console.error(`[IndexedDB] Error getting all items from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  /**
   * Update an item in a specific object store
   */
  async put(storeName, item) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        console.error(`[IndexedDB] Error updating item in ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  /**
   * Delete an item from a specific object store
   */
  async delete(storeName, id) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        console.error(`[IndexedDB] Error deleting item from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  /**
   * Get items by index
   */
  async getByIndex(storeName, indexName, value) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        console.error(`[IndexedDB] Error getting items by index ${indexName} from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  /**
   * Clear all items from a specific object store
   */
  async clear(storeName) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        console.error(`[IndexedDB] Error clearing ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
  /**
   * Check if the database is supported in this browser
   */
  static isSupported() {
    return !!window.indexedDB;
  }
};
__publicField(_IndexedDBStorage, "instance");
let IndexedDBStorage = _IndexedDBStorage;
const indexedDBStorage = IndexedDBStorage.getInstance();
const MAX_OFFLINE_MESSAGES = 100;
const OFFLINE_STORAGE_KEY = "snakkaz_offline_messages";
async function getOfflineMessages() {
  try {
    if (IndexedDBStorage.isSupported()) {
      const messages = await indexedDBStorage.getAll("messages");
      return messages;
    } else {
      const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (!storageData) return [];
      const store = JSON.parse(storageData);
      return store.messages || [];
    }
  } catch (error) {
    console.error("[OfflineMessageStore] Failed to get offline messages:", error);
    return [];
  }
}
async function saveOfflineMessage(text, options) {
  try {
    const newMessage = {
      id: nanoid(),
      text,
      recipientId: options.recipientId,
      groupId: options.groupId,
      mediaType: options.mediaType,
      mediaName: options.mediaName,
      ttl: options.ttl,
      createdAt: Date.now(),
      status: "pending",
      retryCount: 0
    };
    if (options.mediaBlob && IndexedDBStorage.isSupported()) {
      try {
        const mediaId = nanoid();
        await indexedDBStorage.add("media", {
          id: mediaId,
          blob: options.mediaBlob,
          type: options.mediaType || "application/octet-stream",
          name: options.mediaName || "attachment",
          size: options.mediaBlob.size,
          createdAt: Date.now()
        });
        newMessage.mediaId = mediaId;
      } catch (mediaError) {
        console.error("[OfflineMessageStore] Failed to store media:", mediaError);
      }
    }
    if (IndexedDBStorage.isSupported()) {
      try {
        const existingMessages = await indexedDBStorage.getAll("messages");
        if (existingMessages.length >= MAX_OFFLINE_MESSAGES) {
          const sortedMessages = [...existingMessages].sort((a, b) => a.createdAt - b.createdAt);
          for (let i = 0; i < existingMessages.length - MAX_OFFLINE_MESSAGES + 1; i++) {
            const oldMessage = sortedMessages[i];
            await indexedDBStorage.delete("messages", oldMessage.id);
            if (oldMessage.mediaId) {
              await indexedDBStorage.delete("media", oldMessage.mediaId);
            }
          }
        }
        await indexedDBStorage.add("messages", newMessage);
      } catch (dbError) {
        console.error("[OfflineMessageStore] IndexedDB error:", dbError);
        fallbackToLocalStorage(newMessage);
      }
    } else {
      fallbackToLocalStorage(newMessage);
    }
    return newMessage;
  } catch (error) {
    console.error("[OfflineMessageStore] Failed to save offline message:", error);
    throw error;
  }
}
async function updateOfflineMessageStatus(messageId, status, retryCount) {
  try {
    if (IndexedDBStorage.isSupported()) {
      const message = await indexedDBStorage.get("messages", messageId);
      if (message) {
        message.status = status;
        if (retryCount !== void 0) {
          message.retryCount = retryCount;
        }
        await indexedDBStorage.put("messages", message);
      }
    } else {
      const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (!storageData) return;
      const store = JSON.parse(storageData);
      const messageIndex = store.messages.findIndex((msg) => msg.id === messageId);
      if (messageIndex !== -1) {
        store.messages[messageIndex].status = status;
        if (retryCount !== void 0) {
          store.messages[messageIndex].retryCount = retryCount;
        }
        localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(store));
      }
    }
  } catch (error) {
    console.error("[OfflineMessageStore] Failed to update message status:", error);
  }
}
async function removeOfflineMessage(messageId) {
  try {
    if (IndexedDBStorage.isSupported()) {
      const message = await indexedDBStorage.get("messages", messageId);
      if (message) {
        if (message.mediaId) {
          await indexedDBStorage.delete("media", message.mediaId);
        }
        await indexedDBStorage.delete("messages", messageId);
      }
    } else {
      const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (!storageData) return;
      const store = JSON.parse(storageData);
      const messageIndex = store.messages.findIndex((msg) => msg.id === messageId);
      if (messageIndex !== -1) {
        store.messages.splice(messageIndex, 1);
        localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(store));
      }
    }
  } catch (error) {
    console.error("[OfflineMessageStore] Failed to remove message:", error);
  }
}
async function getOfflineMessageMedia(mediaId) {
  try {
    if (!IndexedDBStorage.isSupported()) {
      return null;
    }
    const media = await indexedDBStorage.get("media", mediaId);
    return media ? media.blob : null;
  } catch (error) {
    console.error("[OfflineMessageStore] Failed to get message media:", error);
    return null;
  }
}
function fallbackToLocalStorage(message) {
  try {
    const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    const store = storageData ? JSON.parse(storageData) : { messages: [], lastSyncedAt: null };
    if (store.messages.length >= MAX_OFFLINE_MESSAGES) {
      store.messages = store.messages.slice(-MAX_OFFLINE_MESSAGES + 1);
    }
    const localMessage = { ...message };
    delete localMessage.mediaId;
    store.messages.push(localMessage);
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error("[OfflineMessageStore] Failed to use localStorage fallback:", error);
  }
}
async function migrateFromLocalStorage() {
  try {
    if (!IndexedDBStorage.isSupported()) {
      return;
    }
    const storageData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!storageData) return;
    const store = JSON.parse(storageData);
    if (!store.messages || !Array.isArray(store.messages)) return;
    for (const message of store.messages) {
      await indexedDBStorage.add("messages", message);
    }
    localStorage.removeItem(OFFLINE_STORAGE_KEY);
    console.log("[OfflineMessageStore] Successfully migrated from localStorage to IndexedDB");
  } catch (error) {
    console.error("[OfflineMessageStore] Failed to migrate from localStorage:", error);
  }
}
if (typeof window !== "undefined") {
  migrateFromLocalStorage();
}
async function initializeSecurity() {
  console.log("Initializing security features...");
  applyCspPolicy();
  if (IndexedDBStorage.isSupported()) {
    try {
      await indexedDBStorage.init();
      console.log("IndexedDB storage initialized successfully");
      await migrateFromLocalStorage();
    } catch (error) {
      console.error("Failed to initialize IndexedDB storage:", error);
    }
  } else {
    console.warn("IndexedDB is not supported in this browser. Using localStorage fallback.");
  }
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    addSecurityMetaTags();
  }
}
function addSecurityMetaTags() {
  if (typeof document === "undefined") return;
  const metaTags = [
    { name: "referrer", content: "strict-origin-when-cross-origin" },
    { name: "X-Frame-Options", content: "SAMEORIGIN" },
    { httpEquiv: "X-Content-Type-Options", content: "nosniff" }
  ];
  metaTags.forEach((metaData) => {
    const metaTag = document.createElement("meta");
    if (metaData.name) {
      metaTag.name = metaData.name;
    }
    if (metaData.httpEquiv) {
      metaTag.httpEquiv = metaData.httpEquiv;
    }
    metaTag.content = metaData.content;
    document.head.appendChild(metaTag);
  });
}
async function bootstrapSecurityFeatures() {
  try {
    console.log("Initializing Snakkaz security features...");
    applyCspPolicy();
    await initializeSecurity();
    console.log("Security features initialized successfully");
  } catch (error) {
    console.error("Failed to initialize security features:", error);
  }
}
const _ChatService = class _ChatService {
  constructor() {
    __publicField(this, "subscriptions", /* @__PURE__ */ new Map());
  }
  static getInstance() {
    if (!_ChatService.instance) {
      _ChatService.instance = new _ChatService();
    }
    return _ChatService.instance;
  }
  /**
   * Get all public chat rooms with participant counts
   */
  async getChatRooms() {
    try {
      const { data, error } = await supabase.from("chat_rooms").select(`
          *,
          participant_count:room_participants(count)
        `).eq("is_active", true).order("created_at", { ascending: true });
      if (error) throw error;
      return (data == null ? void 0 : data.map((room) => {
        var _a, _b;
        return {
          ...room,
          participant_count: ((_b = (_a = room.participant_count) == null ? void 0 : _a[0]) == null ? void 0 : _b.count) || 0
        };
      })) || [];
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      throw error;
    }
  }
  /**
   * Get messages for a specific room with user profiles
   */
  async getMessages(roomId, limit = 50) {
    try {
      const { data, error } = await supabase.from("messages").select(`
          *,
          user_profile:user_profiles(username, display_name, avatar_url)
        `).eq("room_id", roomId).order("created_at", { ascending: false }).limit(limit);
      if (error) throw error;
      return (data || []).reverse();
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }
  /**
   * Send a message to a room
   */
  async sendMessage(roomId, content, messageType = "text") {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");
      const { data, error } = await supabase.from("messages").insert({
        room_id: roomId,
        user_id: user.user.id,
        content,
        message_type: messageType
      }).select(`
          *,
          user_profile:user_profiles(username, display_name, avatar_url)
        `).single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
  /**
   * Subscribe to real-time messages for a room
   */
  subscribeToMessages(roomId, onMessage) {
    const channel = supabase.channel(`messages:${roomId}`).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `room_id=eq.${roomId}`
      },
      async (payload) => {
        const { data } = await supabase.from("messages").select(`
              *,
              user_profile:user_profiles(username, display_name, avatar_url)
            `).eq("id", payload.new.id).single();
        if (data) {
          onMessage(data);
        }
      }
    ).subscribe();
    this.subscriptions.set(`messages:${roomId}`, channel);
    return () => {
      channel.unsubscribe();
      this.subscriptions.delete(`messages:${roomId}`);
    };
  }
  /**
   * Subscribe to user presence (online/offline status)
   */
  subscribeToPresence(roomId, onPresenceChange) {
    const channel = supabase.channel(`presence:${roomId}`).on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const users = Object.values(state).flat().map((presence) => ({
        id: presence.user_id || "",
        username: presence.username || "",
        display_name: presence.display_name || "",
        status: "online",
        last_seen_at: presence.joined_at || (/* @__PURE__ */ new Date()).toISOString()
      }));
      onPresenceChange(users);
    }).on("presence", { event: "join" }, ({ key, newPresences }) => {
      console.log("User joined:", key, newPresences);
    }).on("presence", { event: "leave" }, ({ key, leftPresences }) => {
      console.log("User left:", key, leftPresences);
    }).subscribe();
    this.subscriptions.set(`presence:${roomId}`, channel);
    return () => {
      channel.unsubscribe();
      this.subscriptions.delete(`presence:${roomId}`);
    };
  }
  /**
   * Join a room's presence
   */
  async joinRoomPresence(roomId) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.user.id).single();
      if (profile) {
        const channel = this.subscriptions.get(`presence:${roomId}`);
        if (channel) {
          await channel.track({
            user_id: profile.id,
            username: profile.username,
            display_name: profile.display_name,
            status: "online",
            joined_at: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
    } catch (error) {
      console.error("Error joining room presence:", error);
    }
  }
  /**
   * Leave a room's presence
   */
  async leaveRoomPresence(roomId) {
    const channel = this.subscriptions.get(`presence:${roomId}`);
    if (channel) {
      await channel.untrack();
    }
  }
  /**
   * Get online users in a room
   */
  async getOnlineUsers(_roomId) {
    try {
      const { data } = await supabase.from("user_profiles").select("*").eq("status", "online").limit(10);
      return data || [];
    } catch (error) {
      console.error("Error fetching online users:", error);
      return [];
    }
  }
  /**
   * Update user status
   */
  async updateUserStatus(status) {
    try {
      const { error } = await supabase.rpc("update_user_status", {
        new_status: status
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  }
  /**
   * Create a new group chat
   */
  async createGroup(name, description) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");
      const { data, error } = await supabase.from("chat_rooms").insert({
        name,
        description,
        type: "group",
        created_by: user.user.id
      }).select().single();
      if (error) throw error;
      await supabase.from("room_participants").insert({
        room_id: data.id,
        user_id: user.user.id,
        role: "owner"
      });
      return data;
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  }
  /**
   * Update user presence status
   */
  async updatePresence(isOnline) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      await supabase.from("user_profiles").upsert({
        id: user.user.id,
        status: isOnline ? "online" : "offline",
        last_seen_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Error updating presence:", error);
    }
  }
  /**
   * Clean up all subscriptions
   */
  cleanup() {
    this.subscriptions.forEach((channel) => {
      channel.unsubscribe();
    });
    this.subscriptions.clear();
  }
};
__publicField(_ChatService, "instance");
let ChatService = _ChatService;
const chatService = ChatService.getInstance();
var PremiumFeature = /* @__PURE__ */ ((PremiumFeature2) => {
  PremiumFeature2["EXTENDED_STORAGE"] = "extended_storage";
  PremiumFeature2["PREMIUM_GROUPS"] = "premium_groups";
  PremiumFeature2["CUSTOM_EMAIL"] = "custom_email";
  PremiumFeature2["END_TO_END_ENCRYPTION"] = "e2ee";
  PremiumFeature2["PRIORITY_SUPPORT"] = "priority_support";
  PremiumFeature2["UNLIMITED_MESSAGES"] = "unlimited_messages";
  PremiumFeature2["ADVANCED_SECURITY"] = "advanced_security";
  PremiumFeature2["FILE_SHARING"] = "file_sharing";
  PremiumFeature2["CUSTOM_THEMES"] = "custom_themes";
  PremiumFeature2["API_ACCESS"] = "api_access";
  PremiumFeature2["ELECTRUM_INTEGRATION"] = "electrum_integration";
  return PremiumFeature2;
})(PremiumFeature || {});
const ENCRYPTION_ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const KEY_USAGE = ["encrypt", "decrypt"];
const KEY_FORMAT = "raw";
const KEY_EXTRACTABLE = false;
async function generateGroupKey(groupId) {
  try {
    const keyId = `group-${groupId}-${nanoid(8)}`;
    const keyData = crypto.getRandomValues(new Uint8Array(KEY_LENGTH / 8));
    const key = await crypto.subtle.importKey(
      KEY_FORMAT,
      keyData,
      {
        name: ENCRYPTION_ALGORITHM,
        length: KEY_LENGTH
      },
      KEY_EXTRACTABLE,
      KEY_USAGE
    );
    await secureKeyStorage.storeKey(keyId, keyData);
    const metadata = {
      groupId,
      keyId,
      version: 1,
      createdAt: Date.now()
    };
    const groupKeys = getGroupKeysMetadata();
    groupKeys[keyId] = metadata;
    localStorage.setItem("group_encryption_keys", JSON.stringify(groupKeys));
    return keyId;
  } catch (error) {
    console.error("Failed to generate group key:", error);
    throw new Error("Failed to set up secure group communication");
  }
}
async function getGroupKey(groupId) {
  const groupKeys = getGroupKeysMetadata();
  const keysForGroup = Object.values(groupKeys).filter((meta) => meta.groupId === groupId).sort((a, b) => b.createdAt - a.createdAt);
  if (keysForGroup.length > 0) {
    return keysForGroup[0].keyId;
  }
  return generateGroupKey(groupId);
}
function getGroupKeysMetadata() {
  try {
    const data = localStorage.getItem("group_encryption_keys");
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to parse group keys metadata:", error);
    return {};
  }
}
async function encryptGroupMessage(groupId, message) {
  try {
    const keyId = await getGroupKey(groupId);
    const keyData = await secureKeyStorage.getKey(keyId);
    if (!keyData) {
      throw new Error(`Encryption key not found for group ${groupId}`);
    }
    const key = await crypto.subtle.importKey(
      KEY_FORMAT,
      keyData,
      {
        name: ENCRYPTION_ALGORITHM,
        length: KEY_LENGTH
      },
      KEY_EXTRACTABLE,
      KEY_USAGE
    );
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv
      },
      key,
      messageData
    );
    return {
      ciphertext: arrayBufferToBase64(ciphertext),
      iv: arrayBufferToBase64(iv),
      keyId
    };
  } catch (error) {
    console.error("Failed to encrypt group message:", error);
    throw new Error("Failed to encrypt message for secure group communication");
  }
}
async function rotateGroupKey(groupId) {
  try {
    const newKeyId = await generateGroupKey(groupId);
    const groupKeys = getGroupKeysMetadata();
    const previousKeys = Object.values(groupKeys).filter((meta) => meta.groupId === groupId).sort((a, b) => b.version - a.version);
    if (previousKeys.length > 0) {
      const latestVersion = previousKeys[0].version;
      groupKeys[newKeyId].version = latestVersion + 1;
      localStorage.setItem("group_encryption_keys", JSON.stringify(groupKeys));
    }
    return newKeyId;
  } catch (error) {
    console.error("Failed to rotate group key:", error);
    throw new Error("Failed to update secure group communication");
  }
}
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
const MEMORY_SERVER_URL = "https://mcp.snakkaz.com";
class MemoryService {
  constructor() {
    __publicField(this, "apiEndpoint");
    this.apiEndpoint = MEMORY_SERVER_URL;
  }
  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.apiEndpoint}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        },
        ...options
      });
      if (!response.ok) {
        throw new Error(`Memory API error: ${response.status} - ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Memory service error:", error);
      throw error;
    }
  }
  /**
   * Lagre et minne for en bruker
   */
  async storeMemory(userId, memoryType, key, value, options = {}) {
    try {
      const result = await this.makeRequest("/memories", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          memory_type: memoryType,
          key,
          value,
          confidence: options.confidence || 1,
          metadata: options.metadata || {},
          context: options.context,
          source: options.source || "web-app"
        })
      });
      return result;
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  /**
   * Hent minner for en bruker med semantisk søk
   */
  async retrieveMemories(userId, query, options = {}) {
    try {
      const params = new URLSearchParams({
        limit: (options.limit || 10).toString()
      });
      if (options.memoryTypes && options.memoryTypes.length > 0) {
        params.set("memory_type", options.memoryTypes[0]);
      }
      const result = await this.makeRequest(`/memories/${userId}?${params.toString()}`);
      return result;
    } catch (error) {
      console.error("Error retrieving memories:", error);
      return [];
    }
  }
  /**
   * Slett minner basert på kriterier
   */
  async forgetMemories(userId, criteria = {}) {
    try {
      if (criteria.key) {
        const result = await this.makeRequest(`/memories/${userId}/${criteria.key}`, {
          method: "DELETE"
        });
        return {
          status: "success",
          message: "Memory deleted",
          deleted_count: 1
        };
      }
      return {
        status: "error",
        message: "Bulk deletion not yet implemented",
        error: "Only single memory deletion by key is supported"
      };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  /**
   * Analyser brukerens minnemønstre
   */
  async analyzeMemoryPatterns(userId, timeRangeDays = 30) {
    try {
      const result = await this.makeRequest(`/stats/${userId}`);
      const stats = result;
      return {
        total_memories: stats.total_memories,
        avg_confidence: 0.8,
        // Default since we don't have this in simple API
        avg_importance: stats.average_importance,
        max_access_count: 1,
        // Default since we don't have this in simple API
        unique_types: Object.keys(stats.memory_types).length,
        type_distribution: Object.entries(stats.memory_types).map(([memory_type, count]) => ({
          memory_type,
          count,
          avg_importance: stats.average_importance
        })),
        access_patterns: []
        // Default empty array for now
      };
    } catch (error) {
      console.error("Error analyzing memory patterns:", error);
      return {
        total_memories: 0,
        avg_confidence: 0,
        avg_importance: 0,
        max_access_count: 0,
        unique_types: 0,
        type_distribution: [],
        access_patterns: []
      };
    }
  }
  /**
   * Opprett en samling av relaterte minner
   */
  async createMemoryCollection(userId, name, description, memoryIds) {
    return {
      status: "error",
      message: "Memory collections not yet implemented",
      error: "Feature not available in current version"
    };
  }
  /**
   * Admin: Få oversikt over alle brukeres minnebruk
   */
  async getAdminOverview() {
    return {
      total_statistics: {
        total_users: 0,
        total_memories: 0,
        total_size_bytes: 0,
        avg_importance: 0
      },
      top_users: [],
      type_distribution: []
    };
  }
  /**
   * Automatisk lagring av samtale-kontekst
   */
  async saveConversationContext(userId, messages, conversationId) {
    if (messages.length === 0) return;
    const lastUserMessage = messages.filter((m) => m.role === "user").pop();
    if (lastUserMessage) {
      await this.storeMemory(
        userId,
        "conversation_context",
        `conversation_${conversationId}_last_intent`,
        lastUserMessage.content,
        {
          confidence: 0.8,
          context: `Conversation ${conversationId}`,
          source: "auto_save",
          ttlSeconds: 24 * 60 * 60,
          // 24 timer
          metadata: {
            conversation_id: conversationId,
            message_count: messages.length,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }
        }
      );
    }
    const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop();
    if (lastAssistantMessage) {
      await this.storeMemory(
        userId,
        "learned_fact",
        `ai_response_${conversationId}_${Date.now()}`,
        lastAssistantMessage.content,
        {
          confidence: 0.9,
          context: `AI response in conversation ${conversationId}`,
          source: "ai_assistant",
          metadata: {
            conversation_id: conversationId,
            response_type: "assistant_message"
          }
        }
      );
    }
  }
  /**
   * Lag minnebasert personalisering for AI-samtaler
   */
  async getPersonalizationContext(userId) {
    try {
      const preferences = await this.retrieveMemories(
        userId,
        "user preferences settings likes dislikes",
        { memoryTypes: ["user_preference"], limit: 5 }
      );
      const relationships = await this.retrieveMemories(
        userId,
        "relationship friends family emotional state",
        { memoryTypes: ["user_relationship", "emotional_state"], limit: 3 }
      );
      const facts = await this.retrieveMemories(
        userId,
        "learned facts knowledge interests",
        { memoryTypes: ["learned_fact"], limit: 3 }
      );
      let context = "Bruker-kontekst for personalisering:\n\n";
      if (preferences.length > 0) {
        context += "Brukerpreferanser:\n";
        preferences.forEach((p) => {
          context += `- ${p.key}: ${p.value}
`;
        });
        context += "\n";
      }
      if (relationships.length > 0) {
        context += "Relasjoner og følelser:\n";
        relationships.forEach((r) => {
          context += `- ${r.key}: ${r.value}
`;
        });
        context += "\n";
      }
      if (facts.length > 0) {
        context += "Tidligere lærte fakta:\n";
        facts.forEach((f) => {
          context += `- ${f.value}
`;
        });
        context += "\n";
      }
      return context.trim() || "Ingen lagret brukerinformasjon tilgjengelig.";
    } catch (error) {
      console.error("Feil ved henting av personaliseringsdata:", error);
      return "Feil ved henting av brukerinformasjon.";
    }
  }
  /**
   * Automatisk læring fra brukerinteraksjoner
   */
  async learnFromInteraction(userId, interaction) {
    try {
      await this.storeMemory(
        userId,
        "interaction_pattern",
        `interaction_${Date.now()}`,
        `User said: "${interaction.userInput}" | AI responded: "${interaction.aiResponse}"`,
        {
          confidence: interaction.userFeedback === "positive" ? 0.9 : 0.6,
          metadata: {
            feedback: interaction.userFeedback,
            topic: interaction.topic,
            interaction_type: "chat"
          },
          source: "auto_learn",
          ttlSeconds: 30 * 24 * 60 * 60
          // 30 dager
        }
      );
      if (interaction.userFeedback === "positive" && interaction.topic) {
        await this.storeMemory(
          userId,
          "learned_fact",
          `successful_${interaction.topic}_${Date.now()}`,
          interaction.aiResponse,
          {
            confidence: 0.95,
            metadata: {
              topic: interaction.topic,
              user_approved: true
            },
            source: "positive_feedback"
          }
        );
      }
    } catch (error) {
      console.error("Feil ved læring fra interaksjon:", error);
    }
  }
  /**
   * Få minnesammendrag for debugging/admin
   */
  async getMemorySummary(userId) {
    try {
      const allMemories = await this.retrieveMemories(userId, void 0, { limit: 100 });
      const byType = allMemories.reduce((acc, memory) => {
        acc[memory.memory_type] = (acc[memory.memory_type] || 0) + 1;
        return acc;
      }, {});
      const recentActivity = allMemories.sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime()).slice(0, 5);
      const topImportant = allMemories.sort((a, b) => b.importance - a.importance).slice(0, 5);
      return {
        total: allMemories.length,
        byType,
        recentActivity,
        topImportant
      };
    } catch (error) {
      console.error("Feil ved henting av minnesammendrag:", error);
      throw error;
    }
  }
}
const memoryService = new MemoryService();
export {
  IndexedDBStorage as I,
  PremiumFeature as P,
  saveOfflineMessage as a,
  getOfflineMessageMedia as b,
  chatService as c,
  getGroupKey as d,
  rotateGroupKey as e,
  encryptGroupMessage as f,
  getOfflineMessages as g,
  bootstrapSecurityFeatures as h,
  indexedDBStorage as i,
  memoryService as m,
  removeOfflineMessage as r,
  subscriptionService as s,
  updateOfflineMessageStatus as u,
  verifySupabaseConfig as v
};
//# sourceMappingURL=app-services-Cf0jkxe3.js.map
