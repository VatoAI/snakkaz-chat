
// This file should only re-export from the hooks implementation
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// We're changing this to avoid circular imports
import {
  useToast as useToastHook,
  type Toast,
} from "@/hooks/use-toast"

export { 
  type ToastProps,
  type ToastActionElement,
  type Toast,
}

export const useToast = useToastHook;
