import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MCPControlPanel } from '@/components/admin/MCPControlPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Activity, 
  Zap, 
  Shield,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MCPDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/beta" className="snakkaz-btn snakkaz-btn-ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tilbake til Chat
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">MCP Dashboard</h1>
              <p className="text-gray-400">Model Context Protocol Administration</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <CheckCircle className="w-3 h-3 mr-1" />
              Production Ready
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="snakkaz-card p-4 text-center">
            <Server className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-sm text-gray-400">Active Servers</p>
          </div>
          
          <div className="snakkaz-card p-4 text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold text-white">4.4k</p>
            <p className="text-sm text-gray-400">Requests Today</p>
          </div>
          
          <div className="snakkaz-card p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <p className="text-2xl font-bold text-white">67ms</p>
            <p className="text-sm text-gray-400">Avg Response</p>
          </div>
          
          <div className="snakkaz-card p-4 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <p className="text-2xl font-bold text-white">99.9%</p>
            <p className="text-sm text-gray-400">Uptime</p>
          </div>
        </div>

        {/* Main Control Panel */}
        <MCPControlPanel />
        
      </div>
    </div>
  );
};

export default MCPDashboard;