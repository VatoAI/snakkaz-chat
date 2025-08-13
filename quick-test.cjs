// SnakkaZ Chat - Quick table check and data insert
console.log("🚀 Quick SnakkaZ database check...");

async function quickTest() {
  try {
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      "https://wqpoozpbceucynsojmbk.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTU2ODMwNSwiZXhwIjoyMDU1MTQ0MzA1fQ.pQu0Mn0MlB397_uKmtYKZWe7sZUO9ABpmYEYiHTNZCY"
    );

    // Try to insert minimal chat room data
    console.log("📋 Creating minimal chat room...");

    const { data: room, error: roomError } = await supabase
      .from("chat_rooms")
      .insert({
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "SnakkaZ Norge 🇳🇴",
        description: "Hovedchat for alle norske brukere",
        type: "group",
      })
      .select()
      .single();

    if (roomError) {
      console.log(`❌ Room insert failed: ${roomError.message}`);

      // Try simpler approach - just select existing rooms
      console.log("📋 Checking existing rooms...");
      const { data: existingRooms, error: selectError } = await supabase
        .from("chat_rooms")
        .select("*")
        .limit(5);

      if (selectError) {
        console.log(
          `❌ Table doesn't exist or access denied: ${selectError.message}`
        );
        return false;
      } else {
        console.log(`✅ Found ${existingRooms.length} existing rooms:`);
        existingRooms.forEach((room) => {
          console.log(
            `   • ${room.name || "Unnamed"} (${room.type || "unknown"})`
          );
        });
      }
    } else {
      console.log(`✅ Room created: ${room.name}`);
    }

    // Add a test message
    console.log("\n💬 Adding test message...");

    const { data: message, error: msgError } = await supabase
      .from("messages")
      .insert({
        room_id: "550e8400-e29b-41d4-a716-446655440001",
        content: "Velkommen til SnakkaZ! 🎉",
        message_type: "text",
      })
      .select()
      .single();

    if (msgError) {
      console.log(`❌ Message insert failed: ${msgError.message}`);
    } else {
      console.log(`✅ Test message added!`);
    }

    console.log("\n🎉 Quick test complete!");
    console.log("🚀 Go to http://localhost:3001/chat to test!");

    return true;
  } catch (err) {
    console.log("💥 Quick test failed:", err.message);
    return false;
  }
}

quickTest();
