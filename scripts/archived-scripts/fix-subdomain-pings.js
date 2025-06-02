/**
 * Enhanced Subdomain Handler for Snakkaz Chat
 * 
 * This script intercepts requests to non-existent subdomains and provides mock responses
 * for both /ping paths and direct subdomain root access.
 */

// List of subdomains that should be mocked
const SUBDOMAINS_TO_MOCK = ['analytics', 'business', 'dash', 'docs', 'www'];

// Create a mock response for ping endpoints and root access
const createMockResponse = (subdomain, isRoot = false) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: `${subdomain}.snakkaz.com`,
    service: subdomain,
    message: isRoot ? 'Mock service root is operational' : 'Mock service ping is operational'
  };
};

// Function to check if the URL matches a subdomain request
const isSubdomainRequest = (url, subdomain) => {
  // Check for direct subdomain access (e.g., https://analytics.snakkaz.com)
  const rootRegex = new RegExp(`^https?://${subdomain}\\.snakkaz\\.com/?$`, 'i');
  
  // Check for ping path access (e.g., https://analytics.snakkaz.com/ping)
  const pingRegex = new RegExp(`^https?://${subdomain}\\.snakkaz\\.com/ping/?$`, 'i');
  
  return rootRegex.test(url) || pingRegex.test(url);
};

// Function to determine if it's a root request or ping request
const isRootRequest = (url, subdomain) => {
  const rootRegex = new RegExp(`^https?://${subdomain}\\.snakkaz\\.com/?$`, 'i');
  return rootRegex.test(url);
};

// Override fetch for specific subdomain endpoints
const originalFetch = window.fetch;
window.fetch = function(input, init) {
  const url = typeof input === 'string' ? input : input.url;
  
  // Check if this is a request to one of our subdomains
  for (const subdomain of SUBDOMAINS_TO_MOCK) {
    if (isSubdomainRequest(url, subdomain)) {
      const isRoot = isRootRequest(url, subdomain);
      console.log(`Intercepted ${isRoot ? 'root' : 'ping'} request to ${subdomain}.snakkaz.com`);
      
      // Return a mock successful response
      return Promise.resolve(new Response(
        JSON.stringify(createMockResponse(subdomain, isRoot)),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      ));
    }
  }
  
  // For all other requests, use the original fetch
  return originalFetch.apply(this, arguments);
};

// Create mock XMLHttpRequest for subdomain endpoints
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...rest) {
  this._url = url;
  return originalXHROpen.call(this, method, url, ...rest);
};

const originalXHRSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(body) {
  // Check if this is a request to one of our subdomains
  for (const subdomain of SUBDOMAINS_TO_MOCK) {
    if (this._url && isSubdomainRequest(this._url, subdomain)) {
      const isRoot = isRootRequest(this._url, subdomain);
      console.log(`Intercepted XHR ${isRoot ? 'root' : 'ping'} request to ${subdomain}.snakkaz.com`);
      
      // Mock the XHR response
      setTimeout(() => {
        Object.defineProperty(this, 'readyState', { value: 4 });
        Object.defineProperty(this, 'status', { value: 200 });
        Object.defineProperty(this, 'responseText', { 
          value: JSON.stringify(createMockResponse(subdomain, isRoot))
        });
        
        // Trigger load event
        const loadEvent = new Event('load');
        this.dispatchEvent(loadEvent);
      }, 10);
      
      return;
    }
  }
  
  // For all other XHR requests, use the original send
  return originalXHRSend.call(this, body);
};

console.log('Snakkaz Chat: Enhanced subdomain handler installed (handles both root and ping paths)');
