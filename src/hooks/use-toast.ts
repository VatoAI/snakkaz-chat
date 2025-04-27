
import * as React from "react";
import { ToastActionElement, ToastProps } from "@/components/ui/toast";

// Define the extended types
export interface ExtendedToastProps extends ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive" | "warning";
}

export type Toast = ExtendedToastProps;

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
