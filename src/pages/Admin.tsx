
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AdminApiKeySection } from "@/components/AdminApiKeySection";
import { AdminLogoSection } from "@/components/AdminLogoSection";
import { AdminAuth } from "@/components/AdminAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useProgressState } from "@/hooks/useProgressState";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [healthStatus, setHealthStatus] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { progressValue, updateProgress, isLoading } = useProgressState();

  useEffect(() => {
    // Check system health status
    const fetchHealthStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('health')
          .select('id, status, last_checked');
        
        if (error) throw error;
        
        const statusMap: Record<string, string> = {};
        data?.forEach(item => {
          statusMap[item.id] = item.status;
        });
        
        setHealthStatus(statusMap);
      } catch (err) {
        console.error("Error fetching health status:", err);
      }
    };

    if (isAuthenticated) {
      fetchHealthStatus();
      
      // Set up polling for health status
      const interval = setInterval(fetchHealthStatus, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleProgressChange = (values: number[]) => {
    updateProgress(values[0]);
  };

  const triggerCleanup = async () => {
    try {
      const baseUrl = "https://wqpoozpbceucynsojmbk.supabase.co";
      // Get the current session
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || '';
      
      const response = await fetch(`${baseUrl}/functions/v1/cleanup_signaling`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Opprydding fullført",
          description: `Fjernet ${result.signaling?.deletedCount || 0} signaleringsoppføringer og ${result.presence?.deletedCount || 0} tilstedeværelsesoppføringer.`,
        });
      } else {
        throw new Error(result.error || "Ukjent feil");
      }
    } catch (err) {
      console.error("Error triggering cleanup:", err);
      toast({
        title: "Feil",
        description: "Kunne ikke kjøre opprydningsfunksjon: " + (err as Error).message,
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-cyberdark-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-4" 
              onClick={() => navigate("/")}
            >
              <ChevronLeft className="mr-2" size={20} /> Tilbake
            </Button>
            <h1 
              className="text-3xl font-bold"
              style={{
                background: 'linear-gradient(90deg, #1a9dff 0%, #ffffff 50%, #d62828 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '-3px 0 10px rgba(26,157,255,0.5), 3px 0 10px rgba(214,40,40,0.5)',
              }}
            >
              Admin Panel
            </h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logg ut
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 bg-cyberdark-900">
            <TabsTrigger value="general">Generelt</TabsTrigger>
            <TabsTrigger value="progress">Fremdrift</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="appearance">Utseende</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <AdminApiKeySection />
              <Card className="bg-cyberdark-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-cyberblue-300">System Status</CardTitle>
                  <CardDescription>Oversikt over systemstatus og helse</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Signaling Service</span>
                      <span className={`text-sm ${healthStatus['38d75fee-16f2-4b42-a084-93567e21e3a7']?.includes('error') ? 'text-red-400' : 'text-green-400'}`}>
                        {healthStatus['38d75fee-16f2-4b42-a084-93567e21e3a7'] || 'Ukjent'}
                      </span>
                    </div>
                    <Progress 
                      value={healthStatus['38d75fee-16f2-4b42-a084-93567e21e3a7']?.includes('error') ? 30 : 100} 
                      className="h-1"
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={triggerCleanup}
                  >
                    <Settings className="mr-2" size={16} />
                    Kjør Opprydning Manuelt
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6">
            <Card className="bg-cyberdark-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-cyberblue-300">Fremdrift</CardTitle>
                <CardDescription>Juster prosjektets synlige fremdriftsstatus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-cyberblue-400">Progresjon</span>
                    <span className="text-white font-semibold">{progressValue}%</span>
                  </div>
                  
                  <Progress value={progressValue} />
                </div>
                
                <div className="space-y-4">
                  <div className="mb-4">
                    <p className="text-gray-400 mb-3">Juster prosent (1-99%):</p>
                    <Slider 
                      value={[progressValue]} 
                      min={1} 
                      max={99} 
                      step={1} 
                      onValueChange={handleProgressChange}
                      className="py-4"
                      disabled={isLoading}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1%</span>
                      <span>99%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-cyberdark-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-cyberblue-300">System Informasjon</CardTitle>
                <CardDescription>Detaljer om systemets helse og opprydningsstatusar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(healthStatus).map(([id, status]) => (
                    <div key={id} className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-sm text-gray-400">{id.substring(0, 8)}...</span>
                      <span className={`text-sm ${status.includes('error') ? 'text-red-400' : 'text-green-400'}`}>
                        {status}
                      </span>
                    </div>
                  ))}
                  
                  {Object.keys(healthStatus).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      Ingen helsedata tilgjengelig
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <AdminLogoSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
