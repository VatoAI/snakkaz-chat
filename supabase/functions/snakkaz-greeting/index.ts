// Supabase Edge Function for sending welcome/greeting messages to users
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
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize client with auth context
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'User is not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    let payload;
    try {
      payload = await req.json();
    } catch (e) {
      payload = {};
    }

    // Get user profile to customize greeting
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('username, full_name, created_at, last_seen')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Determine if this is a new user or returning user
    const isNewUser = profile?.created_at && 
      (new Date().getTime() - new Date(profile.created_at).getTime()) < 24 * 60 * 60 * 1000; // Within 24 hours

    // Customize greeting message based on user status
    let greeting = '';
    const username = profile?.username || profile?.full_name || 'bruker';
    
    if (isNewUser) {
      greeting = `Velkommen til Snakkaz, ${username}! 👋 \n\nVi er glade for å ha deg med oss. Her er noen tips for å komme i gang:\n\n- Legg til venner for å starte private samtaler\n- Utforsk gruppesamtalene våre\n- Sjekk ut sikkerhetsfunksjonene for ende-til-ende-kryptering\n\nTrapp vennligst si fra hvis du trenger hjelp med noe!`;
    } else {
      // Get current time in Norway (GMT+2)
      const now = new Date();
      const norwayHour = (now.getUTCHours() + 2) % 24;
      
      // Time-based greeting
      let timeGreeting = '';
      if (norwayHour >= 5 && norwayHour < 12) {
        timeGreeting = 'God morgen';
      } else if (norwayHour >= 12 && norwayHour < 18) {
        timeGreeting = 'God ettermiddag';
      } else {
        timeGreeting = 'God kveld';
      }
      
      greeting = `${timeGreeting}, ${username}! 👋 \n\nVelkommen tilbake til Snakkaz. Det er fint å se deg igjen!`;
    }

    // Format response with greeting and system status
    const response = {
      greeting,
      system_status: {
        app_version: '1.5.2',
        maintenance: false,
        server_time: new Date().toISOString()
      },
      user_info: {
        username: profile?.username,
        last_seen: profile?.last_seen
      }
    };

    // Update last seen timestamp
    await supabaseClient
      .from('profiles')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', user.id);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in snakkaz-greeting function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});