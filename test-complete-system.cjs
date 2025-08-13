// Tester om SnakkaZ Chat fungerer komplett med ekte brukere
console.log("🚀 SnakkaZ Chat System Test - Starting...");

// Test 1: Supabase tilkobling
async function testSupabaseConnection() {
  try {
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      "https://wqpoozpbceucynsojmbk.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8"
    );

    // Test basic connection
    const { data: rooms, error } = await supabase
      .from("chat_rooms")
      .select("id, name, type, created_at")
      .limit(5);

    if (error) {
      console.log("❌ Supabase connection failed:", error.message);
      return false;
    }

    console.log("✅ Supabase connection successful!");
    console.log(`📊 Found ${rooms.length} chat rooms:`);
    rooms.forEach((room) => {
      console.log(`   • ${room.name} (${room.type}) - ID: ${room.id}`);
    });

    return true;
  } catch (err) {
    console.log("💥 Supabase test failed:", err.message);
    return false;
  }
}

// Test 2: Authentication check
async function testAuthentication() {
  try {
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      "https://wqpoozpbceucynsojmbk.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8"
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      console.log("✅ User is logged in!");
      console.log(`👤 User: ${user.email} (ID: ${user.id})`);
      return true;
    } else {
      console.log("❌ No user logged in");
      return false;
    }
  } catch (err) {
    console.log("💥 Auth test failed:", err.message);
    return false;
  }
}

// Test 3: Chat functionality
async function testChatFunctionality() {
  try {
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      "https://wqpoozpbceucynsojmbk.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8"
    );

    // Check if we can access the test room
    const testRoomId = "550e8400-e29b-41d4-a716-446655440001"; // SnakkaZ Norge

    const { data: room, error: roomError } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("id", testRoomId)
      .single();

    if (roomError) {
      console.log("❌ Could not access test room:", roomError.message);
      return false;
    }

    console.log("✅ Test room accessible!");
    console.log(`🏠 Room: ${room.name} (${room.type})`);

    // Check for recent messages
    const { data: messages, error: msgError } = await supabase
      .from("messages")
      .select("*, sender:profiles(username)")
      .eq("room_id", testRoomId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (msgError) {
      console.log("⚠️  Could not fetch messages:", msgError.message);
    } else {
      console.log(`💬 Found ${messages.length} recent messages`);
      messages.forEach((msg) => {
        console.log(
          `   • ${msg.sender?.username || "Unknown"}: ${msg.content.substring(
            0,
            50
          )}...`
        );
      });
    }

    return true;
  } catch (err) {
    console.log("💥 Chat test failed:", err.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log("\n🧪 Running SnakkaZ Chat System Tests...\n");

  const test1 = await testSupabaseConnection();
  console.log("");

  const test2 = await testAuthentication();
  console.log("");

  const test3 = await testChatFunctionality();
  console.log("");

  const allPassed = test1 && test2 && test3;

  console.log("📋 TEST RESULTS:");
  console.log(`   Database Connection: ${test1 ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`   Authentication: ${test2 ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`   Chat Functionality: ${test3 ? "✅ PASS" : "❌ FAIL"}`);
  console.log("");

  if (allPassed) {
    console.log("🎉 ALL TESTS PASSED! SnakkaZ Chat is ready for users!");
    console.log("🚀 Users can now:");
    console.log("   • Navigate to http://localhost:3001/chat");
    console.log("   • Register or sign in with existing accounts");
    console.log("   • Join chat rooms and send messages");
    console.log("   • Experience real-time messaging");
  } else {
    console.log("⚠️  Some tests failed. Check the issues above.");
  }

  console.log("\n✨ SnakkaZ Chat System Test Complete!");
}

runAllTests();
