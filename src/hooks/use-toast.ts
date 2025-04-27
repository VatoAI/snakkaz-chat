
import * as React from "react";
import type { ToastProps, ToastActionElement } from "@/components/ui/toast";

// Define the extended types without incorrectly extending from ToastProps
export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive" | "warning";
  duration?: number;
}

export interface ExtendedUseToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive" | "warning";
  duration?: number;
}

// Create a unique ID
const genId = () => Math.random().toString(36).substring(2, 9);

export const useToast = () => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback(
    (props: ExtendedUseToastOptions) => {
      const id = genId();
      const newToast = { id, ...props } as Toast;
      
      setToasts((prevToasts) => [...prevToasts, newToast]);
      
      return id;
    },
    []
  );
  
  const dismiss = React.useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
  };
};

// Re-export the types
export type { ToastProps, ToastActionElement };
