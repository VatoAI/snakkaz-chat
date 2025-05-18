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

// Singleton toast function for use outside of React components
let toastSingleton: ((props: ExtendedUseToastOptions) => string) | null = null;

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
  
  // Set up the singleton toast function for non-component use
  React.useEffect(() => {
    // Make sure we're in a browser context before setting up
    if (typeof window !== 'undefined') {
      toastSingleton = toast;
      return () => {
        toastSingleton = null;
      };
    }
  }, [toast]);

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

// Exporterer en toast-funksjon som kan brukes utenfor React-komponenter
// Denne vil være null inntil ToastProvider er montert
export const toast = (props: ExtendedUseToastOptions): string | null => {
  if (toastSingleton) {
    return toastSingleton(props);
  } else {
    console.warn("Toast called before ToastProvider was mounted");
    // Logg meldingen i det minste
    console.log(`Toast: ${props.title} - ${props.description}`);
    return null;
  }
};

// Re-export the types
export type { ToastProps, ToastActionElement };
