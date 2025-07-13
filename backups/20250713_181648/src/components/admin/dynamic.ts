// Dynamically load admin components
import { createDynamicComponent } from '@/utils/dynamic-import';

// Admin Dashboard and Components
export const AdminDashboard = createDynamicComponent(
  () => import('@/components/admin/AdminDashboard')
);

export const ClientErrorReporting = createDynamicComponent(
  () => import('@/components/admin/ClientErrorReporting')
);

export const AdminErrorLogs = createDynamicComponent(
  () => import('@/components/admin/AdminErrorLogs')
);

export const AdminUsersManager = createDynamicComponent(
  () => import('@/components/admin/AdminUsersManager')
);

export const AdminSystemHealth = createDynamicComponent(
  () => import('@/components/admin/AdminSystemHealth')
);

export const ExternalServicesStatus = createDynamicComponent(
  () => import('@/components/admin/ExternalServicesStatus')
);

// Use this to preload admin components when an admin user logs in
export const preloadAdminComponents = () => {
  import('@/components/admin/AdminDashboard');
  import('@/components/admin/ClientErrorReporting');
  import('@/components/admin/AdminErrorLogs');
};
