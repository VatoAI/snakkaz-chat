// SnakkaZ Chat - Execute Supabase migration directly
console.log("🚀 Executing SnakkaZ database migration...");

const fs = require("fs");

async function executeMigration() {
  try {
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      "https://wqpoozpbceucynsojmbk.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTU2ODMwNSwiZXhwIjoyMDU1MTQ0MzA1fQ.pQu0Mn0MlB397_uKmtYKZWe7sZUO9ABpmYEYiHTNZCY"
    );

    // Read migration file
    const migrationSQL = fs.readFileSync(
      "./supabase/migrations/001_initial_schema.sql",
      "utf8"
    );

    console.log("📋 Executing migration...");

    // Split migration into individual statements
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📊 Found ${statements.length} SQL statements to execute`);

    let executed = 0;
    let failed = 0;

    for (const statement of statements) {
      if (statement.trim().length === 0) continue;

      try {
        const { error } = await supabase.rpc("exec_sql", {
          sql_statement: statement + ";",
        });

        if (error) {
          console.log(`❌ Failed: ${statement.substring(0, 50)}...`);
          console.log(`   Error: ${error.message}`);
          failed++;
        } else {
          executed++;
          if (statement.includes("CREATE TABLE")) {
            const tableName =
              statement.match(/CREATE TABLE\s+[\w.]+\.(\w+)/i)?.[1] ||
              "unknown";
            console.log(`✅ Created table: ${tableName}`);
          } else if (statement.includes("INSERT INTO")) {
            console.log(`✅ Inserted data`);
          } else {
            console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
          }
        }
      } catch (err) {
        console.log(`💥 Exception: ${statement.substring(0, 50)}...`);
        console.log(`   Error: ${err.message}`);
        failed++;
      }
    }

    console.log(`\n📊 Migration Results:`);
    console.log(`   ✅ Executed: ${executed}`);
    console.log(`   ❌ Failed: ${failed}`);

    if (failed === 0) {
      console.log(`\n🎉 Migration completed successfully!`);
      return true;
    } else {
      console.log(`\n⚠️  Migration completed with ${failed} errors`);
      return false;
    }
  } catch (err) {
    console.log("💥 Failed to execute migration:", err.message);
    return false;
  }
}

executeMigration();
