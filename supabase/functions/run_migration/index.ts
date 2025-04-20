
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call the secure migration function we created
    const { error: functionError } = await supabase.rpc('add_media_encryption_columns');
    
    if (functionError) {
      console.error('Error calling add_media_encryption_columns:', functionError);
      
      // Fallback to direct SQL as a last resort (with proper service role permissions)
      const migration = `
      ALTER TABLE IF EXISTS public.messages 
      ADD COLUMN IF NOT EXISTS media_encryption_key TEXT,
      ADD COLUMN IF NOT EXISTS media_iv TEXT,
      ADD COLUMN IF NOT EXISTS media_metadata JSONB;
      `;

      const { error: sqlError } = await supabase.rpc('pgSQL', { query: migration });
      
      if (sqlError) {
        console.error('Fallback migration failed:', sqlError);
        return new Response(
          JSON.stringify({ error: "Migration failed. Both secure function and direct SQL approaches failed." }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Media encryption columns added to messages table" }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
