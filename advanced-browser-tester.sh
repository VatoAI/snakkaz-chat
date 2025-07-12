#!/bin/bash
# Advanced Browser Testing & Performance Monitor for SnakkaZ
# Real-time debugging and monitoring suite

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

SNAKKAZ_DIR="/workspaces/snakkaz-chat/snakkaz-complete-deployment"
TEST_PORT=8081

echo -e "${CYAN}🌐 SnakkaZ Advanced Browser Testing Suite${NC}"

# Install additional testing tools
install_testing_tools() {
    echo -e "${BLUE}📦 Installing advanced testing tools...${NC}"
    
    # Install Playwright for browser automation
    npm install -g playwright-cli
    
    # Install browser testing tools
    npm install -g puppeteer-cli browser-sync
    
    echo -e "${GREEN}✅ Testing tools installed${NC}"
}

# Create advanced browser test script
create_browser_test() {
    cat > "$SNAKKAZ_DIR/browser-test.js" << 'EOF'
// SnakkaZ Advanced Browser Testing Script
class SnakkazBrowserTester {
    constructor() {
        this.testResults = [];
        this.performanceMetrics = {};
        this.errorLog = [];
        this.init();
    }
    
    init() {
        console.log('🚀 SnakkaZ Browser Tester Initialized');
        this.setupErrorHandling();
        this.setupPerformanceMonitoring();
        this.runBasicTests();
    }
    
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });
        
        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });
        
        // React error boundary simulation
        if (window.React) {
            const originalError = console.error;
            console.error = (...args) => {
                if (args[0] && args[0].includes && args[0].includes('React')) {
                    this.logError('React Error', args);
                }
                originalError.apply(console, args);
            };
        }
    }
    
    setupPerformanceMonitoring() {
        // Performance observer for resource loading
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name.includes('.js') || entry.name.includes('.css')) {
                        this.performanceMetrics[entry.name] = {
                            duration: entry.duration,
                            transferSize: entry.transferSize,
                            loadTime: entry.loadEnd - entry.loadStart
                        };
                    }
                });
            });
            observer.observe({ entryTypes: ['resource'] });
        }
        
        // Memory usage monitoring
        if ('memory' in performance) {
            setInterval(() => {
                this.performanceMetrics.memory = {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                };
            }, 5000);
        }
    }
    
    runBasicTests() {
        setTimeout(() => {
            this.testReactAvailability();
            this.testVendorBundles();
            this.testPWAFeatures();
            this.testResponsiveDesign();
            this.testLiquidGlassDesign();
            this.generateReport();
        }, 2000);
    }
    
    testReactAvailability() {
        const test = {
            name: 'React Availability',
            status: 'running',
            details: {}
        };
        
        try {
            // Test React global
            test.details.reactGlobal = typeof window.React !== 'undefined';
            test.details.safeReact = typeof window.SafeReact !== 'undefined';
            
            // Test React methods
            const reactMethods = ['createElement', 'createContext', 'useContext', 'useState', 'useEffect'];
            test.details.methods = {};
            
            const reactObj = window.React || window.SafeReact || {};
            reactMethods.forEach(method => {
                test.details.methods[method] = typeof reactObj[method] === 'function';
            });
            
            // Test context creation
            try {
                const testContext = (window.React || window.SafeReact).createContext('test');
                test.details.contextCreation = !!testContext;
            } catch (e) {
                test.details.contextCreation = false;
                test.details.contextError = e.message;
            }
            
            test.status = 'passed';
        } catch (e) {
            test.status = 'failed';
            test.error = e.message;
        }
        
        this.testResults.push(test);
        this.logTest(test);
    }
    
    testVendorBundles() {
        const test = {
            name: 'Vendor Bundle Loading',
            status: 'running',
            details: {}
        };
        
        const expectedBundles = [
            'vendor-react-core-Cd05VJ5Y.js',
            'vendor-router-DRYHFKTT.js',
            'vendor-animation-BRHAymv3.js',
            'app-services-Cf0jkxe3.js'
        ];
        
        test.details.bundles = {};
        
        expectedBundles.forEach(bundle => {
            const script = document.querySelector(`script[src*="${bundle}"]`);
            test.details.bundles[bundle] = {
                loaded: !!script,
                element: script ? 'found' : 'not found'
            };
        });
        
        // Check for bundle errors
        test.details.bundleErrors = this.errorLog.filter(error => 
            error.category === 'JavaScript Error' && 
            error.data.filename && 
            expectedBundles.some(bundle => error.data.filename.includes(bundle))
        );
        
        test.status = test.details.bundleErrors.length === 0 ? 'passed' : 'warning';
        this.testResults.push(test);
        this.logTest(test);
    }
    
    testPWAFeatures() {
        const test = {
            name: 'PWA Features',
            status: 'running',
            details: {}
        };
        
        // Test service worker
        test.details.serviceWorker = 'serviceWorker' in navigator;
        
        // Test manifest
        const manifestLink = document.querySelector('link[rel="manifest"]');
        test.details.manifest = !!manifestLink;
        
        // Test offline capability
        test.details.offline = navigator.onLine !== undefined;
        
        // Test install prompt
        test.details.installPrompt = 'BeforeInstallPromptEvent' in window;
        
        test.status = 'passed';
        this.testResults.push(test);
        this.logTest(test);
    }
    
    testResponsiveDesign() {
        const test = {
            name: 'Responsive Design',
            status: 'running',
            details: {}
        };
        
        // Test viewport meta tag
        const viewport = document.querySelector('meta[name="viewport"]');
        test.details.viewport = !!viewport;
        
        // Test CSS media queries
        const styles = document.styleSheets;
        let hasMediaQueries = false;
        
        try {
            for (let i = 0; i < styles.length; i++) {
                const rules = styles[i].cssRules || styles[i].rules;
                for (let j = 0; j < rules.length; j++) {
                    if (rules[j].type === CSSRule.MEDIA_RULE) {
                        hasMediaQueries = true;
                        break;
                    }
                }
                if (hasMediaQueries) break;
            }
        } catch (e) {
            // Cross-origin stylesheets can't be accessed
        }
        
        test.details.mediaQueries = hasMediaQueries;
        test.details.screenSize = {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio
        };
        
        test.status = 'passed';
        this.testResults.push(test);
        this.logTest(test);
    }
    
    testLiquidGlassDesign() {
        const test = {
            name: 'Liquid Glass Design',
            status: 'running',
            details: {}
        };
        
        // Check for glass effects in CSS
        const elements = document.querySelectorAll('*');
        let glassEffects = 0;
        
        elements.forEach(el => {
            const styles = window.getComputedStyle(el);
            if (styles.backdropFilter && styles.backdropFilter !== 'none') {
                glassEffects++;
            }
            if (styles.background && styles.background.includes('rgba')) {
                glassEffects++;
            }
        });
        
        test.details.glassEffects = glassEffects;
        test.details.backdropFilterSupport = CSS.supports('backdrop-filter', 'blur(10px)');
        
        test.status = glassEffects > 0 ? 'passed' : 'warning';
        this.testResults.push(test);
        this.logTest(test);
    }
    
    logError(category, data) {
        const error = {
            timestamp: new Date().toISOString(),
            category,
            data
        };
        this.errorLog.push(error);
        console.error('SnakkaZ Error:', error);
    }
    
    logTest(test) {
        const icon = test.status === 'passed' ? '✅' : 
                    test.status === 'warning' ? '⚠️' : '❌';
        console.log(`${icon} ${test.name}: ${test.status}`);
        if (test.details) {
            console.table(test.details);
        }
    }
    
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            testResults: this.testResults,
            performanceMetrics: this.performanceMetrics,
            errorLog: this.errorLog,
            summary: {
                totalTests: this.testResults.length,
                passed: this.testResults.filter(t => t.status === 'passed').length,
                warnings: this.testResults.filter(t => t.status === 'warning').length,
                failed: this.testResults.filter(t => t.status === 'failed').length,
                errors: this.errorLog.length
            }
        };
        
        console.log('📊 SnakkaZ Test Report Generated:');
        console.table(report.summary);
        
        // Store report globally for external access
        window.SnakkazTestReport = report;
        
        // Display visual report
        this.displayVisualReport(report);
    }
    
    displayVisualReport(report) {
        // Create floating test results panel
        const panel = document.createElement('div');
        panel.id = 'snakkaz-test-panel';
        panel.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 10px;
                backdrop-filter: blur(10px);
                z-index: 10000;
                font-family: monospace;
                font-size: 12px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <h3 style="margin: 0 0 10px 0; color: #00ff88;">🚀 SnakkaZ Test Results</h3>
                <div>✅ Passed: ${report.summary.passed}</div>
                <div>⚠️ Warnings: ${report.summary.warnings}</div>
                <div>❌ Failed: ${report.summary.failed}</div>
                <div>🐛 Errors: ${report.summary.errors}</div>
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <div>Memory: ${Math.round((this.performanceMetrics.memory?.used || 0) / 1024 / 1024)}MB</div>
                    <div>Load Time: ${Math.round(performance.now())}ms</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 16px;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (panel.parentElement) {
                panel.remove();
            }
        }, 30000);
    }
}

