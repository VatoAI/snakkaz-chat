/**
 * FASE 7 - Tenant Management Component
 * 
 * React component for managing multi-tenant configurations
 * Administrative interface for enterprise features
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  Settings, 
  Shield, 
  CreditCard, 
  Users, 
  Globe, 
  Palette,
  Clock,
  Bell,
  Key,
  BarChart3,
  Webhook,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { multiTenantService } from '@/services/enterprise/MultiTenantService';
import { TenantConfig, TenantStatus } from '@/types/enterprise';
import { useToast } from '@/hooks/use-toast';

interface TenantManagementProps {
  isAdmin?: boolean;
  tenantId?: string;
}

const TenantManagement: React.FC<TenantManagementProps> = ({ 
  isAdmin = false, 
  tenantId 
}) => {
  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        // Load all tenants for admin
        const response = await multiTenantService.listTenants();
        if (response.success && response.data) {
          setTenants(response.data.tenants);
          if (!selectedTenant && response.data.tenants.length > 0) {
            setSelectedTenant(response.data.tenants[0]);
          }
        }
      } else if (tenantId) {
        // Load specific tenant
        const response = await multiTenantService.getTenant(tenantId);
        if (response.success && response.data) {
          setTenants([response.data]);
          setSelectedTenant(response.data);
        }
      } else {
        // Load current tenant
        const currentTenant = multiTenantService.getCurrentTenant();
        if (currentTenant) {
          setTenants([currentTenant]);
          setSelectedTenant(currentTenant);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tenant information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTenantChanges = async (updates: Partial<TenantConfig>) => {
    if (!selectedTenant) return;

    setSaving(true);
    try {
      const response = await multiTenantService.updateTenant(selectedTenant.id, updates);
      
      if (response.success && response.data) {
        setSelectedTenant(response.data);
        // Update in tenants list
        setTenants(prev => prev.map(t => t.id === selectedTenant.id ? response.data! : t));
        
        toast({
          title: "Success",
          description: "Tenant settings updated successfully"
        });
      } else {
        throw new Error(response.error || 'Failed to update tenant');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update tenant",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: TenantStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trial': return 'bg-blue-500';
      case 'suspended': return 'bg-red-500';
      case 'expired': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: TenantStatus) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'trial': return <Clock className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tenant Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage multi-tenant configurations and enterprise features
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Tenant
          </Button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Tenant List */}
        {isAdmin && (
          <div className="col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Tenants
                </CardTitle>
                <CardDescription>
                  Select a tenant to manage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tenants.map((tenant) => (
                    <div
                      key={tenant.id}
                      onClick={() => setSelectedTenant(tenant)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTenant?.id === tenant.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{tenant.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tenant.domain}
                          </p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(tenant.status)} text-white`}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(tenant.status)}
                            {tenant.status}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tenant Details */}
        <div className={isAdmin ? "col-span-8" : "col-span-12"}>
          {selectedTenant ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="branding" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Branding
                </TabsTrigger>
                <TabsTrigger value="features" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Features
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Billing
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Users
                </TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <GeneralSettings 
                  tenant={selectedTenant} 
                  onSave={saveTenantChanges}
                  saving={saving}
                />
              </TabsContent>

              {/* Branding Settings */}
              <TabsContent value="branding" className="space-y-6">
                <BrandingSettings 
                  tenant={selectedTenant} 
                  onSave={saveTenantChanges}
                  saving={saving}
                />
              </TabsContent>

              {/* Features Settings */}
              <TabsContent value="features" className="space-y-6">
                <FeaturesSettings 
                  tenant={selectedTenant} 
                  onSave={saveTenantChanges}
                  saving={saving}
                />
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <SecuritySettings 
                  tenant={selectedTenant} 
                  onSave={saveTenantChanges}
                  saving={saving}
                />
              </TabsContent>

              {/* Billing Settings */}
              <TabsContent value="billing" className="space-y-6">
                <BillingSettings 
                  tenant={selectedTenant} 
                  onSave={saveTenantChanges}
                  saving={saving}
                />
              </TabsContent>

              {/* Users Management */}
              <TabsContent value="users" className="space-y-6">
                <UsersManagement 
                  tenant={selectedTenant}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a tenant to view details
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-components for each settings tab
const GeneralSettings: React.FC<{
  tenant: TenantConfig;
  onSave: (updates: Partial<TenantConfig>) => void;
  saving: boolean;
}> = ({ tenant, onSave, saving }) => {
  const [formData, setFormData] = useState({
    name: tenant.name,
    domain: tenant.domain,
    subdomain: tenant.subdomain,
    company_name: tenant.branding.company_name,
    support_email: tenant.branding.support_email,
    timezone: tenant.settings.timezone,
    language: tenant.settings.language,
    currency: tenant.settings.currency
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      domain: formData.domain,
      subdomain: formData.subdomain,
      branding: {
        ...tenant.branding,
        company_name: formData.company_name,
        support_email: formData.support_email
      },
      settings: {
        ...tenant.settings,
        timezone: formData.timezone,
        language: formData.language,
        currency: formData.currency
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Basic tenant information and configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tenant Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="subdomain">Subdomain</Label>
              <Input
                id="subdomain"
                value={formData.subdomain}
                onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="support_email">Support Email</Label>
            <Input
              id="support_email"
              type="email"
              value={formData.support_email}
              onChange={(e) => setFormData(prev => ({ ...prev, support_email: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Europe/Oslo">Europe/Oslo</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="no">Norwegian</option>
                <option value="en">English</option>
                <option value="da">Danish</option>
                <option value="sv">Swedish</option>
              </select>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NOK">NOK</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const BrandingSettings: React.FC<{
  tenant: TenantConfig;
  onSave: (updates: Partial<TenantConfig>) => void;
  saving: boolean;
}> = ({ tenant, onSave, saving }) => {
  const [formData, setFormData] = useState({
    primary_color: tenant.branding.primary_color,
    secondary_color: tenant.branding.secondary_color,
    accent_color: tenant.branding.accent_color,
    theme: tenant.branding.theme,
    logo_url: tenant.branding.logo_url || '',
    favicon_url: tenant.branding.favicon_url || '',
    custom_css: tenant.branding.custom_css || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      branding: {
        ...tenant.branding,
        ...formData
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding Settings</CardTitle>
        <CardDescription>
          Customize the appearance and branding of your tenant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary_color"
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secondary_color"
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.secondary_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="accent_color">Accent Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="accent_color"
                  type="color"
                  value={formData.accent_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, accent_color: e.target.value }))}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.accent_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, accent_color: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              value={formData.theme}
              onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="auto">Auto</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <Label htmlFor="favicon_url">Favicon URL</Label>
              <Input
                id="favicon_url"
                value={formData.favicon_url}
                onChange={(e) => setFormData(prev => ({ ...prev, favicon_url: e.target.value }))}
                placeholder="https://example.com/favicon.ico"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="custom_css">Custom CSS</Label>
            <textarea
              id="custom_css"
              value={formData.custom_css}
              onChange={(e) => setFormData(prev => ({ ...prev, custom_css: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="/* Custom CSS rules */"
            />
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Branding'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const FeaturesSettings: React.FC<{
  tenant: TenantConfig;
  onSave: (updates: Partial<TenantConfig>) => void;
  saving: boolean;
}> = ({ tenant, onSave, saving }) => {
  const [features, setFeatures] = useState(tenant.features);
  const [quotas, setQuotas] = useState(tenant.quotas);

  const handleFeatureToggle = (feature: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const handleQuotaChange = (quota: keyof typeof quotas, value: number) => {
    setQuotas(prev => ({ ...prev, [quota]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ features, quotas });
  };

  const featuresList = [
    { key: 'sso_enabled', label: 'Single Sign-On (SSO)', description: 'Enable SAML, OAuth2, and LDAP authentication' },
    { key: 'api_access', label: 'API Access', description: 'REST API and GraphQL access for integrations' },
    { key: 'advanced_analytics', label: 'Advanced Analytics', description: 'Detailed usage analytics and reporting' },
    { key: 'custom_integrations', label: 'Custom Integrations', description: 'Build custom integrations and workflows' },
    { key: 'white_label', label: 'White Label', description: 'Remove SnakkaZ branding and use custom branding' },
    { key: 'priority_support', label: 'Priority Support', description: '24/7 priority customer support' },
    { key: 'custom_domains', label: 'Custom Domains', description: 'Use your own domain name' },
    { key: 'advanced_security', label: 'Advanced Security', description: 'Enhanced security features and compliance' },
    { key: 'compliance_tools', label: 'Compliance Tools', description: 'GDPR, HIPAA, SOX compliance features' },
    { key: 'custom_workflows', label: 'Custom Workflows', description: 'Build custom automation workflows' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features & Quotas</CardTitle>
        <CardDescription>
          Configure available features and resource quotas for this tenant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feature Toggles */}
          <div>
            <h3 className="text-lg font-medium mb-4">Features</h3>
            <div className="space-y-4">
              {featuresList.map((feature) => (
                <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{feature.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                  <Switch
                    checked={features[feature.key as keyof typeof features]}
                    onCheckedChange={() => handleFeatureToggle(feature.key as keyof typeof features)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Resource Quotas */}
          <div>
            <h3 className="text-lg font-medium mb-4">Resource Quotas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_users">Maximum Users</Label>
                <Input
                  id="max_users"
                  type="number"
                  value={quotas.max_users}
                  onChange={(e) => handleQuotaChange('max_users', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="max_storage_gb">Storage Limit (GB)</Label>
                <Input
                  id="max_storage_gb"
                  type="number"
                  value={quotas.max_storage_gb}
                  onChange={(e) => handleQuotaChange('max_storage_gb', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="max_api_requests_per_month">API Requests/Month</Label>
                <Input
                  id="max_api_requests_per_month"
                  type="number"
                  value={quotas.max_api_requests_per_month}
                  onChange={(e) => handleQuotaChange('max_api_requests_per_month', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="max_groups">Maximum Groups</Label>
                <Input
                  id="max_groups"
                  type="number"
                  value={quotas.max_groups}
                  onChange={(e) => handleQuotaChange('max_groups', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="max_integrations">Maximum Integrations</Label>
                <Input
                  id="max_integrations"
                  type="number"
                  value={quotas.max_integrations}
                  onChange={(e) => handleQuotaChange('max_integrations', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="retention_days">Data Retention (Days)</Label>
                <Input
                  id="retention_days"
                  type="number"
                  value={quotas.retention_days}
                  onChange={(e) => handleQuotaChange('retention_days', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Features & Quotas'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const SecuritySettings: React.FC<{
  tenant: TenantConfig;
  onSave: (updates: Partial<TenantConfig>) => void;
  saving: boolean;
}> = ({ tenant, onSave, saving }) => {
  const [securitySettings, setSecuritySettings] = useState(tenant.settings.security_settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      settings: {
        ...tenant.settings,
        security_settings: securitySettings
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Configure security policies and access controls
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Enforce Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Require all users to enable 2FA
              </p>
            </div>
            <Switch
              checked={securitySettings.enforce_2fa}
              onCheckedChange={(checked) => 
                setSecuritySettings(prev => ({ ...prev, enforce_2fa: checked }))
              }
            />
          </div>

          {/* Session Timeout */}
          <div>
            <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
            <Input
              id="session_timeout"
              type="number"
              value={securitySettings.session_timeout_minutes}
              onChange={(e) => 
                setSecuritySettings(prev => ({ 
                  ...prev, 
                  session_timeout_minutes: parseInt(e.target.value) 
                }))
              }
            />
          </div>

          {/* Password Policy */}
          <div>
            <h3 className="text-lg font-medium mb-4">Password Policy</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="min_length">Minimum Length</Label>
                <Input
                  id="min_length"
                  type="number"
                  value={securitySettings.password_policy.min_length}
                  onChange={(e) => 
                    setSecuritySettings(prev => ({ 
                      ...prev, 
                      password_policy: {
                        ...prev.password_policy,
                        min_length: parseInt(e.target.value)
                      }
                    }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                {[
                  { key: 'require_uppercase', label: 'Require Uppercase Letters' },
                  { key: 'require_lowercase', label: 'Require Lowercase Letters' },
                  { key: 'require_numbers', label: 'Require Numbers' },
                  { key: 'require_symbols', label: 'Require Symbols' }
                ].map((requirement) => (
                  <div key={requirement.key} className="flex items-center justify-between">
                    <Label>{requirement.label}</Label>
                    <Switch
                      checked={securitySettings.password_policy[requirement.key as keyof typeof securitySettings.password_policy] as boolean}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({ 
                          ...prev, 
                          password_policy: {
                            ...prev.password_policy,
                            [requirement.key]: checked
                          }
                        }))
                      }
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="max_age_days">Password Max Age (days)</Label>
                <Input
                  id="max_age_days"
                  type="number"
                  value={securitySettings.password_policy.max_age_days}
                  onChange={(e) => 
                    setSecuritySettings(prev => ({ 
                      ...prev, 
                      password_policy: {
                        ...prev.password_policy,
                        max_age_days: parseInt(e.target.value)
                      }
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Security Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const BillingSettings: React.FC<{
  tenant: TenantConfig;
  onSave: (updates: Partial<TenantConfig>) => void;
  saving: boolean;
}> = ({ tenant, onSave, saving }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>
          Current subscription and billing details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Current Plan</Label>
              <p className="font-medium">{tenant.billing.plan_name}</p>
            </div>
            <div>
              <Label>Billing Cycle</Label>
              <p className="font-medium">{tenant.billing.billing_cycle}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Amount</Label>
              <p className="font-medium">
                {tenant.billing.amount} {tenant.billing.currency}
              </p>
            </div>
            <div>
              <Label>Next Billing Date</Label>
              <p className="font-medium">{tenant.billing.next_billing_date || 'N/A'}</p>
            </div>
          </div>

          <div>
            <Label>Billing Email</Label>
            <p className="font-medium">{tenant.billing.billing_email}</p>
          </div>

          {tenant.billing.trial_ends_at && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Trial ends on {new Date(tenant.billing.trial_ends_at).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )}

          <Button className="w-full">
            Manage Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const UsersManagement: React.FC<{
  tenant: TenantConfig;
}> = ({ tenant }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <CardDescription>
          Manage users and access for this tenant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Active Users</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {/* This would be populated from actual user data */}
                12 of {tenant.quotas.max_users} users
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-center text-gray-600 dark:text-gray-400">
              User management interface will be implemented here
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantManagement;
