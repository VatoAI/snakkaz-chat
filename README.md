# SNAKKAZ CHAT
## Advanced End-to-End Encrypted Messaging Platform

## 🚀 Build Status

✅ **PRODUCTION READY** - Build successful (13.21s)
- All EventEmitter compatibility issues resolved
- All react-icons imports migrated to lucide-react  
- Zero build errors or warnings
- Optimized bundle size: ~1.6MB (compressed: ~420KB)

Snakkaz Chat is a secure, feature-rich chat application with robust end-to-end encryption, built using React, TypeScript, and Supabase. The platform offers multiple chat types (global, private, group), custom emojis, pin functionality, and AI-powered memory system, all protected with state-of-the-art encryption.

### Key Features
- 🔒 **Enhanced End-to-End Encryption (E2EE)**: 
  - AES-GCM 256-bit encryption for all messages
  - Support for both peer-to-peer and group encryption
  - Secure key generation and management
  - Comprehensive encryption metrics and monitoring
- 🌐 **MCP WebRTC Integration**:
  - Reliable message delivery with automatic fallback mechanisms
  - Optimized for low-latency communication
  - Seamless integration with encryption for maximum security
- 💬 **Multiple Chat Types**: Global, private, and group chats with role-based permissions
- 📌 **Pin System**: Pin important messages across all chat types
- 😀 **Custom Emoji System**: User-defined emojis and reactions
- 🧠 **Memory System**: AI agent integration with full admin oversight
- 📱 **Responsive Design**: Works seamlessly across all device sizes
- 🧪 **Comprehensive Testing**: Automated test utilities for encryption verification

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Shadcn UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Row-Level Security, Realtime)
- **AI Integration**: Python MCP Server, Vector embeddings with pgvector
- **Security**: E2EE, PBKDF2, Content Security Policy, Rate limiting
- **Infrastructure**: Cloudflare CDN, GitHub Actions for CI/CD
- **Real-time Communication**: WebRTC with PeerJS, MCP (Model Context Protocol)
- **Encryption**: AES-GCM 256-bit, Web Crypto API

### Technical Implementation

#### End-to-End Encryption
- **Peer-to-Peer Encryption**: Secure key exchange and message encryption between two users
- **Group Encryption**: Secure distribution of group keys and encrypted group messaging
- **Key Management**: Generation, storage, and rotation of encryption keys
- **Browser Storage**: Secure storage of keys in IndexedDB
- **Cross-Device Support**: Key export/import functionality for multi-device usage

#### WebRTC + MCP Integration
- **Primary Communication**: WebRTC for direct, encrypted peer connections
- **Fallback Mechanism**: MCP for reliable message delivery when WebRTC fails
- **Connection Management**: Automatic detection and recovery from connection issues
- **Metrics Collection**: Performance and reliability metrics for both channels

---

## 🎯 QUICK START - ESSENTIAL OPERATIONS

### **Daily Workflow Commands**
```bash
# Use the systematic operations script for all common tasks
./snakkaz help          # Show all available operations
./snakkaz sync          # Daily git sync (pull, commit, push)
./snakkaz dev           # Start development environment
./snakkaz build         # Create production build
./snakkaz deploy        # Deploy to production
./snakkaz status        # Check project and deployment status
```

### **Emergency Procedures**
```bash
./snakkaz emergency     # Emergency deployment
./snakkaz fix           # Quick fix deployment
./snakkaz monitor       # Monitor live site health
```

---

## 📋 COMPLETE DOCUMENTATION STRUCTURE

### **🏗️ ARCHITECTURE & DESIGN**
- [`docs/architecture/SNAKKAZ-MASTER-PROMPT.md`](docs/architecture/SNAKKAZ-MASTER-PROMPT.md) - Complete system architecture
- [`SNAKKAZ-99-PERCENT-COMPLETE-OVERVIEW-AND-RESTRUCTURING.md`](SNAKKAZ-99-PERCENT-COMPLETE-OVERVIEW-AND-RESTRUCTURING.md) - Comprehensive project analysis
- [`SNAKKAZ-COMPLETE-APPLICATION-DOCUMENTATION.md`](SNAKKAZ-COMPLETE-APPLICATION-DOCUMENTATION.md) - Application feature documentation

