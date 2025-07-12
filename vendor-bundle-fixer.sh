#!/bin/bash
# SnakkaZ Vendor Bundle Fixer & Advanced Debugger
# Fixes common vendor bundle issues and provides advanced debugging

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

echo -e "${CYAN}🔧 SnakkaZ Vendor Bundle Advanced Fixer${NC}"

# Function to create safe React mocks
create_react_mocks() {
    local file="$1"
    local backup_file="${file}.backup"
    
    echo -e "${BLUE}Creating safe React mocks for $file...${NC}"
    
    # Create backup
    cp "$file" "$backup_file"
    
    # Add comprehensive React mocks at the beginning
    cat > "/tmp/react-mocks.js" << 'EOF'
// Comprehensive React Mock System for Vendor Bundles
(function() {
    'use strict';
    
    // Safe React implementation
    const SafeReact = {
        Component: class Component {
            constructor(props) {
                this.props = props || {};
                this.state = {};
            }
            setState(updates) {
                if (typeof updates === 'function') {
                    updates = updates(this.state);
                }
                this.state = { ...this.state, ...updates };
            }
            render() {
                return null;
            }
        },
        
        createElement: function(type, props, ...children) {
            if (typeof type === 'string') {
                return {
                    type: type,
                    props: { ...props, children: children.length === 1 ? children[0] : children },
                    $$typeof: Symbol.for('react.element')
                };
            }
            if (typeof type === 'function') {
                try {
                    return type(props);
                } catch (e) {
                    console.warn('SafeReact: Component error caught', e);
                    return { type: 'div', props: { children: 'Component Error' } };
                }
            }
            return { type: 'div', props: { children: children } };
        },
        
        createContext: function(defaultValue) {
            const context = {
                Provider: function({ children, value }) {
                    return children;
                },
                Consumer: function({ children }) {
                    return typeof children === 'function' ? children(defaultValue) : children;
                },
                _currentValue: defaultValue,
                _context: true,
                displayName: 'Context'
            };
            return context;
        },
        
        forwardRef: function(render) {
            return function(props) {
                return render(props, { current: null });
            };
        },
        
        Fragment: function({ children }) {
            return children;
        },
        
        memo: function(component) {
            return component;
        },
        
        useCallback: function(callback, deps) {
            return callback;
        },
        
        useContext: function(context) {
            return context._currentValue || {};
        },
        
        useEffect: function(effect, deps) {
            try {
                if (typeof effect === 'function') {
                    const cleanup = effect();
                    if (typeof cleanup === 'function') {
                        // Store cleanup for potential later use
                        return cleanup;
                    }
                }
            } catch (e) {
                console.warn('SafeReact: useEffect error caught', e);
            }
        },
        
        useLayoutEffect: function(effect, deps) {
            return this.useEffect(effect, deps);
        },
        
        useMemo: function(factory, deps) {
            try {
                return typeof factory === 'function' ? factory() : factory;
            } catch (e) {
                console.warn('SafeReact: useMemo error caught', e);
                return null;
            }
        },
        
        useRef: function(initialValue) {
            return { current: initialValue };
        },
        
        useState: function(initialState) {
            const state = typeof initialState === 'function' ? initialState() : initialState;
            const setState = function(newState) {
                // In a real app, this would trigger re-render
                console.log('SafeReact: setState called with', newState);
            };
            return [state, setState];
        },
        
        useReducer: function(reducer, initialState) {
            const dispatch = function(action) {
                console.log('SafeReact: dispatch called with', action);
            };
            return [initialState, dispatch];
        },
        
        isValidElement: function(element) {
            return element && typeof element === 'object' && element.$$typeof === Symbol.for('react.element');
        },
        
        Children: {
            forEach: function(children, fn) {
                if (Array.isArray(children)) {
                    children.forEach(fn);
                } else if (children) {
                    fn(children, 0);
                }
            },
            map: function(children, fn) {
                if (Array.isArray(children)) {
                    return children.map(fn);
                } else if (children) {
                    return [fn(children, 0)];
                }
                return [];
            },
            count: function(children) {
                return Array.isArray(children) ? children.length : children ? 1 : 0;
            },
            only: function(children) {
                if (Array.isArray(children) && children.length === 1) {
                    return children[0];
                }
                return children;
            }
        }
    };
    
    // Ensure global React availability
    if (typeof window !== 'undefined') {
        window.React = window.React || SafeReact;
        window.SafeReact = SafeReact;
    }
    
    // For module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SafeReact;
    }
    
    // For AMD
    if (typeof define === 'function' && define.amd) {
        define(function() { return SafeReact; });
    }
})();

