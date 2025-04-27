
// src/hooks/use-toast.ts
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

import {
  useToast as useToastOriginal,
  type ToastActionElement as ToastActionElementOriginal,
} from "@/components/ui/use-toast";

type ExtendedToastProps = ToastProps & {
  variant?: "default" | "destructive" | "warning";
};

export interface ExtendedUseToastOptions extends Omit<ExtendedToastProps, "children"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive" | "warning";
}

export const useToast = () => {
  const originalHook = useToastOriginal();
  
  return {
    ...originalHook,
    toast: (props: ExtendedUseToastOptions) => {
      return originalHook.toast(props);
    },
  };
};

export type { Toast, ToastActionElement };
