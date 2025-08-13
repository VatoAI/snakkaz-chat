// SnakkaZ Chat - Add a test message to existing room
console.log("🚀 Adding test message to SnakkaZ...");

async function addTestMessage() {
  try {
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      "https://wqpoozpbceucynsojmbk.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTU2ODMwNSwiZXhwIjoyMDU1MTQ0MzA1fQ.pQu0Mn0MlB397_uKmtYKZWe7sZUO9ABpmYEYiHTNZCY"
    );

    // First let's check if there's a user we can use as sender
    const { data: users, error: userError } = await supabase
      .from("profiles")
      .select("id, username")
      .limit(1);

    if (userError) {
      console.log("❌ Cannot access profiles:", userError.message);
      return false;
    }

    console.log(`📊 Found ${users.length} users in profiles table`);

    let senderId = null;
    if (users.length > 0) {
      senderId = users[0].id;
      console.log(`👤 Using user: ${users[0].username} (${senderId})`);
    } else {
      console.log("⚠️  No users found, cannot create message");
      return false;
    }

    // Get the room we created earlier
    const roomId = "550e8400-e29b-41d4-a716-446655440001";

    // Add a system message (without sender_id)
    console.log("💬 Adding system welcome message...");

    const { data: message, error: msgError } = await supabase
      .from("messages")
      .insert({
        group_id: roomId,
        sender_id: senderId,
        encrypted_content:
          "Velkommen til SnakkaZ Norge! 🎉 Dette er en test av chat systemet.",
        is_edited: false,
        is_deleted: false,
        is_delivered: true,
        media_type: "text",
      })
      .select()
      .single();

    if (msgError) {
      console.log("❌ Message insert failed:", msgError.message);
      return false;
    }

    console.log("✅ Test message added successfully!");
    console.log(`📝 Message ID: ${message.id}`);
    console.log(`💬 Content: ${message.encrypted_content}`);

    // Now let's test if we can fetch the room with messages
    console.log("\n🔍 Testing room fetch...");

    const { data: room, error: roomError } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (roomError) {
      console.log("❌ Room fetch failed:", roomError.message);
    } else {
      console.log(`✅ Room found: ${room.name}`);
    }

    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("group_id", roomId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(5);

    if (messagesError) {
      console.log("❌ Messages fetch failed:", messagesError.message);
    } else {
      console.log(`✅ Found ${messages.length} messages in room`);
      messages.forEach((msg) => {
        console.log(`   • ${msg.encrypted_content.substring(0, 50)}...`);
      });
    }

    console.log("\n🎉 Test message setup complete!");
    console.log("🚀 Now go to http://localhost:3001/chat to see it!");

    return true;
  } catch (err) {
    console.log("💥 Failed to add test message:", err.message);
    return false;
  }
}

addTestMessage();