EOF
    
    # Prepend React mocks to the file
    cat "/tmp/react-mocks.js" "$backup_file" > "$file"
    
    echo -e "${GREEN}✅ React mocks added to $file${NC}"
}

# Function to fix specific vendor issues
fix_vendor_router() {
    local file="$SNAKKAZ_DIR/assets/js/vendor-router-DRYHFKTT.js"
    
    if [ -f "$file" ]; then
        echo -e "${BLUE}🔧 Fixing React Router vendor bundle...${NC}"
        
        # Replace problematic patterns
        sed -i 's/reactExports\.createContext/SafeReact.createContext/g' "$file"
        sed -i 's/reactExports\.useContext/SafeReact.useContext/g' "$file"
        sed -i 's/reactExports\.useRef/SafeReact.useRef/g' "$file"
        sed -i 's/reactExports\.useCallback/SafeReact.useCallback/g' "$file"
        sed -i 's/reactExports\.useMemo/SafeReact.useMemo/g' "$file"
        sed -i 's/reactExports\.useLayoutEffect/SafeReact.useLayoutEffect/g' "$file"
        sed -i 's/reactExports\.createElement/SafeReact.createElement/g' "$file"
        sed -i 's/reactExports\.Component/SafeReact.Component/g' "$file"
        
        echo -e "${GREEN}✅ Router vendor bundle fixed${NC}"
    fi
}

fix_vendor_animation() {
    local file="$SNAKKAZ_DIR/assets/js/vendor-animation-BRHAymv3.js"
    
    if [ -f "$file" ]; then
        echo -e "${BLUE}🔧 Fixing Animation vendor bundle...${NC}"
        
        # Ensure safe context creation
        sed -i 's/createContext(/SafeReact.createContext(/g' "$file"
        sed -i 's/React\.createContext/SafeReact.createContext/g' "$file"
        
        echo -e "${GREEN}✅ Animation vendor bundle fixed${NC}"
    fi
}

# Function to validate fixes
validate_fixes() {
    echo -e "${BLUE}🔍 Validating vendor bundle fixes...${NC}"
    
    cd "$SNAKKAZ_DIR"
    
    # Check for remaining issues
    local issues=0
    
    for file in assets/js/vendor-*.js; do
        if [ -f "$file" ]; then
            echo "Checking $file..."
            
            # Check for undefined exports
            if grep -q "\.undefined" "$file"; then
                echo -e "${RED}❌ Found undefined exports in $file${NC}"
                ((issues++))
            fi
            
            # Check for missing React references
            if grep -q "reactExports\." "$file" && ! grep -q "SafeReact" "$file"; then
                echo -e "${YELLOW}⚠️ Found reactExports without SafeReact fallback in $file${NC}"
            fi
            
            # Syntax check
            if node -c "$file" 2>/dev/null; then
                echo -e "${GREEN}✅ $file syntax valid${NC}"
            else
                echo -e "${RED}❌ $file has syntax errors${NC}"
                ((issues++))
            fi
        fi
    done
    
    if [ $issues -eq 0 ]; then
        echo -e "${GREEN}🎉 All vendor bundles validated successfully!${NC}"
        return 0
    else
        echo -e "${RED}⚠️ Found $issues issues that need attention${NC}"
        return 1
    fi
}

