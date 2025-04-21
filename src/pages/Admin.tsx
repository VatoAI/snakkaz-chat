import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings, Users, AlertCircle, BarChart, Shield } from "lucide-react";
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
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";
import { AdminSystemHealth } from "@/components/admin/AdminSystemHealth";
import { AdminErrorLogs } from "@/components/admin/AdminErrorLogs";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [healthStatus, setHealthStatus] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { progressValue, updateProgress, isLoading } = useProgressState();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin(user?.id);

  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }

    console.log("[AdminPage] Current user:", user, "isAdmin:", isAdmin);

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
      
      const interval = setInterval(fetchHealthStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminSessionExpiry");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleProgressChange = (values: number[]) => {
    updateProgress(values[0]);
  };

  const triggerCleanup = async () => {
    try {
      const baseUrl = "https://wqpoozpbceucynsojmbk.supabase.co";
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

  if (!user) {
    return <div className="p-8 text-center text-red-400 text-lg">Du må være logget inn for å se denne siden.</div>;
  }

  if (adminLoading) {
    return <div className="p-8 text-center text-cyberblue-300 text-lg">Sjekker admin-tilgang...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-red-400 text-lg">
        Du har ikke administratorrettigheter.<br />
        Ta kontakt med en administrator for å få tilgang.
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <TooltipProvider>
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
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-cyberdark-900">
              <TabsTrigger value="dashboard">
                <BarChart className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Brukere
              </TabsTrigger>
              <TabsTrigger value="general">
                <Settings className="h-4 w-4 mr-2" />
                Generelt
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Sikkerhet
              </TabsTrigger>
              <TabsTrigger value="logs">
                <AlertCircle className="h-4 w-4 mr-2" />
                Logger
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Settings className="h-4 w-4 mr-2" />
                Utseende
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <AdminDashboard healthStatus={healthStatus} triggerCleanup={triggerCleanup} />
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6">
              <AdminUsersManager />
            </TabsContent>
            
            <TabsContent value="general" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <AdminApiKeySection />
                <AdminSystemHealth healthStatus={healthStatus} triggerCleanup={triggerCleanup} />
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-cyberdark-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-cyberblue-300">Sikkerhetsinnstillinger</CardTitle>
                  <CardDescription>Administrer sikkerhet og tilgang</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-400">
                    <Shield className="mx-auto h-12 w-12 mb-4 text-cyberblue-400 opacity-50" />
                    <p>Sikkerhetsinnstillinger kommer snart</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="logs" className="space-y-6">
              <AdminErrorLogs />
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
            
            <TabsContent value="appearance" className="space-y-6">
              <AdminLogoSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Admin;
