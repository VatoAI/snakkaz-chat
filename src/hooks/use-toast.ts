
import {
  Toast,
  ToastProps,
} from "@/components/ui/toast";

import {
  useToast as useToastOriginal,
} from "@/components/ui/use-toast";

type ExtendedToastProps = ToastProps & {
  variant?: "default" | "destructive" | "warning";
};

export interface ExtendedUseToastOptions extends Omit<ExtendedToastProps, "children"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
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

export { type Toast };
export type ToastActionElement = React.ReactElement<unknown>;
