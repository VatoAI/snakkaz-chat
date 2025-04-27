
import * as React from "react";
import {
  ToastProps,
  ToastActionElement,
} from "@/components/ui/toast";

// Define the extended types
export interface ExtendedToastProps extends ToastProps {
  variant?: "default" | "destructive" | "warning";
}

export interface ExtendedUseToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "warning";
  duration?: number;
}

export type Toast = ExtendedToastProps;

// Create a unique ID
const genId = () => Math.random().toString(36).substring(2, 9);

export const useToast = () => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback(
    (props: ExtendedUseToastOptions) => {
      const id = genId();
      const newToast = { id, ...props };
      
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

export type { ToastActionElement };
