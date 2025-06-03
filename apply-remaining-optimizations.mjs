import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Applying Remaining RLS Performance Optimizations...\n');

try {
    // Read the SQL optimization script
    const sqlScript = fs.readFileSync('/workspaces/snakkaz-chat/apply-remaining-optimizations.sql', 'utf8');
    
    console.log('📝 Executing remaining optimizations...');
    
    // Apply the optimizations via Docker psql
    const command = `docker exec supabase_db_snakkaz-chat psql -U postgres -d postgres -c "${sqlScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`;
    
    const result = execSync(command, { 
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    console.log('✅ Optimization Results:');
    console.log(result);
    
    console.log('\n🎯 Remaining optimizations applied successfully!');
    console.log('📊 Performance improvements should now be visible.');
    
} catch (error) {
    console.error('❌ Error applying optimizations:', error.message);
    
    // Try to apply optimizations piece by piece if the full script fails
    console.log('\n🔄 Trying alternative approach...');
    
    try {
        // Apply the cached function first
        console.log('1️⃣ Creating cached auth.uid() function...');
        execSync(`docker exec supabase_db_snakkaz-chat psql -U postgres -d postgres -c "CREATE OR REPLACE FUNCTION get_current_user_id() RETURNS uuid LANGUAGE plpgsql STABLE AS \\$\\$ DECLARE current_user_id uuid; BEGIN current_user_id := auth.uid(); RETURN current_user_id; END; \\$\\$;"`, { encoding: 'utf8' });
        
        // Apply indexes
        console.log('2️⃣ Creating performance indexes...');
        execSync(`docker exec supabase_db_snakkaz-chat psql -U postgres -d postgres -c "CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id); CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);"`, { encoding: 'utf8' });
        
        console.log('✅ Alternative optimization approach completed!');
        
    } catch (altError) {
        console.error('❌ Alternative approach also failed:', altError.message);
    }
}
