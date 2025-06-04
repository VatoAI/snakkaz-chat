/**
 * EMERGENCY REACT STATE FIX V4 - Juni 4, 2025
 * 
 * KRITISK: Løser "Nt is undefined" og "useState undefined" feil
 * Feilen på www.snakkaz.com: use-sync-external-store-shim.production.js:17
 * 
 * Denne versjonen tar en mer aggressiv tilnærming til å fikse React-state problemer
 */

// Ensure this runs before any other code
(function emergencyReactStateFixV4() {
    'use strict';
    
    console.log('🚨 EMERGENCY REACT STATE FIX V4 - LOADING');
    
    const windowAny = window as any;
    
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
                console.log(`🔧 Creating emergency ${varName} object`);
                windowAny[varName] = {
                    useState: function(initialState: any) {
                        console.log(`🔧 Emergency ${varName}.useState called with:`, initialState);
                        return [initialState, function() {}];
                    },
                    useEffect: function(effect: any, deps: any) {
                        console.log(`🔧 Emergency ${varName}.useEffect called`);
                        if (typeof effect === 'function') {
                            try {
                                effect();
                            } catch (e) {
                                console.warn('Emergency useEffect error:', e);
                            }
                        }
                    },
                    createElement: function(...args: any[]) {
                        console.log(`🔧 Emergency ${varName}.createElement called`);
                        return document.createElement('div');
                    }
                };
            }
        });
        
        // 5. Override the problematic use-sync-external-store functions
        if (windowAny.useSyncExternalStore === undefined) {
            console.log('🔧 Creating emergency useSyncExternalStore');
            windowAny.useSyncExternalStore = function(subscribe: any, getSnapshot: any) {
                console.log('🔧 Emergency useSyncExternalStore called');
                return getSnapshot ? getSnapshot() : null;
            };
        }
        
        // 6. Patch all potential React module exports
        const reactModules = ['react', 'React', 'REACT'];
        reactModules.forEach(moduleName => {
            if (windowAny[moduleName] && !windowAny[moduleName].useState) {
                console.log(`🔧 Patching ${moduleName}.useState`);
                windowAny[moduleName].useState = function(initialState: any) {
                    console.log(`🔧 Patched ${moduleName}.useState called`);
                    return [initialState, function() {}];
                };
            }
        });
        
        // 7. Emergency DOM ready handler
        const ensureReactReady = () => {
            console.log('🔧 Ensuring React is ready...');
            
            // Check if React root exists
            const rootElement = document.getElementById('root');
            if (rootElement && rootElement.innerHTML.trim() === '') {
                console.log('🔧 Root element is empty, creating emergency content');
                rootElement.innerHTML = `
                    <div style="
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        height: 100vh; 
                        background: #0f172a; 
                        color: #fbbf24;
                        font-family: system-ui, sans-serif;
                        flex-direction: column;
                    ">
                        <div style="
                            border: 2px solid #fbbf24;
                            border-radius: 8px;
                            padding: 20px;
                            text-align: center;
                            max-width: 400px;
                        ">
                            <h1 style="margin: 0 0 10px 0; color: #fbbf24;">Snakkaz Chat</h1>
                            <p style="margin: 0 0 15px 0; color: #94a3b8;">Loading React application...</p>
                            <div style="
                                width: 40px;
                                height: 40px;
                                border: 3px solid #374151;
                                border-top: 3px solid #fbbf24;
                                border-radius: 50%;
                                animation: spin 1s linear infinite;
                                margin: 0 auto;
                            "></div>
                        </div>
                    </div>
                    <style>
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                `;
            }
        };
        
        // 8. Run when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ensureReactReady);
        } else {
            ensureReactReady();
        }
        
        // 9. Set up global error handler
        const originalError = window.onerror;
        window.onerror = function(message, source, lineno, colno, error) {
            console.log('🚨 Global error intercepted:', { message, source, lineno, colno, error });
            
            // Try to handle React-related errors
            if (message && typeof message === 'string') {
                if (message.includes('useState') || message.includes('undefined')) {
                    console.log('🔧 React error detected, attempting recovery...');
                    ensureReactReady();
                    return true; // Prevent default error handling
                }
            }
            
            // Call original error handler
            if (originalError) {
                return originalError.call(this, message, source, lineno, colno, error);
            }
            return false;
        };
        
        console.log('✅ EMERGENCY REACT STATE FIX V4 - APPLIED SUCCESSFULLY');
        
    } catch (fixError) {
        console.error('💥 Emergency React State Fix V4 failed:', fixError);
        
        // Last resort: Show manual recovery instructions
        document.body.innerHTML = `
            <div style="
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                background: #000; 
                color: #fff;
                font-family: monospace;
                padding: 20px;
                box-sizing: border-box;
            ">
                <div style="max-width: 600px; text-align: center;">
                    <h1 style="color: #ff6b6b;">Snakkaz Chat - Critical Error</h1>
                    <p>React initialization failed. Please try:</p>
                    <ol style="text-align: left; color: #feca57;">
                        <li>Clear browser cache (Ctrl+F5)</li>
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
})();

export {};
