// SnakkaZ Chat - Check actual table schemas
console.log("🚀 Checking actual Supabase table schemas...");

async function checkSchemas() {
  try {
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      "https://wqpoozpbceucynsojmbk.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTU2ODMwNSwiZXhwIjoyMDU1MTQ0MzA1fQ.pQu0Mn0MlB397_uKmtYKZWe7sZUO9ABpmYEYiHTNZCY"
    );

    // Check what tables exist
    console.log("📋 Checking available tables...");

    try {
      const { data: rooms } = await supabase
        .from("chat_rooms")
        .select("*")
        .limit(1);
      console.log("✅ chat_rooms table exists");
      if (rooms && rooms.length > 0) {
        console.log("   Columns:", Object.keys(rooms[0]));
      }
    } catch (e) {
      console.log("❌ chat_rooms:", e.message);
    }

    try {
      const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .limit(1);
      console.log("✅ messages table exists");
      if (messages && messages.length > 0) {
        console.log("   Columns:", Object.keys(messages[0]));
      }
    } catch (e) {
      console.log("❌ messages:", e.message);
    }

    try {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);
      console.log("✅ profiles table exists");
      if (profiles && profiles.length > 0) {
        console.log("   Columns:", Object.keys(profiles[0]));
      }
    } catch (e) {
      console.log("❌ profiles:", e.message);
    }

    try {
      const { data: userProfiles } = await supabase
        .from("user_profiles")
        .select("*")
        .limit(1);
      console.log("✅ user_profiles table exists");
      if (userProfiles && userProfiles.length > 0) {
        console.log("   Columns:", Object.keys(userProfiles[0]));
      }
    } catch (e) {
      console.log("❌ user_profiles:", e.message);
    }

    // Try direct SQL to see what tables exist
    console.log("\n🔍 Checking with direct SQL...");

    try {
      // This might work with rpc if the function exists
      const { data: tables } = await supabase.rpc("get_schema_info");
      console.log("Tables:", tables);
    } catch (e) {
      console.log("Cannot get schema info:", e.message);
    }

    console.log("\n✨ Schema check complete!");
  } catch (err) {
    console.log("💥 Schema check failed:", err.message);
  }
}

checkSchemas();
