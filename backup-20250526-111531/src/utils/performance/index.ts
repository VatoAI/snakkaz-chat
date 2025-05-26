export * from './memo-helpers';

// Performance tracking
let startTime = Date.now();
const performanceMark = (label: string) => {
  const now = Date.now();
  console.log(`${label}: ${now - startTime}ms`);
  startTime = now;
};

// Performance monitoring for components
export function trackComponentPerformance(
  componentName: string,
  onRender?: () => void
): { 
  start: () => void, 
  end: () => void,
  renderTime: number
} {
  let renderStart = 0;
  let lastRenderTime = 0;
  
  return {
    start: () => {
      renderStart = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render started`);
      }
    },
    
    end: () => {
      const renderEnd = performance.now();
      lastRenderTime = renderEnd - renderStart;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} rendered in ${lastRenderTime.toFixed(2)}ms`);
        
        // Log warning for slow renders
        if (lastRenderTime > 16) { // 1 frame at 60fps
          console.warn(`Slow render detected in ${componentName}: ${lastRenderTime.toFixed(2)}ms`);
        }
      }
      
      if (onRender) {
        onRender();
      }
    },
    
    renderTime: lastRenderTime
  };
}

// Hook to track component performance
export function useComponentPerformance(componentName: string) {
  const perf = trackComponentPerformance(componentName);
  perf.start();
  
  // Use a requestAnimationFrame to track when render is complete
  React.useEffect(() => {
    requestAnimationFrame(() => {
      perf.end();
    });
  });
  
  return perf;
}

// Function to create a virtualized list renderer
export function createVirtualizedRenderer<T>(
  items: T[],
  renderItem: (item: T, index: number) => React.ReactNode,
  itemHeight: number,
  containerHeight: number,
  overscan: number = 3
) {
  // Calculate which items should be in view
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalCount = items.length;
  
  return function VirtualizedRenderer(scrollPosition: number) {
    const startIndex = Math.max(0, Math.floor(scrollPosition / itemHeight) - overscan);
    const endIndex = Math.min(totalCount - 1, startIndex + visibleCount + 2 * overscan);
    
    // Render only the visible items
    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            top: i * itemHeight,
            height: itemHeight,
            left: 0,
            right: 0
          }}
        >
          {renderItem(items[i], i)}
        </div>
      );
    }
    
    return {
      visibleItems,
      totalHeight: totalCount * itemHeight,
      visibleStartIndex: startIndex,
      visibleEndIndex: endIndex
    };
  };
}
