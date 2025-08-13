// SnakkaZ Chat - Add test data for immediate testing
console.log("🚀 Adding test data to SnakkaZ...");

async function addTestData() {
  try {
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      "https://wqpoozpbceucynsojmbk.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTU2ODMwNSwiZXhwIjoyMDU1MTQ0MzA1fQ.pQu0Mn0MlB397_uKmtYKZWe7sZUO9ABpmYEYiHTNZCY"
    );

    // 1. Add test chat rooms using service role
    console.log("📋 Adding test chat rooms...");

    const testRooms = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "SnakkaZ Norge 🇳🇴",
        description: "Hovedchat for alle norske brukere",
        type: "public",
        is_default: true,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Tech Talk 💻",
        description: "Diskuter teknologi og programmering",
        type: "public",
        is_default: false,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        name: "Generelt 💬",
        description: "Generelle samtaler og småprat",
        type: "public",
        is_default: false,
      },
    ];

    for (const room of testRooms) {
      const { error } = await supabase
        .from("chat_rooms")
        .upsert(room, { onConflict: "id" });

      if (error) {
        console.log(`❌ Failed to add room ${room.name}:`, error.message);
      } else {
        console.log(`✅ Added room: ${room.name}`);
      }
    }

    // 2. Add some test messages
    console.log("\n💬 Adding test messages...");

    const testMessages = [
      {
        id: "660e8400-e29b-41d4-a716-446655440001",
        room_id: "550e8400-e29b-41d4-a716-446655440001",
        sender_id: null, // System message
        content:
          "Velkommen til SnakkaZ Norge! 🎉 Her kan du chatte med andre norske brukere.",
        message_type: "text",
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440002",
        room_id: "550e8400-e29b-41d4-a716-446655440002",
        sender_id: null,
        content:
          "Velkommen til Tech Talk! 💻 Diskuter alt innen teknologi her.",
        message_type: "text",
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440003",
        room_id: "550e8400-e29b-41d4-a716-446655440003",
        sender_id: null,
        content: "Velkommen til Generelt! 💬 Prat om hva som helst her.",
        message_type: "text",
      },
    ];

    for (const message of testMessages) {
      const { error } = await supabase
        .from("messages")
        .upsert(message, { onConflict: "id" });

      if (error) {
        console.log(`❌ Failed to add message:`, error.message);
      } else {
        console.log(`✅ Added welcome message to room`);
      }
    }

    console.log("\n🎉 Test data added successfully!");
    console.log("🚀 Now you can:");
    console.log("   • Go to http://localhost:3001/chat");
    console.log("   • See the chat rooms");
    console.log("   • Register/login to start chatting");
    console.log("   • Send messages in real-time!");

    return true;
  } catch (err) {
    console.log("💥 Failed to add test data:", err.message);
    return false;
  }
}

addTestData();