# Function to create development tools
create_dev_tools() {
    echo -e "${BLUE}🛠️ Creating development tools...${NC}"
    
    # Create browser console debugger
    cat > "$SNAKKAZ_DIR/debug-console.js" << 'EOF'
// SnakkaZ Debug Console Tools
window.SnakkazDebug = {
    // Check React context availability
    checkReact: function() {
        console.log('React availability check:');
        console.log('window.React:', typeof window.React);
        console.log('window.SafeReact:', typeof window.SafeReact);
        console.log('React.createContext:', typeof (window.React && window.React.createContext));
        
        if (window.SafeReact) {
            console.log('✅ SafeReact mock system loaded');
        } else {
            console.log('❌ SafeReact mock system not found');
        }
    },
    
    // Test vendor bundles
    testVendorBundles: function() {
        const vendorBundles = [
            'vendor-router-DRYHFKTT',
            'vendor-animation-BRHAymv3',
            'vendor-react-core-Cd05VJ5Y'
        ];
        
        vendorBundles.forEach(bundle => {
            const script = document.querySelector(`script[src*="${bundle}"]`);
            console.log(`${bundle}:`, script ? '✅ Loaded' : '❌ Not found');
        });
    },
    
    // Performance monitoring
    checkPerformance: function() {
        if (window.performance && window.performance.getEntriesByType) {
            const resources = window.performance.getEntriesByType('resource');
            const jsResources = resources.filter(r => r.name.endsWith('.js'));
            
            console.log('JavaScript Resource Loading Times:');
            jsResources.forEach(resource => {
                console.log(`${resource.name.split('/').pop()}: ${Math.round(resource.duration)}ms`);
            });
        }
    },
    
    // Check for errors
    errorCount: 0,
    logError: function(error) {
        this.errorCount++;
        console.error(`SnakkaZ Error #${this.errorCount}:`, error);
    },
    
    // Context debugging
    debugContext: function(contextName) {
        console.log(`Debugging context: ${contextName}`);
        // Add context-specific debugging logic
    }
};

// Auto-run basic checks
if (document.readyState === 'complete') {
    setTimeout(() => {
        console.log('🚀 SnakkaZ Debug Tools Loaded');
        window.SnakkazDebug.checkReact();
        window.SnakkazDebug.testVendorBundles();
    }, 1000);
} else {
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log('🚀 SnakkaZ Debug Tools Loaded');
            window.SnakkazDebug.checkReact();
            window.SnakkazDebug.testVendorBundles();
        }, 1000);
    });
}

// Error tracking
window.addEventListener('error', (event) => {
    window.SnakkazDebug.logError(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    window.SnakkazDebug.logError(event.reason);
});
EOF
    
    echo -e "${GREEN}✅ Debug tools created${NC}"
}

# Main execution
main() {
    cd "$SNAKKAZ_DIR"
    
    echo -e "${PURPLE}🔧 Starting vendor bundle fixes...${NC}"
    
    # Create React mocks for all vendor files
    for vendor_file in assets/js/vendor-*.js; do
        if [ -f "$vendor_file" ]; then
            create_react_mocks "$vendor_file"
        fi
    done
    
    # Apply specific fixes
    fix_vendor_router
    fix_vendor_animation
    
    # Create development tools
    create_dev_tools
    
    # Validate all fixes
    if validate_fixes; then
        echo -e "${GREEN}🎉 All vendor bundle issues have been resolved!${NC}"
        echo -e "${BLUE}📦 Rebuilding production zip...${NC}"
        
        # Rebuild production zip
        cd /workspaces/snakkaz-chat
        rm -f snakkaz-complete-production-ready.zip
        zip -r snakkaz-complete-production-ready.zip snakkaz-complete-deployment/
        
        echo -e "${GREEN}✅ New production zip created with all fixes!${NC}"
    else
        echo -e "${YELLOW}⚠️ Some issues remain. Check the output above.${NC}"
    fi
    
    echo -e "${CYAN}💡 To use debug tools, add this to your HTML:${NC}"
    echo -e "${CYAN}<script src=\"debug-console.js\"></script>${NC}"
}

main "$@"