### **🚀 DEPLOYMENT & OPERATIONS**
- [`docs/deployment/`](docs/deployment/) - Deployment guides and procedures
- [`.github/workflows/`](.github/workflows/) - GitHub Actions workflows
- [`scripts/deployment/`](scripts/deployment/) - Deployment scripts
- [`bin/`](bin/) - Quick access deployment shortcuts

### **💻 DEVELOPMENT GUIDES**
- [`docs/development/`](docs/development/) - Development documentation
- [`scripts/development/`](scripts/development/) - Development utility scripts
- [`docs/features/`](docs/features/) - Feature-specific documentation

### **📊 CURRENT STATUS & REPORTS**
- [`docs/current-status/`](docs/current-status/) - All status reports and planning documents
- [`tools/archived/`](tools/archived/) - Archived emergency resolution files
- [`FINAL-EMERGENCY-RESOLUTION-STATUS.md`](FINAL-EMERGENCY-RESOLUTION-STATUS.md) - Latest emergency resolution

### **🛠️ TROUBLESHOOTING & SUPPORT**
- [`docs/troubleshooting/`](docs/troubleshooting/) - Error resolution guides

### **🔒 ENCRYPTION & SECURITY**
- [`docs/E2EE-UPDATES.md`](docs/E2EE-UPDATES.md) - Latest encryption features and implementation details
- [`ENCRYPTION-STATUS-REPORT.md`](ENCRYPTION-STATUS-REPORT.md) - Current status of encryption implementation
- [`src/utils/crypto/e2ee.ts`](src/utils/crypto/e2ee.ts) - Core encryption implementation
- [`src/tests/e2ee-test.ts`](src/tests/e2ee-test.ts) - E2EE test suite

### **🧪 TESTING**
- [`test-e2ee.sh`](test-e2ee.sh) - Bash script for automated E2EE testing
- [`src/pages/E2EETestPage.tsx`](src/pages/E2EETestPage.tsx) - Browser-based encryption test interface
- [`scripts/verification/`](scripts/verification/) - Verification and testing scripts

---

## 🗂️ PROJECT STRUCTURE OVERVIEW

### **Core Application**
```
src/                           # Main React TypeScript application
├── components/                # 50+ reusable UI components
├── features/                  # Feature-specific modules (chat, auth, groups)
├── pages/                     # Route components
├── services/                  # Business logic & API integrations
├── hooks/                     # Custom React hooks
└── utils/                     # Helper functions and utilities
```

### **Infrastructure & Configuration**
```
.github/workflows/             # 8 GitHub Actions workflows
.devcontainer/                 # VS Code development container config
supabase/                      # Supabase backend configuration
database/                      # SQL schemas and migrations
security/                      # Encryption and security configurations
```

### **Build & Distribution**
```
dist/                          # Production build output (124 JS bundles)
public/                        # Static assets and files
node_modules/                  # Dependencies (90+ packages)
package.json                   # Project configuration and scripts
```

---

## 🎮 DEVELOPMENT WORKFLOWS

### **Feature Development Workflow**
1. **Start Development**: `./snakkaz dev`
2. **Make Changes**: Edit files in `src/`
3. **Test Build**: `./snakkaz build`
4. **Check Quality**: `./snakkaz lint`
5. **Deploy**: `./snakkaz deploy`

### **Git Management Workflow**
1. **Sync Repository**: `./snakkaz sync`
2. **Check Status**: `./snakkaz status`
3. **View History**: `./snakkaz logs`
4. **Emergency Deploy**: `./snakkaz emergency`

