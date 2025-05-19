/**
 * Authentication middleware for the API routes
 * This middleware verifies the user's authentication status and premium subscription
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Check if the user is authenticated
 */
const checkAuth = async (req, res, next) => {
  // Get token from request header
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No authentication token provided'
    });
  }

  try {
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token'
      });
    }

    // Add the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server authentication error'
    });
  }
};

/**
 * Check if the user has a premium subscription
 * This should be used after checkAuth middleware
 */
const checkPremium = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  try {
    // Check if the user has an active premium subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .single();
    
    if (error || !subscription) {
      return res.status(403).json({
        success: false,
        message: 'This feature requires a premium subscription'
      });
    }

    // Add subscription info to the request
    req.subscription = subscription;
    next();
  } catch (error) {
    console.error('Premium check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error checking premium status'
    });
  }
};

module.exports = {
  checkAuth,
  checkPremium
};
