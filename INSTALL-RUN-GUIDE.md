# **SnakkaZ Beta - Install/Run Guide**

## **🚀 Quick Start (90 seconds)**

```bash
# 1. Clone og enter project
git clone <repository-url> snakkaz-chat
cd snakkaz-chat

# 2. Install dependencies 
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Automatically opens at: http://localhost:5173
```

## **📋 System Requirements**

- **Node.js**: v18+ (Recommended: v20+)
- **npm**: v8+ eller **yarn**: v1.22+
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)

## **🔧 Development Setup**

### **Prerequisites Check**
```bash
# Check Node.js version
node --version  # Should show v18.0.0 or higher

# Check npm version  
npm --version   # Should show 8.0.0 or higher

# Check Git
git --version   # Any recent version
```

### **Environment Configuration**
```bash
# Create environment file
cp .env.example .env.local

# Edit environment variables (required)
nano .env.local
```

**Required Environment Variables:**
```env
# Supabase Configuration (for auth & database)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Settings
VITE_APP_NAME=SnakkaZ Beta
VITE_APP_VERSION=1.0.0-beta
VITE_ENVIRONMENT=development

# Security Settings (recommended)
VITE_ENABLE_PWA=true
VITE_ENABLE_E2EE=true
```

### **Package Installation**
```bash
# Clean install (recommended)
rm -rf node_modules package-lock.json
npm install

# Alternative with Yarn
yarn install --frozen-lockfile
```

## **🎯 Available Scripts**

| Script | Purpose | Usage |
|--------|---------|-------|
| `npm run dev` | Start development server | Development |
| `npm run build` | Build for production | Deployment prep |
| `npm run preview` | Preview production build | Testing |
| `npm run type-check` | TypeScript validation | Code quality |
| `npm run lint` | ESLint code analysis | Code quality |
| `npm run test` | Run test suite | Testing |

## **🏗️ Project Structure**

```
snakkaz-chat/
├── public/              # Static assets
│   ├── favicon.ico
│   └── pwa-icons/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── store/          # State management
│   ├── styles/         # CSS design system
│   │   ├── foundation/      # Base styles
│   │   ├── design-system/   # Component styles  
│   │   └── application/     # Layout styles
│   └── types/          # TypeScript definitions
├── backups/            # Version backups
└── scripts/            # Deployment scripts
```

## **🎨 Design System Architecture**

### **CSS Layer Structure**
```css
/* Import order (critical for liquid glass effect) */
1. foundation/security.css   # CSP-safe variables
2. foundation/reset.css      # Cross-browser reset
3. design-system/liquid-glass.css  # Core glassmorphism
4. design-system/components.css    # UI components
5. application/layout.css    # Page layouts
```

### **Component Usage**
```tsx
// Use pre-built liquid glass components
<div className="snakkaz-card">
  <h2 className="snakkaz-feature-title">Feature Title</h2>
  <p className="snakkaz-feature-description">Description</p>
</div>

// Button variants
<button className="snakkaz-button primary">Primary</button>
<button className="snakkaz-button gold">Gold Accent</button>
```

## **🔒 Security Features**

- **Content Security Policy (CSP)**: Prevents XSS attacks
- **End-to-End Encryption (E2EE)**: Message privacy
- **Progressive Web App (PWA)**: Offline security
- **IndexedDB**: Secure local storage
- **Supabase Auth**: Enterprise-grade authentication

## **📱 Development Workflow**

### **Local Development**
```bash
# Start with hot reload
npm run dev

# Open in browser
http://localhost:5173

# Check design system
http://localhost:5173/info  # Feature showcase
```

### **Code Quality**
```bash
# TypeScript check
npm run type-check

# Linting
npm run lint
npm run lint --fix  # Auto-fix issues

# Testing
npm run test
npm run test --coverage  # With coverage report
```

### **Production Build**
```bash
# Build optimized version
npm run build

# Preview build locally
npm run preview
http://localhost:4173
```

## **🚢 Deployment Options**

### **Option 1: Automated (Recommended)**
```bash
# Run automated deployment script
./scripts/AUTOMATIC-DEPLOY-LFTP.sh
```

### **Option 2: Manual cPanel Upload**
1. Run `npm run build`
2. Upload `dist/` folder contents to `public_html/`
3. Configure environment variables in cPanel

### **Option 3: Netlify/Vercel**
```bash
# Build command: npm run build
# Publish directory: dist
# Environment variables: Add in dashboard
```

## **🐛 Troubleshooting**

### **Common Issues**

**Design not loading correctly:**
```bash
# Clear browser cache
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (macOS)

# Restart dev server
npm run dev
```

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .vite
npm install
npm run dev
```

**TypeScript errors:**
```bash
# Type check
npm run type-check

# Update dependencies
npm update
```

**Performance issues:**
- Check CSS import order in `src/index.css`
- Verify CSP settings are not in conflict
- Use browser DevTools → Performance tab

### **Browser Requirements**
- **Chrome 90+**: Full support
- **Firefox 88+**: Full support  
- **Safari 14+**: Partial backdrop-filter support
- **Edge 90+**: Full support

## **📞 Support & Resources**

- **Documentation**: `/docs` folder
- **Issue Reporting**: GitHub Issues
- **Performance**: Chrome DevTools → Lighthouse
- **Design System**: `/src/styles/README.md`

## **⚡ Performance Optimization**

### **Development**
- Use `npm run dev` for hot reload
- Enable React DevTools extension
- Monitor Network tab for asset loading

### **Production**
- Lazy load routes with React.lazy()
- Optimize images in `/public`
- Enable gzip compression on server
- Use CDN for static assets

---

**🎉 Congratulations!** 
SnakkaZ Beta should now be running with the complete liquid glass design system.

**Next Steps:**
1. Verify design at `http://localhost:5173/info`
2. Test responsive design on mobile
3. Configure Supabase for full functionality
4. Deploy when satisfied with local testing
