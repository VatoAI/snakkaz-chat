/**
 * Fix for www.snakkaz.com domain
 * 
 * This script provides a fix for fetching from www.snakkaz.com domain
 * by intercepting requests and returning mock responses where needed.
 * 
 * Created: May 24, 2025
 */

// Function to check if a request is for www.snakkaz.com
function isWwwDomainRequest(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'www.snakkaz.com';
  } catch (e) {
    return false;
  }
}

// Function to check if it's a ping request
function isPingRequest(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname === '/ping';
  } catch (e) {
    return false;
  }
}

// Mock response for www.snakkaz.com
function createWwwResponse(isPing = false) {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: 'www.snakkaz.com',
    service: 'main',
    version: '1.0.0',
    message: isPing ? 'Main service ping is operational' : 'Main service is operational'
  };
}

// Override fetch for www.snakkaz.com
const originalFetch = window.fetch;
window.fetch = function(input, init) {
  const url = typeof input === 'string' ? input : input instanceof Request ? input.url : '';
  
  // Handle www.snakkaz.com requests
  if (isWwwDomainRequest(url)) {
    const isPing = isPingRequest(url);
    console.log(`Intercepted ${isPing ? 'ping' : 'regular'} request to www.snakkaz.com`);
    
    // Return mock response
    return Promise.resolve(new Response(
      JSON.stringify(createWwwResponse(isPing)),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    ));
  }
  
  // For all other requests, use the original fetch
  return originalFetch.apply(this, arguments);
};

// Also handle XMLHttpRequest for www.snakkaz.com
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...rest) {
  this._url = url;
  return originalXHROpen.call(this, method, url, ...rest);
};

const originalXHRSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(body) {
  // Check if this is a request to www.snakkaz.com
  if (this._url && isWwwDomainRequest(this._url)) {
    const isPing = isPingRequest(this._url);
    console.log(`Intercepted XHR ${isPing ? 'ping' : 'regular'} request to www.snakkaz.com`);
    
    // Mock the XHR response
    setTimeout(() => {
      Object.defineProperty(this, 'readyState', { value: 4 });
      Object.defineProperty(this, 'status', { value: 200 });
      Object.defineProperty(this, 'responseText', { 
        value: JSON.stringify(createWwwResponse(isPing))
      });
      
      // Trigger load event
      const loadEvent = new Event('load');
      this.dispatchEvent(loadEvent);
    }, 10);
    
    return;
  }
  
  // For all other XHR requests, use the original send
  return originalXHRSend.call(this, body);
};

console.log('Fix for www.snakkaz.com domain installed');