// Auto-start testing when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SnakkazBrowserTester();
    });
} else {
    new SnakkazBrowserTester();
}

// Export for manual testing
window.SnakkazBrowserTester = SnakkazBrowserTester;
EOF
    
    echo -e "${GREEN}✅ Advanced browser test created${NC}"
}

# Create real-time performance monitor
create_performance_monitor() {
    cat > "$SNAKKAZ_DIR/performance-monitor.js" << 'EOF'
// Real-time Performance Monitor for SnakkaZ
class SnakkazPerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: [],
            memory: [],
            network: [],
            rendering: []
        };
        this.init();
    }
    
    init() {
        this.setupFPSMonitoring();
        this.setupMemoryMonitoring();
        this.setupNetworkMonitoring();
        this.setupRenderingMonitoring();
        this.createMonitoringPanel();
    }
    
    setupFPSMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
                this.metrics.fps.push({
                    time: new Date().toISOString(),
                    value: fps
                });
                
                // Keep only last 60 measurements
                if (this.metrics.fps.length > 60) {
                    this.metrics.fps.shift();
                }
                
                frameCount = 0;
                lastTime = currentTime;
                
                this.updatePanel();
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.metrics.memory.push({
                    time: new Date().toISOString(),
                    used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
                });
                
                // Keep only last 60 measurements
                if (this.metrics.memory.length > 60) {
                    this.metrics.memory.shift();
                }
                
                this.updatePanel();
            }, 1000);
        }
    }
    
    setupNetworkMonitoring() {
        if ('connection' in navigator) {
            const updateConnection = () => {
                this.metrics.network.push({
                    time: new Date().toISOString(),
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt
                });
                
                if (this.metrics.network.length > 60) {
                    this.metrics.network.shift();
                }
                
                this.updatePanel();
            };
            
            navigator.connection.addEventListener('change', updateConnection);
            updateConnection();
        }
    }
    
    setupRenderingMonitoring() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 50) { // Tasks longer than 50ms
                        this.metrics.rendering.push({
                            time: new Date().toISOString(),
                            duration: entry.duration,
                            type: entry.name
                        });
                    }
                });
                
                if (this.metrics.rendering.length > 20) {
                    this.metrics.rendering.shift();
                }
                
                this.updatePanel();
            });
            
            observer.observe({ entryTypes: ['longtask'] });
        }
    }
    
    createMonitoringPanel() {
        const panel = document.createElement('div');
        panel.id = 'snakkaz-performance-monitor';
        panel.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 280px;
                background: rgba(0, 20, 40, 0.95);
                color: #00ff88;
                padding: 15px;
                border-radius: 8px;
                backdrop-filter: blur(15px);
                z-index: 9999;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                border: 1px solid rgba(0, 255, 136, 0.3);
                box-shadow: 0 4px 20px rgba(0, 255, 136, 0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: #00ff88;">⚡ Performance Monitor</h4>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        background: none;
                        border: none;
                        color: #00ff88;
                        cursor: pointer;
                        font-size: 14px;
                    ">×</button>
                </div>
                <div id="fps-display">FPS: --</div>
                <div id="memory-display">Memory: --</div>
                <div id="network-display">Network: --</div>
                <div id="rendering-display">Long Tasks: --</div>
                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(0, 255, 136, 0.2);">
                    <div style="font-size: 10px; opacity: 0.7;">Real-time monitoring active</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.panel = panel;
    }
    
    updatePanel() {
        if (!this.panel) return;
        
        const fpsDisplay = this.panel.querySelector('#fps-display');
        const memoryDisplay = this.panel.querySelector('#memory-display');
        const networkDisplay = this.panel.querySelector('#network-display');
        const renderingDisplay = this.panel.querySelector('#rendering-display');
        
        // Update FPS
        if (this.metrics.fps.length > 0) {
            const latestFPS = this.metrics.fps[this.metrics.fps.length - 1].value;
            const color = latestFPS >= 60 ? '#00ff88' : latestFPS >= 30 ? '#ffaa00' : '#ff4444';
            fpsDisplay.innerHTML = `FPS: <span style="color: ${color}">${latestFPS}</span>`;
        }
        
        // Update Memory
        if (this.metrics.memory.length > 0) {
            const latest = this.metrics.memory[this.metrics.memory.length - 1];
            const percentage = Math.round((latest.used / latest.total) * 100);
            const color = percentage < 70 ? '#00ff88' : percentage < 85 ? '#ffaa00' : '#ff4444';
            memoryDisplay.innerHTML = `Memory: <span style="color: ${color}">${latest.used}MB (${percentage}%)</span>`;
        }
        
        // Update Network
        if (this.metrics.network.length > 0) {
            const latest = this.metrics.network[this.metrics.network.length - 1];
            networkDisplay.innerHTML = `Network: <span style="color: #00aaff">${latest.effectiveType || 'Unknown'}</span>`;
        }
        
        // Update Rendering
        const recentLongTasks = this.metrics.rendering.filter(
            task => Date.now() - new Date(task.time).getTime() < 5000
        );
        const color = recentLongTasks.length === 0 ? '#00ff88' : '#ffaa00';
        renderingDisplay.innerHTML = `Long Tasks: <span style="color: ${color}">${recentLongTasks.length}</span>`;
    }
    
    getReport() {
        return {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            summary: {
                averageFPS: this.metrics.fps.length > 0 ? 
                    Math.round(this.metrics.fps.reduce((sum, item) => sum + item.value, 0) / this.metrics.fps.length) : 0,
                currentMemory: this.metrics.memory.length > 0 ? 
                    this.metrics.memory[this.metrics.memory.length - 1] : null,
                longTaskCount: this.metrics.rendering.length,
                networkQuality: this.metrics.network.length > 0 ? 
                    this.metrics.network[this.metrics.network.length - 1].effectiveType : 'unknown'
            }
        };
    }
}

