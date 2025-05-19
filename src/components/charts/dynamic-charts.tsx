/**
 * Dynamic Chart Components
 * 
 * This module provides utilities for lazy-loading chart components
 * to reduce initial bundle size and improve load times.
 */
import React, { lazy, Suspense } from 'react';
import { createDynamicComponent } from '@/utils/dynamic-import';

// Simple loading component specific for charts
const ChartLoading = () => (
  <div className="flex items-center justify-center h-[300px] w-full bg-cyberdark-900/50 rounded-lg animate-pulse">
    <div className="text-cybergold-400">Laster diagram...</div>
  </div>
);

// Error fallback for charts
const ChartError = ({ error }: { error: Error }) => (
  <div className="flex flex-col items-center justify-center h-[300px] w-full bg-cyberdark-900/50 rounded-lg border border-red-900/50">
    <div className="text-red-400 mb-2">Kunne ikke laste diagram</div>
    <div className="text-red-300/70 text-sm">{error.message}</div>
  </div>
);

// Dynamic imports for charts
export const AreaChartComponent = createDynamicComponent(
  () => import('./AreaChartComponent'),
  <ChartLoading />,
  ChartError
);

export const BarChartComponent = createDynamicComponent(
  () => import('./BarChartComponent'),
  <ChartLoading />,
  ChartError
);

export const LineChartComponent = createDynamicComponent(
  () => import('./LineChartComponent'),
  <ChartLoading />,
  ChartError
);

export const PieChartComponent = createDynamicComponent(
  () => import('./PieChartComponent'),
  <ChartLoading />,
  ChartError
);

// Preload charts that might be needed soon
export function preloadCharts(chartTypes: ('area' | 'bar' | 'line' | 'pie')[]) {
  chartTypes.forEach(type => {
    switch (type) {
      case 'area':
        import('./AreaChartComponent');
        break;
      case 'bar':
        import('./BarChartComponent');
        break;
      case 'line':
        import('./LineChartComponent');
        break;
      case 'pie':
        import('./PieChartComponent');
        break;
    }
  });
}
