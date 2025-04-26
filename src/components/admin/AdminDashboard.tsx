import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MessageSquare, 
  BarChart, 
  Activity, 
  Database, 
  CloudOff,
  RefreshCcw,
  Loader2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStatsType {
  totalUsers: number;
  totalMessages: number;
  activeUsers: number;
  storageUsed: string;
  uptime: number;
  usersTrend: 'up' | 'down' | 'stable';
  messagesTrend: 'up' | 'down' | 'stable';
  activeUsersTrend: 'up' | 'down' | 'stable';
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStatsType>({
    totalUsers: 0,
    totalMessages: 0,
    activeUsers: 0,
    storageUsed: "0 MB",
    uptime: 99.9,
    usersTrend: 'stable',
    messagesTrend: 'stable',
    activeUsersTrend: 'stable'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usageData, setUsageData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardStats();
    generateUsageData();
  }, []);

  const generateUsageData = () => {
    const days = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];
    const data = [];
    
    // Generate some random but realistic looking data
    const baseUsers = Math.floor(Math.random() * 20) + 30;
    const baseMessages = Math.floor(Math.random() * 50) + 100;
    
    for (let i = 0; i < 7; i++) {
      // Add some randomness but keep a trend
      const dayFactor = i === 5 || i === 6 ? 0.7 : 1.2; // Less activity on weekends
      const userVariation = Math.floor(Math.random() * 10) - 5;
      const messageVariation = Math.floor(Math.random() * 30) - 15;
      
      data.push({
        name: days[i],
        users: Math.max(0, Math.floor((baseUsers + userVariation) * dayFactor)),
        messages: Math.max(0, Math.floor((baseMessages + messageVariation) * dayFactor)),
      });
    }
    
    setUsageData(data);
  };

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      // Fetch user count
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (userError) throw userError;
      
      // Fetch message count
      const { count: messageCount, error: messageError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });
      
      if (messageError) throw messageError;
      
      // Fetch active users count (from user_presence)
      const { count: activeCount, error: activeError } = await supabase
        .from('user_presence')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', new Date(Date.now() - 15 * 60 * 1000).toISOString()); // Active in last 15 minutes
      
      if (activeError) throw activeError;
      
      // Calculate approximate storage used (this is a rough estimate)
      const storageSize = messageCount ? Math.round(messageCount * 0.01) : 0; // Rough estimate
      
      // Generate random trends for demo purposes
      const trends = ['up', 'down', 'stable'] as const;
      
      setStats({
        totalUsers: userCount || 0,
        totalMessages: messageCount || 0,
        activeUsers: activeCount || 0,
        storageUsed: `${storageSize} MB`,
        uptime: 99.9, // Hardcoded for demo
        usersTrend: trends[Math.floor(Math.random() * trends.length)],
        messagesTrend: trends[Math.floor(Math.random() * trends.length)],
        activeUsersTrend: trends[Math.floor(Math.random() * trends.length)]
      });
      
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchDashboardStats();
      generateUsageData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="text-green-400 h-4 w-4" />;
      case 'down':
        return <ArrowDown className="text-red-400 h-4 w-4" />;
      case 'stable':
        return <ArrowRight className="text-blue-400 h-4 w-4" />;
    }
  };

  const getTrendText = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <span className="text-green-400">Stigende</span>;
      case 'down':
        return <span className="text-red-400">Synkende</span>;
      case 'stable':
        return <span className="text-blue-400">Stabil</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-cyberdark-900 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Totalt antall brukere</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-cyberblue-400 mr-3" />
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                ) : (
                  <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                )}
              </div>
              <div className="flex items-center text-xs">
                {getTrendIcon(stats.usersTrend)}
                <span className="ml-1">{getTrendText(stats.usersTrend)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-cyberdark-900 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Aktive brukere</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-green-400 mr-3" />
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                ) : (
                  <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
                )}
              </div>
              <div className="flex items-center text-xs">
                {getTrendIcon(stats.activeUsersTrend)}
                <span className="ml-1">{getTrendText(stats.activeUsersTrend)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-cyberdark-900 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Totale meldinger</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-6 w-6 text-cyberblue-400 mr-3" />
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                ) : (
                  <div className="text-2xl font-bold text-white">{stats.totalMessages}</div>
                )}
              </div>
              <div className="flex items-center text-xs">
                {getTrendIcon(stats.messagesTrend)}
                <span className="ml-1">{getTrendText(stats.messagesTrend)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-cyberdark-900 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Administratorer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-cyberblue-400 mr-3" />
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : (
                <div className="text-2xl font-bold text-white">
                  {stats.totalUsers ? Math.max(1, Math.floor(stats.totalUsers * 0.1)) : 1}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Usage Chart */}
      <Card className="bg-cyberdark-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-cyberblue-300">Aktivitetsoversikt</CardTitle>
          <CardDescription>Siste 7 dagers aktivitet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-cyberblue-400" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={usageData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a9dff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1a9dff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d62828" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d62828" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}
                    itemStyle={{ color: '#ddd' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#1a9dff" 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                    name="Aktive brukere"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="messages" 
                    stroke="#d62828" 
                    fillOpacity={1} 
                    fill="url(#colorMessages)"
                    name="Meldinger sendt" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
