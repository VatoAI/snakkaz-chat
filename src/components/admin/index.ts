/**
 * Index-fil for eksport av admin-relaterte komponenter
 * Forenkler imports ved å samle alle eksporter på ett sted
 * 
 * Uses dynamic imports for larger admin components to improve initial load time
 * Smaller components are imported directly
 */

// Direct exports for smaller components
export { AdminApiKeySection } from './AdminApiKeySection';
export { AdminLogoSection } from './AdminLogoSection';
export { AdminAuth } from './AdminAuth';

// Dynamic imports for larger components
export {
  AdminDashboard,
  ClientErrorReporting,
  AdminErrorLogs,
  AdminUsersManager,
  AdminSystemHealth,
  ExternalServicesStatus,
  preloadAdminComponents
} from './dynamic';