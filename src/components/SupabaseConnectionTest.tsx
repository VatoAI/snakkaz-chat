import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { testSupabaseConnection } from '@/utils/test-supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

export function SupabaseConnectionTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const testResult = await testSupabaseConnection();
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        message: `Test error: ${error instanceof Error ? error.message : String(error)}`,
        error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>
          Test the connection to your Supabase project
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <Alert className={result.success ? "bg-green-50" : "bg-red-50"}>
            <div className="flex items-center gap-2">
              {result.success 
                ? <CheckCircle2 className="h-5 w-5 text-green-600" /> 
                : <XCircle className="h-5 w-5 text-red-600" />}
              <AlertTitle>
                {result.success ? 'Connection Successful' : 'Connection Failed'}
              </AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              {result.message}
              
              {result.success && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Connection Details:</p>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Auth</Badge>
                      <span className="text-sm">
                        {result.sessionData?.session ? 'Session active' : 'No active session'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Database</Badge>
                      <span className="text-sm">
                        Access verified
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!result.success && result.error && (
                <div className="mt-2 p-2 bg-red-100 rounded text-sm font-mono overflow-auto max-h-32">
                  {JSON.stringify(result.error, null, 2)}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={runTest} disabled={loading} className="w-full">
          {loading ? 'Testing Connection...' : 'Test Connection'}
        </Button>
      </CardFooter>
    </Card>
  );
}