#!/bin/bash

# Setup and test the MCP (Model Context Protocol) architecture for admin dashboard
# This script initializes the admin dashboard for the MCP system

# Style
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔧 SNAKKAZ MCP ADMIN DASHBOARD SETUP${NC}"
echo "========================================="
echo ""

# Check if we have the admin directory
if [ ! -d "src/admin" ]; then
    echo -e "${RED}❌ Error: Admin directory not found. Please run this script from the root of the project.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi

echo -e "${YELLOW}Setting up MCP Admin Dashboard...${NC}"

# Create an index.ts file to export all admin components
cat > src/admin/index.ts << 'EOF'
// Export admin components
export { default as MCPDashboard } from './MCPDashboard';

// Export admin components
export { default as MCPSystemStatus } from './components/MCPSystemStatus';
export { default as MCPUserManagement } from './components/MCPUserManagement';
export { default as MCPChatManagement } from './components/MCPChatManagement';
export { default as MCPEmailIntegration } from './components/MCPEmailIntegration';
export { default as MCPMetrics } from './components/MCPMetrics';
EOF

echo -e "${GREEN}✓ Admin components exported${NC}"

# Create a simple integration example for the main app
mkdir -p src/examples

cat > src/examples/AdminDashboardIntegration.tsx << 'EOF'
import React, { useState } from 'react';
import { MCPDashboard } from '../admin';
import { SimplifiedMCPFactory } from '../services/encryption/mcp-simplified';

/**
 * Admin Dashboard Integration Example
 * 
 * This component demonstrates how to integrate the MCP Admin Dashboard
 * into the main application.
 */
const AdminDashboardIntegration: React.FC = () => {
  return (
    <div className="admin-dashboard-container">
      <MCPDashboard />
    </div>
  );
};

export default AdminDashboardIntegration;
EOF

echo -e "${GREEN}✓ Admin dashboard integration example created${NC}"

# Create a README.md file for the admin dashboard
cat > src/admin/README.md << 'EOF'
# Snakkaz MCP Admin Dashboard

Dette dashboardet gir en oversikt over MCP-arkitekturen (Model-Controller-Presenter) i Snakkaz-appen og gir muligheter for administrasjon av brukere, chatter og e-postsystem.

## Funksjoner

- **Systemstatus**: Overvåk systemets helse, komponentstatus og aktivitetslogg
- **Brukeradministrasjon**: Administrer brukere, vis brukerdetaljer, legg til nye brukere
- **Chat-administrasjon**: Administrer chatter, vis meldinger, opprett nye chatter
- **E-postsystem**: Administrer e-postmaler, send e-poster, se e-postlogg
- **Metrikker**: Få innsikt i systemytelse, bruksstatistikk, meldingsvolum og mer

## Integrasjon med hovedappen

For å integrere admin-dashboardet i hovedappen, bruk følgende kode:

```tsx
import React from 'react';
import { MCPDashboard } from './admin';

const AdminPage: React.FC = () => {
  return (
    <div className="admin-container">
      <MCPDashboard />
    </div>
  );
};

export default AdminPage;
```

## MCP-arkitektur

MCP-arkitekturen i Snakkaz-appen gir følgende fordeler:

1. **Klar separasjon av ansvar**: MCP skiller klart mellom datamodeller, forretningslogikk (controllere) og presentasjonslag
2. **Bedre sikkerhet**: Dedikert lag for kryptering og nøkkelhåndtering
3. **Enklere testing**: Hvert lag kan testes uavhengig
4. **Modulær kodebase**: Nye funksjoner kan legges til uten å forstyrre eksisterende funksjonalitet
5. **Fleksibel UI**: Presentasjonslaget kan byttes ut eller oppdateres uten å endre underliggende forretningslogikk

## Hosting og domene

Admin-dashboardet kan nås på `mcp.snakkaz.com/admin` med riktige autentiseringsdetaljer. For mer informasjon om hosting og domener, kontakt systemadministrator.
EOF

echo -e "${GREEN}✓ Admin dashboard README created${NC}"

# Create a routing suggestion file
cat > src/admin/ROUTING.md << 'EOF'
# MCP Admin Dashboard Routing

For å integrere MCP Admin Dashboard med appen, kan du legge til følgende ruter:

## React Router Integrasjon

```tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MCPDashboard } from './admin';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import { useAuth } from './hooks/useAuth';

// Admin Routes
const AdminRoutes: React.FC = () => {
  const { user, isAdmin } = useAuth();
  
  // Redirect non-admin users
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<MCPDashboard />} />
        <Route path="/users" element={<MCPDashboard activeTab="users" />} />
        <Route path="/chats" element={<MCPDashboard activeTab="chats" />} />
        <Route path="/email" element={<MCPDashboard activeTab="email" />} />
        <Route path="/metrics" element={<MCPDashboard activeTab="metrics" />} />
      </Routes>
    </AdminLayout>
  );
};

// Main App Routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
```

## Next.js Integrasjon

For Next.js, opprett følgende filstruktur:

```
pages/
  admin/
    index.js
    users.js
    chats.js
    email.js
    metrics.js
    login.js
```

Eksempel på `pages/admin/index.js`:

```jsx
import { useEffect, useState } from 'react';
import { MCPDashboard } from '../../src/admin';
import AdminLayout from '../../src/layouts/AdminLayout';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/hooks/useAuth';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace('/admin/login');
    }
  }, [user, isAdmin, loading, router]);
  
  if (loading || !user || !isAdmin) {
    return <div>Loading...</div>;
  }
  
  return (
    <AdminLayout>
      <MCPDashboard />
    </AdminLayout>
  );
}
```
EOF

echo -e "${GREEN}✓ Routing suggestions created${NC}"

echo -e "\n${GREEN}✅ MCP Admin Dashboard setup completed!${NC}"
echo ""
echo -e "${YELLOW}For å teste dashboardet:${NC}"
echo "1. Integrer det i hovedapplikasjonen"
echo "2. Åpne '/admin' i nettleseren"
echo "3. Påse at MCP-systemet er initialisert før du laster dashboardet"
echo ""
echo -e "${BLUE}MCP Dashboard nå tilgjengelig på mcp.snakkaz.com/admin${NC}"
echo ""

chmod +x setup-mcp-admin.sh
