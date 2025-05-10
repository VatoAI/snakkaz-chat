/**
 * Local fallback for Supabase client
 * 
 * This file serves as a local backup when the remote Supabase client script
 * cannot be loaded. It provides a minimal implementation of the client
 * to prevent application crashes.
 */

(function() {
  // Check if supabase is already defined
  if (window.supabase) {
    console.log('Supabase client already loaded, skipping fallback');
    return;
  }
  
  console.log('Loading fallback Supabase client');
  
  // Create minimal Supabase client implementation
  const createErrorHandler = (methodName) => (...args) => {
    console.warn(`Fallback Supabase client: ${methodName} called but real client not available`);
    // Return a promise that resolves with a basic data structure
    return Promise.resolve({
      data: null,
      error: {
        message: 'Using offline fallback client',
        details: 'The real Supabase client could not be loaded',
        code: 'OFFLINE_MODE'
      }
    });
  };

  const createChainableMethod = (baseFn) => {
    const fn = baseFn;
    
    // Add common query methods
    fn.select = (...args) => createChainableMethod(baseFn);
    fn.insert = (...args) => createChainableMethod(baseFn);
    fn.update = (...args) => createChainableMethod(baseFn);
    fn.delete = (...args) => createChainableMethod(baseFn);
    fn.eq = (...args) => createChainableMethod(baseFn);
    fn.neq = (...args) => createChainableMethod(baseFn);
    fn.gt = (...args) => createChainableMethod(baseFn);
    fn.lt = (...args) => createChainableMethod(baseFn);
    fn.gte = (...args) => createChainableMethod(baseFn);
    fn.lte = (...args) => createChainableMethod(baseFn);
    fn.like = (...args) => createChainableMethod(baseFn);
    fn.ilike = (...args) => createChainableMethod(baseFn);
    fn.is = (...args) => createChainableMethod(baseFn);
    fn.in = (...args) => createChainableMethod(baseFn);
    fn.or = (...args) => createChainableMethod(baseFn);
    fn.and = (...args) => createChainableMethod(baseFn);
    fn.contains = (...args) => createChainableMethod(baseFn);
    fn.containedBy = (...args) => createChainableMethod(baseFn);
    fn.range = (...args) => createChainableMethod(baseFn);
    fn.textSearch = (...args) => createChainableMethod(baseFn);
    fn.filter = (...args) => createChainableMethod(baseFn);
    fn.not = (...args) => createChainableMethod(baseFn);
    fn.order = (...args) => createChainableMethod(baseFn);
    fn.limit = (...args) => createChainableMethod(baseFn);
    fn.offset = (...args) => createChainableMethod(baseFn);
    fn.single = (...args) => createChainableMethod(baseFn);
    fn.maybeSingle = (...args) => createChainableMethod(baseFn);
    fn.csv = (...args) => createChainableMethod(baseFn);
    
    // Add execution method
    fn.then = (onFulfilled, onRejected) => {
      return baseFn().then(onFulfilled, onRejected);
    };
    
    return fn;
  };
  
  // Create a minimal client with the same interface
  const fallbackClient = {
    from: (table) => createChainableMethod(createErrorHandler(`from(${table})`)),
    
    auth: {
      getSession: createErrorHandler('auth.getSession'),
      getUser: createErrorHandler('auth.getUser'),
      signIn: createErrorHandler('auth.signIn'),
      signOut: createErrorHandler('auth.signOut'),
      onAuthStateChange: (callback) => {
        console.warn('Fallback Supabase client: auth.onAuthStateChange called');
        return { 
          data: { 
            subscription: { unsubscribe: () => {} }
          }
        };
      }
    },
    
    storage: {
      from: (bucket) => ({
        upload: createErrorHandler(`storage.from(${bucket}).upload`),
        download: createErrorHandler(`storage.from(${bucket}).download`),
        remove: createErrorHandler(`storage.from(${bucket}).remove`),
        list: createErrorHandler(`storage.from(${bucket}).list`),
        getPublicUrl: (path) => ({
          data: { publicUrl: `offline://storage/${bucket}/${path}` },
          error: null
        })
      })
    },
    
    functions: {
      invoke: createErrorHandler('functions.invoke')
    },
    
    // Realtime features
    channel: (name) => {
      console.warn(`Fallback Supabase client: channel(${name}) called`);
      
      return {
        on: (...args) => ({
          subscribe: () => ({ unsubscribe: () => {} })
        }),
        subscribe: () => ({ unsubscribe: () => {} })
      };
    },
    
    removeChannel: (channel) => {}
  };

  // Set global variables
  window.supabase = fallbackClient;
  window.createClient = () => fallbackClient;
  
  // Dispatch event that fallback client is ready
  const event = new CustomEvent('supabase_fallback_loaded');
  document.dispatchEvent(event);
  
  console.log('Fallback Supabase client initialized in offline mode');
})();
