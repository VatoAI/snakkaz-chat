import { chromium } from 'playwright';

async function showLiveDesign() {
  console.log('🎨 SnakkaZ Beta - LIVE PROFESSIONAL DESIGN SHOWCASE 🎨');
  console.log('========================================================');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1400, height: 900 });
    
    // Go to demo mode to see professional chat interface
    await page.goto('http://localhost:8080/#/demo');
    console.log('🌐 Loading SnakkaZ Beta from http://localhost:8080...');
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    await page.screenshot({
      path: 'live-design-showcase.png',
      fullPage: true
    });
    
    console.log('📸 Initial design screenshot: live-design-showcase.png');
    
    // Analyze the current page
    const pageTitle = await page.title();
    console.log(`📄 Page Title: ${pageTitle}`);
    
    // Check for glassmorphism elements
    const glassElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('.liquid-glass, .glass-morphism, .glass-card');
      let results = [];
      
      elements.forEach((el, index) => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        results.push({
          index: index + 1,
          className: el.className,
          backdropFilter: styles.backdropFilter,
          background: styles.background,
          borderRadius: styles.borderRadius,
          position: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          }
        });
      });
      
      return results;
    });
    
    console.log('\\n🔮 GLASSMORPHISM ELEMENTS DETECTED:');
    if (glassElements.length > 0) {
      glassElements.forEach(el => {
        console.log(`  Element ${el.index}:`);
        console.log(`    Classes: ${el.className}`);
        console.log(`    Backdrop Filter: ${el.backdropFilter}`);
        console.log(`    Background: ${el.background.substring(0, 50)}...`);
        console.log(`    Border Radius: ${el.borderRadius}`);
        console.log(`    Position: ${el.position.width}x${el.position.height} at (${el.position.x}, ${el.position.y})`);
        console.log('');
      });
    } else {
      console.log('  ⚠️  No glassmorphism elements found - checking page state...');
      
      // Check what's actually on the page
      const pageContent = await page.evaluate(() => {
        return {
          hasRoot: !!document.getElementById('root'),
          rootContent: document.getElementById('root')?.innerHTML?.substring(0, 200),
          bodyClasses: document.body.className,
          hasStyles: document.head.querySelector('link[href*="css"]') !== null,
          loadingScreen: !!document.querySelector('.loading-screen')
        };
      });
      
      console.log('  📋 Page Analysis:');
      console.log(`    Has Root Element: ${pageContent.hasRoot}`);
      console.log(`    Body Classes: ${pageContent.bodyClasses || 'None'}`);
      console.log(`    Has CSS Loaded: ${pageContent.hasStyles}`);
      console.log(`    Loading Screen: ${pageContent.loadingScreen}`);
      console.log(`    Root Content: ${pageContent.rootContent}...`);
    }
    
    // Check responsive breakpoints
    const breakpoints = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];
    
    console.log('\\n📱 RESPONSIVE DESIGN TEST:');
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.waitForTimeout(1000);
      
      const layoutInfo = await page.evaluate(() => {
        const body = document.body;
        const root = document.getElementById('root');
        
        return {
          bodyWidth: body.offsetWidth,
          bodyHeight: body.offsetHeight,
          rootWidth: root?.offsetWidth,
          rootHeight: root?.offsetHeight,
          isOverflowing: body.scrollWidth > body.offsetWidth
        };
      });
      
      console.log(`  ${bp.name} (${bp.width}x${bp.height}):`);
      console.log(`    Layout: ${layoutInfo.rootWidth}x${layoutInfo.rootHeight}`);
      console.log(`    Overflow: ${layoutInfo.isOverflowing ? 'Yes' : 'No'}`);
      
      await page.screenshot({
        path: `responsive-${bp.name.toLowerCase()}.png`,
        fullPage: true
      });
      console.log(`    Screenshot: responsive-${bp.name.toLowerCase()}.png`);
    }
    
    // Test animations and interactions
    await page.setViewportSize({ width: 1400, height: 900 });
    
    console.log('\\n🎭 ANIMATION & INTERACTION TEST:');
    const animationTest = await page.evaluate(() => {
      const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"], [class*="motion"]');
      const hoverElements = document.querySelectorAll('[class*="hover:"]');
      
      return {
        animatedCount: animatedElements.length,
        hoverCount: hoverElements.length,
        hasFramerMotion: typeof window.FramerMotion !== 'undefined'
      };
    });
    
    console.log(`    Animated Elements: ${animationTest.animatedCount}`);
    console.log(`    Hover Effects: ${animationTest.hoverCount}`);
    console.log(`    Framer Motion: ${animationTest.hasFramerMotion ? 'Loaded' : 'Not detected'}`);
    
    // Color scheme analysis
    console.log('\\n🎨 COLOR SCHEME ANALYSIS:');
    const colorScheme = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontFamily: styles.fontFamily,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      };
    });
    
    console.log(`    Background: ${colorScheme.backgroundColor}`);
    console.log(`    Text Color: ${colorScheme.color}`);
    console.log(`    Font Family: ${colorScheme.fontFamily}`);
    console.log(`    Theme: ${colorScheme.theme}`);
    
    console.log('\\n✨ DESIGN SHOWCASE COMPLETE!');
    console.log('========================================================');
    console.log('📸 Screenshots saved:');
    console.log('  - live-design-showcase.png (Main design)');
    console.log('  - responsive-mobile.png (Mobile view)');
    console.log('  - responsive-tablet.png (Tablet view)');
    console.log('  - responsive-desktop.png (Desktop view)');
    
  } catch (error) {
    console.error('❌ Showcase failed:', error);
  } finally {
    await browser.close();
  }
}

showLiveDesign().catch(console.error);
