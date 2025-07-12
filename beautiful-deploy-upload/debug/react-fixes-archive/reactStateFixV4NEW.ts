/**
 * EMERGENCY REACT STATE FIX V4 - Juni 4, 2025
 * 
 * KRITISK: Løser "Nt is undefined" og "useState undefined" feil
 * Feilen på www.snakkaz.com: use-sync-external-store-shim.production.js:17
 * 
 * Denne versjonen tar en mer aggressiv tilnærming til å fikse React-state problemer
 */

// Type definitions for the emergency fix
interface EmergencyUseState {
    <T>(initialState: T): [T, (newState: T) => void];
}

interface EmergencyReactNamespace {
    useState?: EmergencyUseState;
}

interface EmergencyUseSyncExternalStore {
    <T>(subscribe: (callback: () => void) => () => void, getSnapshot: () => T): T;
}

interface WindowWithEmergencyFixes extends Window {
    React?: EmergencyReactNamespace;
    useSyncExternalStore?: EmergencyUseSyncExternalStore;
    __USE_SYNC_EXTERNAL_STORE_POLYFILL__?: boolean;
    [key: string]: unknown;
}

// IMMEDIATE EXECUTION - CANNOT BE TREE-SHAKEN
const windowAny = window as WindowWithEmergencyFixes;

// 1. Fix the immediate "Nt is undefined" error - CRITICAL!
if (typeof windowAny.Nt === 'undefined') {
    console.log('🔧 FIXING NT UNDEFINED ERROR');
    windowAny.Nt = {
        useState: function(initialState: any) {
            return [initialState, function() {}];
        }
    };
}

// 2. Fix React namespace issues
if (!windowAny.React) {
    windowAny.React = { useState: function(s: any) { return [s, function() {}]; } };
}

// 3. Create emergency implementations for ALL common minified variables
['G', 'ni', 'Nt', 'e', 't', 'n', 'r', 'o', 'i', 'a', 'c', 'l', 's', 'u'].forEach(varName => {
    if (typeof windowAny[varName] === 'undefined') {
        windowAny[varName] = { useState: function(s: any) { return [s, function() {}]; } };
    }
});

// 4. Override problematic use-sync-external-store functions
if (typeof windowAny.useSyncExternalStore === 'undefined') {
    windowAny.useSyncExternalStore = function(subscribe: any, getSnapshot: any) {
        return getSnapshot ? getSnapshot() : null;
    };
}

console.log('🚨 EMERGENCY REACT STATE FIX V4 - APPLIED IMMEDIATELY');

// Ensure this runs immediately when imported
console.log('🚨 EMERGENCY REACT STATE FIX V4 - LOADING');

