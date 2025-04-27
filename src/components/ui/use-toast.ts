
// This file only re-exports from the hooks implementation
import * as React from "react";

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

// Import types and hook from the hooks implementation
import {
  useToast as useToastHook,
  type Toast,
  type ExtendedUseToastOptions,
} from "@/hooks/use-toast";

// Export the types
export { 
  type ToastProps,
  type ToastActionElement,
  type Toast,
  type ExtendedUseToastOptions,
};

// Export the hook
export const useToast = useToastHook;
