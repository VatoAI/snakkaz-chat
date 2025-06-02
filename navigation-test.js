# Navigation Testing Script
# Run this in the browser console on http://localhost:5175

function testNavigation() {
    console.log('🚀 Starting comprehensive navigation test...');
    
    const results = {
        unified: [],
        buttons: [],
        links: [],
        forms: [],
        total: 0,
        working: 0,
        broken: 0
    };
    
    // Test 1: UnifiedNavigation component buttons
    console.log('📍 Testing UnifiedNavigation buttons...');
    const unifiedButtons = document.querySelectorAll('nav[aria-label="Main Navigation"] button');
    unifiedButtons.forEach((button, index) => {
        const label = button.getAttribute('aria-label') || button.textContent?.trim() || `Button ${index}`;
        const path = button.getAttribute('data-path') || 'unknown';
        
        try {
            // Check if button has click handler
            const hasClickHandler = button.onclick !== null || 
                                  button.getAttribute('onclick') !== null ||
                                  button.addEventListener !== undefined;
            
            // Test click (without actually navigating)
            const clickEvent = new MouseEvent('click', { 
                bubbles: true, 
                cancelable: true 
            });
            
            const result = {
                type: 'unified-nav',
                label: label,
                path: path,
                element: button,
                working: hasClickHandler,
                error: null
            };
            
            // Try to dispatch click event
            try {
                button.dispatchEvent(clickEvent);
                result.working = true;
            } catch (error) {
                result.working = false;
                result.error = error.message;
            }
            
            results.unified.push(result);
            results.total++;
            if (result.working) results.working++;
            else results.broken++;
            
        } catch (error) {
            results.unified.push({
                type: 'unified-nav',
                label: label,
                path: path,
                element: button,
                working: false,
                error: error.message
            });
            results.total++;
            results.broken++;
        }
    });
    
    // Test 2: All other buttons
    console.log('🔘 Testing all other buttons...');
    const allButtons = document.querySelectorAll('button:not(nav[aria-label="Main Navigation"] button)');
    allButtons.forEach((button, index) => {
        const label = button.textContent?.trim() || button.getAttribute('aria-label') || `Button ${index}`;
        
        // Skip if button is hidden or disabled
        if (button.style.display === 'none' || button.disabled) return;
        
        try {
            const hasClickHandler = button.onclick !== null || 
                                  button.getAttribute('onclick') !== null;
            
            const result = {
                type: 'button',
                label: label,
                element: button,
                working: hasClickHandler || button.type === 'submit',
                error: null
            };
            
            results.buttons.push(result);
            results.total++;
            if (result.working) results.working++;
            else results.broken++;
            
        } catch (error) {
            results.buttons.push({
                type: 'button',
                label: label,
                element: button,
                working: false,
                error: error.message
            });
            results.total++;
            results.broken++;
        }
    });
    
    // Test 3: All links
    console.log('🔗 Testing all links...');
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach((link, index) => {
        const label = link.textContent?.trim() || link.getAttribute('aria-label') || `Link ${index}`;
        const href = link.getAttribute('href');
        
        if (!href || href === '#') {
            results.links.push({
                type: 'link',
                label: label,
                href: href,
                element: link,
                working: false,
                error: 'No href or href="#"'
            });
            results.total++;
            results.broken++;
        } else {
            results.links.push({
                type: 'link',
                label: label,
                href: href,
                element: link,
                working: true,
                error: null
            });
            results.total++;
            results.working++;
        }
    });
    
    // Test 4: Form submit buttons
    console.log('📝 Testing form submissions...');
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
        const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
        
        submitButtons.forEach((button, btnIndex) => {
            const label = button.textContent?.trim() || `Form ${index} Submit ${btnIndex}`;
            
            const result = {
                type: 'form-submit',
                label: label,
                element: button,
                working: form.onsubmit !== null || form.getAttribute('action') !== null,
                error: null
            };
            
            results.forms.push(result);
            results.total++;
            if (result.working) results.working++;
            else results.broken++;
        });
    });
    
    // Generate detailed report
    console.log('📊 Navigation Test Results:');
    console.log(`Total elements tested: ${results.total}`);
    console.log(`Working: ${results.working} (${Math.round((results.working/results.total)*100)}%)`);
    console.log(`Broken: ${results.broken} (${Math.round((results.broken/results.total)*100)}%)`);
    console.log('');
    
    // Detailed breakdown
    if (results.broken > 0) {
        console.log('❌ BROKEN NAVIGATION ELEMENTS:');
        
        [...results.unified, ...results.buttons, ...results.links, ...results.forms]
            .filter(item => !item.working)
            .forEach(item => {
                console.log(`   ${item.type}: "${item.label}" - ${item.error || 'No click handler'}`);
            });
        console.log('');
    }
    
    if (results.working > 0) {
        console.log('✅ WORKING NAVIGATION ELEMENTS:');
        [...results.unified, ...results.buttons, ...results.links, ...results.forms]
            .filter(item => item.working)
            .forEach(item => {
                console.log(`   ${item.type}: "${item.label}"`);
            });
    }
    
    return results;
}

// Auto-run test
console.log('🔍 Navigation Test Script Loaded');
console.log('Run testNavigation() to start testing');

// Also create a visual highlighter for broken elements
function highlightBrokenNavigation() {
    const style = document.createElement('style');
    style.innerHTML = `
        .nav-test-broken {
            border: 3px solid red !important;
            background: rgba(255, 0, 0, 0.1) !important;
            box-shadow: 0 0 10px red !important;
        }
        .nav-test-working {
            border: 3px solid green !important;
            background: rgba(0, 255, 0, 0.1) !important;
            box-shadow: 0 0 10px green !important;
        }
        .nav-test-overlay {
            position: fixed;
            top: 10px;
            right: 10px;
            background: black;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            font-family: monospace;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);
    
    const results = testNavigation();
    
    // Add visual indicators
    [...results.unified, ...results.buttons, ...results.links, ...results.forms].forEach(item => {
        if (item.element) {
            item.element.classList.add(item.working ? 'nav-test-working' : 'nav-test-broken');
        }
    });
    
    // Add overlay with results
    const overlay = document.createElement('div');
    overlay.className = 'nav-test-overlay';
    overlay.innerHTML = `
        Navigation Test Results:<br>
        Total: ${results.total}<br>
        Working: ${results.working} (${Math.round((results.working/results.total)*100)}%)<br>
        Broken: ${results.broken} (${Math.round((results.broken/results.total)*100)}%)<br>
        <button onclick="this.parentElement.remove()">Close</button>
    `;
    document.body.appendChild(overlay);
    
    return results;
}

console.log('💡 Run highlightBrokenNavigation() to visually highlight broken elements');
