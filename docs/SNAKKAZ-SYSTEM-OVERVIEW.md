# Snakkaz Chat - System Overview

## 1. Deployment Infrastructure

### Current Status
- **Live Site**: www.snakkaz.com
- **Backend**: Supabase (PostgreSQL)
- **Deployment Method**: FTP to cPanel hosting, GitHub Actions pipeline
- **Current Issues**: Deployment pipeline inconsistencies, manual extraction required

### Deployment Process
1. Build produced via `npm run build`
2. ZIP file created with dist contents
3. Uploaded via FTP to snakkaz.com
4. Extracted manually or via cPanel API
5. Verified via `deployment-status-check.sh`

### Environment Configuration
- FTP credentials need to be stored in `.env` file
- Supabase connection details configured properly
- API keys for AI services secured appropriately

## 2. Core System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: Context API, hooks
- **UI Components**: Custom components with Shadcn UI 

### Backend
- **Primary Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT
- **Storage**: Supabase Storage
- **API Layer**: Supabase Functions, REST APIs
- **MCP Server**: Python FastAPI server for memory system

### Security
- **Encryption**: End-to-End Encryption (E2EE) for chat messages
- **Auth**: Email/password, OAuth providers, Two-Factor Authentication
- **Data Protection**: Row-level security in Supabase

## 3. Feature Analysis

### Chat System
- Global chat room
- Private 1:1 conversations
- Group chats with permissions
- Message pinning
- Custom emoji reactions
- End-to-end encrypted messages

### Memory System
- AI agent integration
- Context-aware responses
- Admin oversight dashboard
- Memory storage and retrieval
- Model switching capability

### User Management
- User profiles with customization
- Friend system
- Presence indicators
- Role-based permissions
- Admin controls

## 4. Integration Points

### External Services
- **Supabase**: Database, auth, storage
- **Namecheap**: Domain registration
- **cPanel**: Web hosting
- **Cloudflare**: CDN, security
- **SiteLock**: Additional security scanning
- **AI Providers**: OpenAI, Anthropic for memory system

### APIs
- REST APIs for chat functionality
- WebSockets for real-time updates
- Memory Context Protocol (MCP) API for AI integration

## 5. Security Assessment

### Strengths
- End-to-end encryption for messages
- Two-factor authentication support
- Row-level security in database
- CORS protection
- Rate limiting implemented

### Areas for Improvement
- Remove source maps from production build
- Implement Content-Security-Policy headers
- Enhance HTTPS configuration with HSTS
- Review Google storage security settings
- Implement regular security scanning

## 6. Critical System Dependencies

### Required for Operation
- Supabase project and connection
- Web hosting (cPanel)
- DNS configuration
- AI API keys (if memory system is used)

### Optional Components
- Cloudflare CDN (performance enhancement)
- SiteLock (additional security)
- Python environment (for memory system)

## 7. Cleanup Recommendations

### Immediate
- Remove unused ZIP files from project
- Complete FTP and cPanel API configuration
- Configure proper security headers
- Remove source maps from production build

### Short-term
- Clean up emergency scripts and consolidate
- Document all third-party dependencies
- Remove deprecated code paths
- Improve project structure organization

### Long-term
- Move to containerized deployment
- Implement CI/CD test automation
- Create comprehensive monitoring system
- Develop disaster recovery plan

## 8. Operational Guidelines

### Regular Maintenance
- Run `./snakkaz check` daily
- Verify database backup integrity weekly
- Update dependencies monthly or when security patches available
- Monitor error logs for unusual patterns

### Deployment Process
1. Run `./snakkaz build` to create production build
2. Run `./scripts/deploy-automated.sh` for automatic deployment
3. Run `./scripts/deployment-status-check.sh` to verify
4. Test core functionality on live site

### Emergency Response
1. Enable maintenance mode with `./snakkaz emergency`
2. Identify issue with diagnostic scripts
3. Apply fix and test thoroughly
4. Disable maintenance mode when resolved
5. Document incident and solution

## 9. System Health Monitoring

### Key Metrics
- Server response time
- Database query performance
- API error rates
- Memory system response accuracy
- User authentication success rate

### Monitoring Tools
- `./scripts/deployment-status-check.sh` - General system status
- `./scripts/monitor-memory-system.sh` - Memory system specific
- Supabase dashboard - Database performance
- Error logging system - Exception tracking

## 10. Documentation

### Critical Documentation
- Implementation Plan: `/docs/SNAKKAZ-IMPLEMENTATION-PLAN.md`
- System Architecture: `/docs/architecture/`
- API Documentation: `/docs/api/`
- Security Guidelines: `/docs/security/`

### Onboarding Materials
- Setup Guide: Configure local development environment
- Testing Guide: How to run and write tests
- Contribution Guidelines: Code standards and PR process
- Troubleshooting Guide: Common issues and solutions

---

This overview provides a comprehensive understanding of the Snakkaz Chat system, its components, dependencies, and maintenance requirements. Use this document as a reference for system management, optimization, and future development planning.
