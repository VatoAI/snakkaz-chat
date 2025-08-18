/**
 * Dynamic UI Components
 * 
 * This module provides utilities for lazy-loading UI components
 * to reduce initial bundle size and improve load times.
 */
import { createDynamicComponent } from '@/utils/dynamic-import';

// Simpler loading component for UI elements
const UILoading = () => (
  <div className="animate-pulse bg-cyberdark-800/50 rounded-md min-h-[40px]"></div>
);

// Dynamic imports for UI components that are large or less frequently used

// Dialog components
export const AdvancedDialog = createDynamicComponent(
  () => import('@/components/ui/advanced-dialog'),
  <UILoading />
);

// Data visualization components
export const DataTable = createDynamicComponent(
  () => import('@/components/ui/data-table'),
  <UILoading />
);

// Complex form components
export const RichTextEditor = createDynamicComponent(
  () => import('@/components/ui/rich-text-editor'),
  <UILoading />
);

export const ColorPicker = createDynamicComponent(
  () => import('@/components/ui/color-picker'),
  <UILoading />
);

export const FileUploader = createDynamicComponent(
  () => import('@/components/ui/file-uploader'),
  <UILoading />
);

// Preload UI components in the background
export function preloadUIComponents(components: string[]) {
  components.forEach(component => {
    switch (component) {
      case 'advanced-dialog':
        import('@/components/ui/advanced-dialog');
        break;
      case 'data-table':
        import('@/components/ui/data-table');
        break;
      case 'rich-text-editor':
        import('@/components/ui/rich-text-editor');
        break;
      case 'color-picker':
        import('@/components/ui/color-picker');
        break;
      case 'file-uploader':
        import('@/components/ui/file-uploader');
        break;
    }
  });
}