### **Production Maintenance**
1. **Monitor Site**: `./snakkaz monitor`
2. **Check Deployment**: Visit [GitHub Actions](https://github.com/VatoAI/snakkaz-chat/actions)
3. **Verify Live Site**: https://www.snakkaz.com
4. **Review Logs**: `./snakkaz logs`

---

## 🚀 DEPLOYMENT STRATEGIES

### **Primary Deployment: GitHub Actions + FTP**
- **Trigger**: Push to `main` branch
- **Workflow**: `.github/workflows/deploy-corrected-ftp.yml`
- **Target**: `ftp.snakkaz.com` → `www.snakkaz.com`
- **Status**: ✅ **OPERATIONAL**

### **Backup Deployments**
- **Direct FTP**: Manual upload via LFTP/curl
- **Cloudflare Pages**: Secondary hosting option
- **Emergency Scripts**: Direct deployment bypassing CI/CD

### **Monitoring & Verification**
- **Live Site**: https://www.snakkaz.com
- **GitHub Actions**: Monitor deployment progress
- **FTP Status**: Verify file uploads
- **Performance**: Monitor bundle loading

---

## 🛡️ SECURITY & COMPLIANCE

### **Authentication & Authorization**
- **Multi-factor Authentication**: TOTP + Email verification
- **Role-based Access**: Admin, Premium, Standard users
- **Session Management**: Secure token handling
- **Password Security**: Argon2 hashing

### **Data Protection**
- **End-to-End Encryption**: Message encryption
- **Data Privacy**: Norwegian GDPR compliance
- **Secure Storage**: Supabase with row-level security
- **Content Security**: CSP headers + DOMPurify

### **Infrastructure Security**
- **Cloudflare Protection**: DDoS protection + WAF
- **HTTPS Enforcement**: SSL/TLS certificates
- **API Security**: Rate limiting and validation
- **Code Security**: Dependency scanning

---

## 🇳🇴 NORWEGIAN TECH COMMUNITY FEATURES

### **Language & Localization**
- **Primary Language**: Norwegian (Bokmål)
- **UI Elements**: Norwegian terminology
- **Error Messages**: Norwegian translations
- **Documentation**: Bilingual (Norwegian/English)

### **Community-Focused Features**
- **Group Chat**: Norwegian tech groups
- **File Sharing**: Document collaboration
- **Event Planning**: Community meetups
- **Knowledge Sharing**: Technical discussions

### **Cyberpunk Aesthetic**
- **Color Scheme**: Blue/Gold cyberpunk theme
- **Typography**: Modern tech styling
- **Animations**: Smooth Framer Motion effects
- **Mobile-First**: Responsive Norwegian UX

---

## 📈 PERFORMANCE & OPTIMIZATION

### **Current Performance Metrics**
- **Bundle Count**: 124 JS files (optimizing to ~20)
- **Main Bundle**: 23KB (excellent)
- **Vendor Bundle**: 66KB (good)
- **Load Time**: <3 seconds
- **Mobile Performance**: 85/100

### **Optimization Targets**
- **Bundle Reduction**: Implement advanced code splitting
- **Lazy Loading**: Feature-based lazy loading
- **Caching Strategy**: Enhanced service worker
- **Image Optimization**: WebP conversion
- **Database Optimization**: Query performance tuning

---

## 🔧 TROUBLESHOOTING QUICK REFERENCE

### **Common Issues & Solutions**
```bash
# Site down or errors
./snakkaz emergency

# Build fails
./snakkaz clean && ./snakkaz install && ./snakkaz build

# Git issues
git reset --hard origin/main && ./snakkaz sync

# Development server issues
./snakkaz clean && ./snakkaz dev

# Bundle deployment issues
./MASS-VENDOR-UPLOAD.sh
```

### **Emergency Contacts & Resources**
- **Repository**: https://github.com/VatoAI/snakkaz-chat
- **Live Site**: https://www.snakkaz.com
- **Documentation**: This index and linked documents
- **Status Page**: Check GitHub Actions for deployment status

---

## 📝 CONTRIBUTING & DEVELOPMENT

### **Code Standards**
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Git Conventions**: Conventional commit messages

### **Pull Request Process**
1. Create feature branch
2. Make changes with tests
3. Run `./snakkaz lint` and `./snakkaz build`
4. Submit pull request with description
5. Code review and merge

### **Documentation Updates**
- Update relevant `.md` files
- Update this index if structure changes
- Include Norwegian translations when applicable
- Test all documented procedures

---

*Last Updated: June 8, 2025*  
*Status: 99% Complete - Production Ready*  
*Norwegian Tech Community: ✅ Ready for Growth*
