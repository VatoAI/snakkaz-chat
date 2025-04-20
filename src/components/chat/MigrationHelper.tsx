
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

export const MigrationHelper = () => {
  const [running, setRunning] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const { toast } = useToast();
  const { notify } = useNotifications();
  
  const runMigration = async () => {
    setRunning(true);
    setSuccess(null);
    setAttempts(prev => prev + 1);
    
    try {
      // First attempt: call the edge function
      try {
        const { data, error } = await supabase.functions.invoke('run_migration');
        
        if (error) throw error;
        
        setSuccess(true);
        toast({
          title: "Migration successful",
          description: "Media encryption columns have been added to the database.",
        });
        
        notify("Database Updated", {
          body: "Media encryption is now available for your messages",
        });
        return;
      } catch (edgeFunctionError) {
        console.error("Edge function error:", edgeFunctionError);
        // Continue with fallback approach
      }
      
      // Fallback: try using RPC if available
      try {
        const { error } = await supabase.rpc('add_media_encryption_columns');
        
        if (error) throw error;
        
        setSuccess(true);
        toast({
          title: "Migration successful",
          description: "Media encryption columns have been added to the database.",
        });
        
        notify("Database Updated", {
          body: "Media encryption is now available for your messages",
        });
        return;
      } catch (rpcError) {
        console.error("RPC error:", rpcError);
        throw rpcError;
      }
    } catch (error) {
      console.error("Migration failed:", error);
      setSuccess(false);
      toast({
        title: "Migration failed",
        description: "Could not add media encryption columns. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };
  
  // Try to run migration automatically on component mount, but only once
  useEffect(() => {
    const autoMigrate = async () => {
      await runMigration();
    };
    
    autoMigrate();
    // We intentionally don't include runMigration in deps to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  if (success === true) {
    return null; // Hide when successful
  }
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-cyberdark-900 border border-cyberred-500 rounded-lg shadow-lg z-50">
      <div className="text-cyberred-400 mb-2 text-sm">
        Database migration needed for media encryption
      </div>
      <div className="flex items-center justify-between">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={runMigration} 
          disabled={running}
          className="bg-cyberred-600 hover:bg-cyberred-700"
        >
          {running ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Running...
            </>
          ) : (
            attempts > 0 ? "Retry Migration" : "Run Migration"
          )}
        </Button>
        {success === false && (
          <div className="text-cyberred-400 text-xs ml-2">
            Error: Couldn't add required columns
          </div>
        )}
      </div>
    </div>
  );
};
