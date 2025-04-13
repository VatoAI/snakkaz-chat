
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();
  console.log("Starting cleanup process at:", new Date(startTime).toISOString());
  
  try {
    // Parse request body for any configuration options
    let config = { 
      cleanupAge: 5, // default to 5 minutes
      verbose: false
    };
    
    try {
      // Allow customization of cleanup via POST body
      const body = await req.json().catch(() => ({}));
      if (body && typeof body === 'object') {
        if (body.cleanupAge && typeof body.cleanupAge === 'number' && body.cleanupAge > 0) {
          config.cleanupAge = body.cleanupAge;
        }
        if (body.verbose === true) {
          config.verbose = true;
        }
      }
    } catch (e) {
      // If parsing fails, use defaults
      console.log("No custom config provided, using defaults");
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing required Supabase environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Record the cleanup execution in health table 
    await supabase
      .from("health")
      .upsert({
        id: "cleanup-started-" + new Date().toISOString(),
        status: `cleanup_started_${new Date().toISOString()}`,
        last_checked: new Date().toISOString()
      });
    
    // Delete old signaling records
    const signalingQuery = supabase
      .from("signaling")
      .delete({ count: "exact" })
      .lt("created_at", new Date(Date.now() - config.cleanupAge * 60 * 1000).toISOString());
    
    const { error: signalingError, count: signalingCount } = await signalingQuery;

    if (signalingError) {
      console.error("Error cleaning up signaling records:", signalingError);
      throw signalingError;
    } else {
      console.log(`Successfully deleted ${signalingCount || 0} signaling records`);
    }

    // Delete stale presence records
    const presenceQuery = supabase
      .from("user_presence")
      .delete({ count: "exact" })
      .lt("last_seen", new Date(Date.now() - config.cleanupAge * 60 * 1000).toISOString());
    
    const { error: presenceError, count: presenceCount } = await presenceQuery;

    if (presenceError) {
      console.error("Error cleaning up presence records:", presenceError);
      throw presenceError;
    } else {
      console.log(`Successfully deleted ${presenceCount || 0} presence records`);
    }

    // Calculate the total execution time
    const executionTime = Date.now() - startTime;
    console.log(`Cleanup process completed in ${executionTime}ms`);

    // Record successful completion in health table
    await supabase
      .from("health")
      .upsert({
        id: "38d75fee-16f2-4b42-a084-93567e21e3a7",
        status: `cleanup_completed_successfully_${new Date().toISOString()}`,
        last_checked: new Date().toISOString()
      });
    
    // Optional: Generate detailed stats for monitoring
    let detailedStats = {};
    if (config.verbose) {
      // Get current table counts for monitoring
      const signalingCountQuery = await supabase
        .from("signaling")
        .select("id", { count: "exact", head: true });
      
      const presenceCountQuery = await supabase
        .from("user_presence")
        .select("id", { count: "exact", head: true });
      
      detailedStats = {
        signaling_records_remaining: signalingCountQuery.count || 0,
        presence_records_remaining: presenceCountQuery.count || 0,
        oldest_signaling_record: null,
        oldest_presence_record: null
      };
      
      // Get oldest records for monitoring
      const oldestSignalingQuery = await supabase
        .from("signaling")
        .select("created_at")
        .order("created_at", { ascending: true })
        .limit(1);
      
      const oldestPresenceQuery = await supabase
        .from("user_presence")
        .select("last_seen")
        .order("last_seen", { ascending: true })
        .limit(1);
      
      if (oldestSignalingQuery.data?.[0]) {
        detailedStats.oldest_signaling_record = oldestSignalingQuery.data[0].created_at;
      }
      
      if (oldestPresenceQuery.data?.[0]) {
        detailedStats.oldest_presence_record = oldestPresenceQuery.data[0].last_seen;
      }
    }

    // Return the results
    return new Response(
      JSON.stringify({
        signaling: {
          deletedCount: signalingCount || 0,
          error: null,
        },
        presence: {
          deletedCount: presenceCount || 0,
          error: null,
        },
        executionTime: `${executionTime}ms`,
        timestamp: new Date().toISOString(),
        config,
        ...(config.verbose ? { stats: detailedStats } : {})
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error cleaning up database:", error);
    
    // Create a Supabase client to log the error
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from("health")
          .upsert({
            id: "cleanup-error-" + new Date().toISOString(),
            status: `cleanup_error_${error.message || "Unknown error"}`,
            last_checked: new Date().toISOString()
          });
      }
    } catch (logError) {
      console.error("Error logging cleanup error:", logError);
    }
    
    return new Response(
      JSON.stringify({
        error: error.message || "Unknown error occurred",
        timestamp: new Date().toISOString()
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