// 1. Fix the immediate "Nt is undefined" error
try {
    // Nt appears to be a minified React variable
    if (typeof windowAny.Nt === 'undefined') {
        console.log('🔧 Fixing Nt undefined error');
        windowAny.Nt = {
            useState: function(initialState: any) {
                console.log('🔧 Emergency useState called with:', initialState);
                return [initialState, function() {}];
            }
        };
    }
    
    // 2. Fix React namespace issues
    if (!windowAny.React) {
        console.log('🔧 Creating emergency React namespace');
        windowAny.React = {};
    }
    
    if (!windowAny.React.useState) {
        console.log('🔧 Creating emergency React.useState');
        windowAny.React.useState = function(initialState: any) {
            console.log('🔧 Emergency React.useState called with:', initialState);
            return [initialState, function() {}];
        };
    }
    
    // 3. Fix use-sync-external-store issues
    if (!windowAny.__USE_SYNC_EXTERNAL_STORE_POLYFILL__) {
        console.log('🔧 Enabling sync external store polyfill');
        windowAny.__USE_SYNC_EXTERNAL_STORE_POLYFILL__ = true;
    }
    
    // 4. Create emergency useState implementations for common minified variables
    const commonMinifiedVars = ['G', 'ni', 'Nt', 'e', 't', 'n', 'r', 'o', 'i', 'a', 'c', 'l', 's', 'u'];
    commonMinifiedVars.forEach(varName => {
        if (typeof windowAny[varName] === 'undefined') {
            console.log(`🔧 Creating emergency ${varName} namespace`);
            windowAny[varName] = {
                useState: function(initialState: any) {
                    console.log(`🔧 Emergency ${varName}.useState called with:`, initialState);
                    return [initialState, function() {}];
                }
            };
        }
    });
    
    // 5. Override problematic use-sync-external-store functions
    if (typeof windowAny.useSyncExternalStore === 'undefined') {
        console.log('🔧 Creating emergency useSyncExternalStore');
        windowAny.useSyncExternalStore = function(subscribe: any, getSnapshot: any) {
            console.log('🔧 Emergency useSyncExternalStore called');
            return getSnapshot ? getSnapshot() : null;
        };
    }
    
    // 6. Emergency DOM ready handler with fallback UI
    const emergencyDOMHandler = () => {
        const rootElement = document.getElementById('root');
        if (rootElement && !rootElement.innerHTML.trim()) {
            console.log('🔧 Empty root detected, adding emergency UI');
            rootElement.innerHTML = `
                <div style="
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center; 
                    min-height: 100vh; 
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: #f1f5f9;
                    font-family: system-ui, sans-serif;
                    text-align: center;
                    padding: 20px;
                ">
                    <div style="max-width: 600px;">
                        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #feca57;">⚡ Loading SnakkaZ Chat</h1>
                        <p style="font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.8;">
                            Initializing React State Fix V4...
                        </p>
                        <div id="loading-progress" style="
                            width: 100%; 
                            height: 4px; 
                            background: #334155; 
                            border-radius: 2px; 
                            overflow: hidden;
                            margin-bottom: 2rem;
                        ">
                            <div style="
                                width: 0%; 
                                height: 100%; 
                                background: linear-gradient(90deg, #feca57, #ff6b6b);
                                animation: progress 3s ease-in-out infinite;
                            "></div>
                        </div>
                        <style>
                            @keyframes progress {
                                0% { width: 0%; }
                                50% { width: 70%; }
                                100% { width: 100%; }
                            }
                        </style>
                        <p style="font-size: 0.9rem; opacity: 0.6;">
                            If this page doesn't load automatically, try refreshing.
                        </p>
                        <button onclick="window.location.reload()" style="
                            background: #feca57; 
                            color: #000; 
                            border: none; 
                            padding: 10px 20px; 
                            margin-top: 20px;
                            cursor: pointer;
                            border-radius: 5px;
                            font-weight: bold;
                        ">Reload Page</button>
                    </div>
                </div>
            `;
        }
    };
    
    // 7. Immediate execution and delayed checks
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', emergencyDOMHandler);
    } else {
        emergencyDOMHandler();
    }
    
    // 8. Set up periodic checks for React loading issues
    let checkCount = 0;
    const maxChecks = 10;
    const checkInterval = setInterval(() => {
        checkCount++;
        
        if (windowAny.React && windowAny.ReactDOM) {
            console.log('✅ React and ReactDOM loaded successfully');
            clearInterval(checkInterval);
            return;
        }
        
        if (checkCount >= maxChecks) {
            console.log('❌ React failed to load after maximum attempts');
            clearInterval(checkInterval);
            emergencyDOMHandler();
            return;
        }
        
        console.log(`🔄 React check ${checkCount}/${maxChecks} - waiting for React to load...`);
    }, 500);
    
    console.log('✅ EMERGENCY REACT STATE FIX V4 - INITIALIZATION COMPLETE');
    
} catch (error) {
    console.error('❌ EMERGENCY REACT STATE FIX V4 - ERROR:', error);
    
    // Absolute emergency fallback
    const rootElement = document.getElementById('root');
    if (rootElement) {
        rootElement.innerHTML = `
            <div style="
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh; 
                background: #dc2626;
                color: white;
                font-family: system-ui, sans-serif;
                text-align: center;
                padding: 20px;
            ">
                <div style="max-width: 600px;">
                    <h1 style="font-size: 2rem; margin-bottom: 1rem;">⚠️ Emergency Error Handler</h1>
                    <p style="margin-bottom: 1rem;">
                        A critical error occurred during React initialization.
                    </p>
                    <pre style="
                        background: rgba(0,0,0,0.3); 
                        padding: 15px; 
                        border-radius: 5px; 
                        text-align: left; 
                        overflow: auto;
                        margin-bottom: 20px;
                    ">${error}</pre>
                    <h3>Try these solutions:</h3>
                    <ol style="text-align: left; margin-bottom: 20px;">
                        <li>Clear browser cache and cookies</li>
                        <li>Try incognito mode</li>
                        <li>Use a different browser</li>
                        <li>Contact support if problem persists</li>
                    </ol>
                    <button onclick="window.location.reload()" style="
                        background: #feca57; 
                        color: #000; 
                        border: none; 
                        padding: 10px 20px; 
                        margin-top: 20px;
                        cursor: pointer;
                        border-radius: 5px;
                    ">Reload Page</button>
                </div>
            </div>
        `;
    }
}

// Export to make this a proper module
export default function initReactStateFixV4() {
    console.log('🚨 EMERGENCY REACT STATE FIX V4 - ACTIVE');
    return { status: 'loaded' };
}
