// middleware/authMiddleware.ts
// Authentication middleware for API routes

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

/**
 * Middleware that checks if a user is authenticated via Supabase
 * @param handler The API handler function
 * @returns A wrapped handler that includes authentication checks
 */
export const authMiddleware = (handler: ApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get the Bearer token from the Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Missing or invalid authorization header' });
      }
      
      const token = authHeader.split(' ')[1];
      
      // Verify the token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
      }
      
      // Add authenticated user info to the request
      (req as any).user = user;
      
      // Continue to the handler
      return await handler(req, res);
      
    } catch (error: any) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ success: false, error: 'Server error during authentication' });
    }
  };
};

/**
 * Middleware that checks if a user is an admin
 * @param handler The API handler function
 * @returns A wrapped handler that includes admin role checks
 */
export const adminMiddleware = (handler: ApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // First verify authentication
      const authenticatedHandler = authMiddleware(async (req, res) => {
        const user = (req as any).user;
        
        // Check if user is an admin (customize this logic based on your system)
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
          
        if (error || !data) {
          return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
        }
        
        // Add admin flag to request
        (req as any).isAdmin = true;
        
        // Continue to the handler
        return await handler(req, res);
      });
      
      return await authenticatedHandler(req, res);
      
    } catch (error: any) {
      console.error('Admin middleware error:', error);
      return res.status(500).json({ success: false, error: 'Server error checking admin status' });
    }
  };
};
