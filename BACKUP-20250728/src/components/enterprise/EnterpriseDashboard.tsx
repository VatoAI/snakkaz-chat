import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Shield, 
  Database, 
  Users, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Globe,
  Lock,
  BarChart3,
  Zap
} from 'lucide-react';

import { TenantManagement } from './TenantManagement';
import { MultiTenantService } from '../../services/enterprise/MultiTenantService';
import { SecuritySuiteService } from '../../services/enterprise/SecuritySuiteService';
import { BIService } from '../../services/enterprise/BIService';
import { APIGatewayService } from '../../services/enterprise/APIGatewayService';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalIncidents: number;
  openIncidents: number;
  apiCalls: number;
  avgResponseTime: number;
  complianceScore: number;
  threatDetections: number;
}

export const EnterpriseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState<any>(null);

  const multiTenantService = MultiTenantService.getInstance();
  const securityService = SecuritySuiteService.getInstance();
  const biService = BIService.getInstance();
  const apiService = APIGatewayService.getInstance();

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time security monitoring
    securityService.startRealTimeMonitoring();

    return () => {
      securityService.stopRealTimeMonitoring();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current tenant
      const tenant = multiTenantService.getCurrentTenant();
      setCurrentTenant(tenant);

      if (!tenant) {
        console.warn('No active tenant found');
        return;
      }

      // Load all dashboard stats in parallel
      const [
        securityMetrics,
        biMetrics,
        gateways
      ] = await Promise.all([
        securityService.getSecurityMetrics(),
        biService.getEnterpriseMetrics(),
        apiService.listGateways()
      ]);

      // Calculate API metrics
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      let totalApiCalls = 0;
      let avgResponseTime = 0;
      
      if (gateways.length > 0) {
        const apiMetrics = await Promise.all(
          gateways.map(gateway => 
            apiService.getAPIMetrics(gateway.id, yesterday, now)
          )
        );
        
        totalApiCalls = apiMetrics.flat().reduce((sum, metric) => sum + metric.total_requests, 0);
        avgResponseTime = apiMetrics.flat().reduce((sum, metric) => sum + metric.average_response_time_ms, 0) / apiMetrics.flat().length || 0;
      }

      setStats({
        totalUsers: biMetrics.total_users || 0,
        activeUsers: biMetrics.active_users || 0,
        totalIncidents: securityMetrics.totalIncidents,
        openIncidents: securityMetrics.openIncidents,
        apiCalls: totalApiCalls,
        avgResponseTime: Math.round(avgResponseTime),
        complianceScore: securityMetrics.complianceScore,
        threatDetections: securityMetrics.threatsDetected,
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'tenants', label: 'Tenant Management', icon: Users },
    { id: 'security', label: 'Security Suite', icon: Shield },
    { id: 'analytics', label: 'Business Intelligence', icon: BarChart3 },
    { id: 'api', label: 'API Gateway', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            <span className="text-green-600">{stats?.activeUsers || 0}</span> active users
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Security Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalIncidents || 0}</p>
            </div>
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            <span className="text-red-600">{stats?.openIncidents || 0}</span> open incidents
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">API Calls (24h)</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.apiCalls?.toLocaleString() || 0}</p>
            </div>
            <Zap className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Avg response: {stats?.avgResponseTime || 0}ms
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.complianceScore || 0}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats?.threatDetections || 0} threats detected
          </p>
        </div>
      </div>

      {/* Current Tenant Info */}
      {currentTenant && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Tenant</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Organization</p>
              <p className="text-base text-gray-900">{currentTenant.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Domain</p>
              <p className="text-base text-gray-900">{currentTenant.domain}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentTenant.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {currentTenant.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Security Status</h3>
              <p className="text-sm text-gray-500">Monitor threats and incidents</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setActiveTab('security')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View Security Dashboard →
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-500">Business intelligence insights</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View Analytics →
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">API Management</h3>
              <p className="text-sm text-gray-500">Configure API gateways</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setActiveTab('api')}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Manage APIs →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySuite = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Suite</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">{stats?.openIncidents || 0}</p>
            <p className="text-xs text-gray-600">Open Incidents</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Shield className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">{stats?.threatDetections || 0}</p>
            <p className="text-xs text-gray-600">Threats Detected</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">{stats?.complianceScore || 0}%</p>
            <p className="text-xs text-gray-600">Compliance Score</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Active</p>
            <p className="text-xs text-gray-600">DLP Protection</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Intelligence</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border rounded-lg">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <Activity className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900">{stats?.activeUsers || 0}</p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900">{stats?.avgResponseTime || 0}ms</p>
            <p className="text-sm text-gray-600">Avg Response Time</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPIGateway = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Gateway</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">API Calls (24h)</h4>
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.apiCalls?.toLocaleString() || 0}</p>
            <p className="text-sm text-gray-600">Total requests</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Performance</h4>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.avgResponseTime || 0}ms</p>
            <p className="text-sm text-gray-600">Average response time</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Enterprise Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enterprise Dashboard</h1>
              <p className="text-sm text-gray-600">
                {currentTenant ? `Managing ${currentTenant.name}` : 'No active tenant'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                FASE 7 Enterprise Features
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'tenants' && <TenantManagement />}
        {activeTab === 'security' && renderSecuritySuite()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'api' && renderAPIGateway()}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enterprise Settings</h3>
            <p className="text-gray-600">Enterprise settings will be available in the next update.</p>
          </div>
        )}
      </div>
    </div>
  );
};