// Auto-start monitoring
document.addEventListener('DOMContentLoaded', () => {
    window.SnakkazPerformanceMonitor = new SnakkazPerformanceMonitor();
});

// Global access
window.getPerformanceReport = () => {
    return window.SnakkazPerformanceMonitor ? 
        window.SnakkazPerformanceMonitor.getReport() : 
        { error: 'Performance monitor not initialized' };
};
EOF
    
    echo -e "${GREEN}✅ Performance monitor created${NC}"
}

# Add debugging tools to index.html
add_debug_tools_to_html() {
    echo -e "${BLUE}🔧 Adding debug tools to index.html...${NC}"
    
    # Insert debug scripts before closing </body> tag
    sed -i 's|</body>|<script src="browser-test.js"></script>\n<script src="performance-monitor.js"></script>\n<script src="debug-console.js"></script>\n</body>|' "$SNAKKAZ_DIR/index.html"
    
    echo -e "${GREEN}✅ Debug tools added to index.html${NC}"
}

# Run advanced browser testing
run_browser_testing() {
    echo -e "${BLUE}🌐 Starting advanced browser testing...${NC}"
    
    cd "$SNAKKAZ_DIR"
    
    # Start local server
    echo -e "${CYAN}Starting test server on port $TEST_PORT...${NC}"
    python3 -m http.server $TEST_PORT > /tmp/server.log 2>&1 &
    SERVER_PID=$!
    
    sleep 3
    
    # Test with curl first
    if curl -s "http://localhost:$TEST_PORT" > /dev/null; then
        echo -e "${GREEN}✅ Server started successfully${NC}"
        echo -e "${CYAN}🌐 Open http://localhost:$TEST_PORT in your browser${NC}"
        echo -e "${YELLOW}📊 Advanced debugging tools will be active${NC}"
        echo -e "${PURPLE}🔧 Browser console will show detailed test results${NC}"
        
        # Keep server running for manual testing
        echo -e "${BLUE}Press Ctrl+C to stop the server${NC}"
        wait $SERVER_PID
    else
        echo -e "${RED}❌ Failed to start server${NC}"
        kill $SERVER_PID 2>/dev/null || true
    fi
}

# Main execution
main() {
    echo -e "${PURPLE}🚀 Setting up advanced browser testing environment...${NC}"
    
    create_browser_test
    create_performance_monitor
    add_debug_tools_to_html
    
    echo -e "${GREEN}🎉 Advanced testing environment ready!${NC}"
    echo -e "${CYAN}💡 Features included:${NC}"
    echo -e "  ✅ Real-time performance monitoring"
    echo -e "  ✅ Automated browser testing"
    echo -e "  ✅ Error tracking and debugging"
    echo -e "  ✅ Memory and FPS monitoring"
    echo -e "  ✅ PWA feature validation"
    echo -e "  ✅ Liquid glass design testing"
    
    read -p "🌐 Start browser testing server? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_browser_testing
    else
        echo -e "${BLUE}💡 To start testing later, run:${NC}"
        echo -e "${CYAN}cd $SNAKKAZ_DIR && python3 -m http.server $TEST_PORT${NC}"
    fi
}

main "$@"
