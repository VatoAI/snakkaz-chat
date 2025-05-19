// Service Worker Unregistration Script
// Run this in the browser console to unregister problematic service workers

// Function to unregister all service workers
async function unregisterAllServiceWorkers() {
  try {
    console.log('[SW Fix] Starting service worker unregistration...');
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    if (registrations.length === 0) {
      console.log('[SW Fix] No service workers found to unregister.');
      return false;
    }
    
    let unregisteredCount = 0;
    for (const registration of registrations) {
      const scope = registration.scope;
      const success = await registration.unregister();
      
      if (success) {
        console.log(`[SW Fix] Successfully unregistered service worker with scope: ${scope}`);
        unregisteredCount++;
      } else {
        console.warn(`[SW Fix] Failed to unregister service worker with scope: ${scope}`);
      }
    }
    
    console.log(`[SW Fix] Unregistered ${unregisteredCount} of ${registrations.length} service workers.`);
    return unregisteredCount > 0;
  } catch (error) {
    console.error('[SW Fix] Error unregistering service workers:', error);
    return false;
  }
}

// Function to clear all caches
async function clearAllCaches() {
  try {
    console.log('[SW Fix] Starting cache clearing...');
    const cacheNames = await caches.keys();
    
    if (cacheNames.length === 0) {
      console.log('[SW Fix] No caches found to clear.');
      return false;
    }
    
    let clearedCount = 0;
    for (const cacheName of cacheNames) {
      const success = await caches.delete(cacheName);
      
      if (success) {
        console.log(`[SW Fix] Successfully cleared cache: ${cacheName}`);
        clearedCount++;
      } else {
        console.warn(`[SW Fix] Failed to clear cache: ${cacheName}`);
      }
    }
    
    console.log(`[SW Fix] Cleared ${clearedCount} of ${cacheNames.length} caches.`);
    return clearedCount > 0;
  } catch (error) {
    console.error('[SW Fix] Error clearing caches:', error);
    return false;
  }
}

// Execute both functions and reload if successful
async function fixServiceWorkerIssues() {
  console.log('======================================');
  console.log('  Snakkaz Chat: Service Worker Fix');
  console.log('======================================');
  
  const swUnregistered = await unregisterAllServiceWorkers();
  const cachesCleared = await clearAllCaches();
  
  if (swUnregistered || cachesCleared) {
    console.log('[SW Fix] Fixed service worker issues! Reloading page in 3 seconds...');
    setTimeout(() => {
      console.log('[SW Fix] Reloading now!');
      window.location.reload(true);
    }, 3000);
  } else {
    console.log('[SW Fix] No service worker issues found to fix.');
  }
}

// Run the fix function
fixServiceWorkerIssues();
