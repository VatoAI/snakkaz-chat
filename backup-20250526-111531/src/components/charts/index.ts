/**
 * Chart Components Index
 * 
 * This file exports all chart components in both static and dynamic versions.
 * - Use the static exports when you need to import all charts at once
 * - Use the dynamic exports when you want to lazy-load charts for better performance
 */

// Re-export the dynamic chart imports for easy lazy-loading
export * from './dynamic-charts';

// Also provide direct imports for convenience when lazy-loading isn't needed
export { default as AreaChartComponent } from './AreaChartComponent';
export { default as BarChartComponent } from './BarChartComponent';
export { default as LineChartComponent } from './LineChartComponent';
export { default as PieChartComponent } from './PieChartComponent';

// Export types
export type { AreaChartProps } from './AreaChartComponent';
export type { BarChartProps } from './BarChartComponent';
export type { LineChartProps } from './LineChartComponent';
export type { PieChartProps } from './PieChartComponent';
