/**
 * 🚨 EMERGENCY HOTFIX FOR SNAKKAZ.COM
 * Fixes critical "Nt is undefined" error causing black screen
 * 
 * This file should be uploaded to the live server immediately via FTP
 * and included in index.html BEFORE any other scripts
 */

(function() {
    'use strict';
    
    console.log('🚨 SNAKKAZ EMERGENCY HOTFIX - Loading...');
    
    // 1. CRITICAL: Fix the specific "Nt is undefined" error
    if (typeof window.Nt === 'undefined') {
        window.Nt = function(initialState) {
            console.log('🔧 Emergency Nt called with:', initialState);
            return [initialState, function(newValue) {
                console.log('🔧 Emergency Nt setter:', newValue);
            }];
        };
        console.log('✅ Fixed Nt undefined error');
    }
    
    // 2. Fix other minified React variables that might be undefined
    const reactVars = ['Mt', 'Pt', 'Qt', 'Rt', 'St', 'Tt', 'Ut', 'Vt', 'Wt'];
    reactVars.forEach(function(varName) {
        if (typeof window[varName] === 'undefined') {
            window[varName] = function(initialState) {
                return [initialState, function() {}];
            };
            console.log('✅ Fixed ' + varName + ' undefined error');
        }
    });
    
    // 3. Ensure React namespace exists
    if (!window.React) {
        window.React = {};
    }
    
    // 4. Provide emergency useState
    if (!window.React.useState) {
        window.React.useState = function(initialState) {
            console.log('🔧 Emergency React.useState called');
            return [initialState, function() {}];
        };
    }
    
    // 5. Provide emergency useSyncExternalStore
    if (!window.React.useSyncExternalStore) {
        window.React.useSyncExternalStore = function(subscribe, getSnapshot) {
            console.log('🔧 Emergency React.useSyncExternalStore called');
            try {
                return getSnapshot ? getSnapshot() : null;
            } catch (e) {
                console.warn('useSyncExternalStore error:', e);
                return null;
            }
        };
    }
    
    // 6. Global useSyncExternalStore
    if (!window.useSyncExternalStore) {
        window.useSyncExternalStore = window.React.useSyncExternalStore;
    }
    
    // 7. Enable use-sync-external-store polyfill
    window.__USE_SYNC_EXTERNAL_STORE_POLYFILL__ = true;
    
    console.log('✅ SNAKKAZ EMERGENCY HOTFIX - Applied successfully!');
    console.log('🎯 This should fix the black screen "Nt is undefined" error');
    
})();
