var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { r as reactExports, j as jsxRuntimeExports, V as Viewport, R as Root2, A as Action, C as Close, X, T as Title, D as Description, P as Provider, S as Slot, a as Root, b as Root2$1, L as List, c as Trigger, d as Content, F as FormProvider, e as Controller, u as useFormContext, f as Root$1, g as Viewport$1, h as Corner, i as ScrollAreaScrollbar, k as ScrollAreaThumb, l as Root$2, I as Image, m as Fallback, n as Root$3, o as Trigger$1, p as Portal, q as Content$1, s as Close$1, t as Title$1, v as Description$1, O as Overlay, w as Root$4, x as Thumb, y as Root2$2, z as Value, B as Trigger$2, E as Icon, G as ChevronDown, H as Portal$1, J as Content2, K as Viewport$2, M as Item, N as ItemIndicator, Q as Check, U as ItemText, W as ScrollUpButton, Y as ChevronUp, Z as ScrollDownButton, _ as Label$1, $ as Separator$1, a0 as Root2$3, a1 as Item2, a2 as Indicator, a3 as Circle, a4 as Provider$1, a5 as Root3, a6 as Trigger$3, a7 as Content2$1, a8 as Root$5, a9 as Root2$4, aa as Trigger$4, ab as Portal2, ac as Content2$2, ad as Item2$1, ae as SubTrigger2, af as ChevronRight, ag as SubContent2, ah as CheckboxItem2, ai as ItemIndicator2, aj as RadioItem2, ak as Label2, al as Separator2, am as Root2$5, an as Trigger2, ao as Portal2$1, ap as Content2$3, aq as Title2, ar as Description2, as as Cancel, at as Action$1, au as Overlay2 } from "./vendor-react-core-Cd05VJ5Y.js";
import { t as twMerge, c as clsx, a as cva } from "./vendor-style-utils-nLA3zUC6.js";
import { s as subscriptionService, a as saveOfflineMessage, r as removeOfflineMessage, u as updateOfflineMessageStatus, g as getOfflineMessages, b as getOfflineMessageMedia } from "./app-services-Cf0jkxe3.js";
import { u as useNavigate } from "./vendor-router-DRYHFKTT.js";
import { c as createClient } from "./vendor-database-Cidpe8p9.js";
var define_process_env_default = {};
const SUPABASE_URL = define_process_env_default.VITE_SUPABASE_URL || "https://wqpoozpbceucynsojmbk.supabase.co";
const SUPABASE_ANON_KEY = define_process_env_default.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8";
class SupabaseSingleton {
  /**
   * Get the Supabase client instance
   * Creates it if it doesn't exist yet
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
          // More stable in production
        }
      });
    }
    return this.instance;
  }
  /**
   * Reset the instance (primarily for testing)
   */
  static resetInstance() {
    this.instance = null;
  }
}
__publicField(SupabaseSingleton, "instance", null);
const supabase$1 = SupabaseSingleton.getInstance();
const supabase = supabase$1;
const genId = () => Math.random().toString(36).substring(2, 9);
const useToast$1 = () => {
  const [toasts, setToasts] = reactExports.useState([]);
  const toast2 = reactExports.useCallback(
    (props) => {
      const id = genId();
      const newToast = { id, ...props };
      setToasts((prevToasts) => [...prevToasts, newToast]);
      return id;
    },
    []
  );
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      return () => {
      };
    }
  }, [toast2]);
  const dismiss = reactExports.useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast3) => toast3.id !== id));
  }, []);
  const dismissAll = reactExports.useCallback(() => {
    setToasts([]);
  }, []);
  return {
    toast: toast2,
    dismiss,
    dismissAll,
    toasts
  };
};
const AuthContext = reactExports.createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [subscription, setSubscription] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [loadingSubscription, setLoadingSubscription] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const { toast } = useToast$1();
  const navigate = useNavigate();
  const refreshSubscription = async () => {
    if (!user) return;
    setLoadingSubscription(true);
    try {
      const userSubscription = await subscriptionService.getUserSubscription(user.id);
      setSubscription(userSubscription);
    } catch (error2) {
      console.error("Error loading subscription:", error2);
    } finally {
      setLoadingSubscription(false);
    }
  };
  reactExports.useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const { data, error: error2 } = await supabase.auth.getSession();
        if (error2) {
          throw error2;
        }
        if (data == null ? void 0 : data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (error2) {
        console.error("Error loading user:", error2);
        setError("Could not load user profile");
      } finally {
        setLoading(false);
      }
    };
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session2) => {
        if (session2) {
          setSession(session2);
          setUser(session2.user);
        } else {
          setSession(null);
          setUser(null);
          setSubscription(null);
        }
        setLoading(false);
      }
    );
    return () => {
      authListener == null ? void 0 : authListener.subscription.unsubscribe();
    };
  }, []);
  reactExports.useEffect(() => {
    if (user) {
      refreshSubscription();
    }
  }, [user, refreshSubscription]);
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error: error2 } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error2) throw error2;
      setSession(data.session);
      setUser(data.user);
      navigate("/beta-chat");
      toast({
        title: "🚀 Velkommen til SnakkaZ Chat Beta!",
        description: "Klar for real-time chat!"
      });
    } catch (error2) {
      const errorMessage = error2 instanceof Error ? error2.message : "Unknown error occurred";
      console.error("Innloggingsfeil:", errorMessage);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Innloggingsfeil",
        description: errorMessage || "Kunne ikke logge inn. Sjekk påloggingsinformasjonen."
      });
    } finally {
      setLoading(false);
    }
  };
  const signOut = async () => {
    try {
      setLoading(true);
      const { error: error2 } = await supabase.auth.signOut();
      if (error2) throw error2;
      setSession(null);
      setUser(null);
      setSubscription(null);
      navigate("/");
      toast({
        title: "Utlogget",
        description: "Du har blitt logget ut."
      });
    } catch (error2) {
      const errorMessage = error2 instanceof Error ? error2.message : "Unknown error occurred";
      console.error("Utloggingsfeil:", errorMessage);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Utloggingsfeil",
        description: errorMessage || "Kunne ikke logge ut. Prøv igjen."
      });
    } finally {
      setLoading(false);
    }
  };
  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true);
      const { data, error: error2 } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      if (error2) throw error2;
      toast({
        title: "Registrering vellykket",
        description: "Sjekk e-posten din for bekreftelseslenke."
      });
    } catch (error2) {
      const errorMessage = error2 instanceof Error ? error2.message : "Unknown error occurred";
      console.error("Registreringsfeil:", errorMessage);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Registreringsfeil",
        description: errorMessage || "Kunne ikke opprette konto. Prøv igjen."
      });
    } finally {
      setLoading(false);
    }
  };
  const isPremium = !!subscription && (subscription.status === "active" || subscription.status === "trial");
  const value = {
    user,
    session,
    subscription,
    signIn,
    signOut,
    signUp,
    loading,
    loadingSubscription,
    error,
    isAuthenticated: !!user,
    isPremium,
    refreshSubscription
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value, children });
};
const useAuth = () => {
  const context = reactExports.useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth må brukes innenfor en AuthProvider");
  }
  return context;
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = Provider;
const ToastViewport = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = Viewport.displayName;
const toastVariants = cva(
  "data-[swipe=move]:transition-none group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full",
  {
    variants: {
      variant: {
        default: "bg-background border",
        destructive: "group destructive border-destructive bg-destructive text-destructive-foreground",
        warning: "group warning border-warning bg-warning text-warning-foreground",
        success: "group success border-green-700 bg-green-900 text-green-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = reactExports.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = Root2.displayName;
const ToastAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-destructive/30 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = Action.displayName;
const ToastClose = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = Close.displayName;
const ToastTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-sm font-semibold", className),
    ...props
  }
));
ToastTitle.displayName = Title.displayName;
const ToastDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = Description.displayName;
function Toaster() {
  const { toasts } = useToast$1();
  const safeToasts = Array.isArray(toasts) ? toasts : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ToastProvider, { children: [
    safeToasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsxRuntimeExports.jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsxRuntimeExports.jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToastViewport, {})
  ] });
}
const Card = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border border-cybergold-500/30 bg-cyberdark-900/80 backdrop-blur-sm text-white shadow-neon-blue/20",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-cyberblue-500 text-white hover:bg-cyberblue-600 dark:bg-cyberblue-600 dark:hover:bg-cyberblue-700 shadow-subtle focus-visible:ring-cyberblue-400",
        destructive: "bg-cyberred-500 text-white hover:bg-cyberred-600 dark:bg-cyberred-600 dark:hover:bg-cyberred-700 shadow-subtle focus-visible:ring-cyberred-400",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground dark:border-cyberdark-500 dark:text-white dark:hover:bg-cyberdark-700",
        secondary: "bg-cybergold-500 text-cyberdark-900 hover:bg-cybergold-600 dark:bg-cybergold-600 dark:hover:bg-cybergold-700 shadow-subtle focus-visible:ring-cybergold-400 dark:text-cyberdark-900",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-cyberdark-700 dark:text-white dark:hover:text-white",
        link: "text-primary underline-offset-4 hover:underline dark:text-cyberblue-400",
        // Nye moderne varianter
        subtle: "bg-background/80 text-foreground hover:bg-accent dark:text-white dark:bg-cyberdark-800/50 dark:hover:bg-cyberdark-700",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 dark:border-cyberdark-600/50 dark:bg-cyberdark-800/30 dark:hover:bg-cyberdark-700/50"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-6 text-base",
        icon: "h-10 w-10 rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          // cyberpunk style input
          "flex h-10 w-full rounded-md border-2 bg-cyberdark-800 border-cybergold-500/40 px-3 py-2 text-base text-cybergold-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-cybergold-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyberblue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-neon-blue/20",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = Root.displayName;
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = reactExports.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
const AlertTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "h5",
  {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("text-sm [&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";
const Tabs = Root2$1;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
const Form = FormProvider;
const FormFieldContext = reactExports.createContext(
  {}
);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = reactExports.useContext(FormFieldContext);
  const itemContext = reactExports.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = reactExports.createContext(
  {}
);
const FormItem = reactExports.forwardRef(({ className, ...props }, ref) => {
  const id = reactExports.useId();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("space-y-2", className), ...props }) });
});
FormItem.displayName = "FormItem";
const FormLabel = reactExports.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Label,
    {
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
const FormControl = reactExports.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Slot,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
const FormDescription = reactExports.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
const FormMessage = reactExports.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error == null ? void 0 : error.message) : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "p",
    {
      ref,
      id: formMessageId,
      className: cn("text-sm font-medium text-destructive", className),
      ...props,
      children: body
    }
  );
});
FormMessage.displayName = "FormMessage";
const ScrollArea = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root$1,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Viewport$1, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
    ]
  }
));
ScrollArea.displayName = Root$1.displayName;
const ScrollBar = reactExports.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Avatar = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root$2,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = Root$2.displayName;
const AvatarImage = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = Image.displayName;
const AvatarFallback = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = Fallback.displayName;
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = reactExports.useState(void 0);
  reactExports.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const Dialog = Root$3;
const DialogTrigger = Trigger$1;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content$1,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close$1, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content$1.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title$1,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = Title$1.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description$1,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description$1.displayName;
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-md border border-cybergold-500/30 bg-cyberdark-800 px-3 py-2 text-base text-white placeholder:text-cybergold-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyberblue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const useToast = useToast$1;
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root$4,
  {
    className: cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Thumb,
      {
        className: cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Root$4.displayName;
const useGroupFetching = (currentUserId) => {
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const { user } = useAuth();
  const userId = currentUserId || (user == null ? void 0 : user.id) || "";
  const fetchGroups = async () => {
    if (!userId) return [];
    setIsLoading(true);
    try {
      const mockGroups = [
        {
          id: "group-1",
          name: "General Chat",
          description: "General discussion for all users",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          createdBy: userId,
          memberCount: 12,
          visibility: "public",
          securityLevel: "standard",
          is_premium: false,
          avatarUrl: "",
          members: []
        },
        {
          id: "group-2",
          name: "Secure Chat",
          description: "End-to-end encrypted discussions",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          createdBy: userId,
          memberCount: 5,
          visibility: "private",
          securityLevel: "high",
          is_premium: true,
          avatarUrl: "",
          members: []
        }
      ];
      return mockGroups;
    } catch (error) {
      console.error("Error fetching groups:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  return {
    fetchGroups,
    isLoading
  };
};
const useGroupCreation = (currentUserId, setGroups, setSelectedGroup) => {
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const { user } = useAuth();
  const userId = currentUserId || (user == null ? void 0 : user.id) || "";
  const handleCreateGroup = async (name, description = "", visibility = "private", securityLevel = "standard") => {
    if (!userId) return null;
    setIsCreating(true);
    try {
      const newGroup = {
        id: `group-${Date.now()}`,
        name,
        description,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        createdBy: userId,
        memberCount: 1,
        visibility,
        securityLevel,
        is_premium: false,
        avatarUrl: "",
        members: [{
          id: `member-${Date.now()}`,
          userId,
          groupId: `group-${Date.now()}`,
          role: "admin",
          joinedAt: (/* @__PURE__ */ new Date()).toISOString(),
          canWrite: true
        }]
      };
      if (setGroups) {
        setGroups((prev) => [...prev, newGroup]);
      }
      if (setSelectedGroup) {
        setSelectedGroup(newGroup);
      }
      return newGroup;
    } catch (error) {
      console.error("Error creating group:", error);
      return null;
    } finally {
      setIsCreating(false);
    }
  };
  return {
    handleCreateGroup,
    isCreating
  };
};
const useGroupJoin = (currentUserId, groups = [], setSelectedGroup, refreshGroups) => {
  const [isJoining, setIsJoining] = reactExports.useState(false);
  const { user } = useAuth();
  const userId = currentUserId || (user == null ? void 0 : user.id) || "";
  const handleJoinGroup = async (groupId, password) => {
    if (!userId) return false;
    setIsJoining(true);
    try {
      console.log(`Joining group ${groupId} with password: ${password || "none"}`);
      const group = groups.find((g) => g.id === groupId);
      if (!group) {
        console.error("Group not found");
        return false;
      }
      if (group.visibility === "private" && group.password && password !== group.password) {
        console.error("Incorrect password");
        return false;
      }
      const updatedGroup = {
        ...group,
        memberCount: (group.memberCount || 0) + 1,
        members: [
          ...group.members || [],
          {
            id: `member-${Date.now()}`,
            userId,
            groupId,
            role: "member",
            joinedAt: (/* @__PURE__ */ new Date()).toISOString(),
            canWrite: true
          }
        ]
      };
      if (setSelectedGroup) {
        setSelectedGroup(updatedGroup);
      }
      if (refreshGroups) {
        await refreshGroups();
      }
      return true;
    } catch (error) {
      console.error("Error joining group:", error);
      return false;
    } finally {
      setIsJoining(false);
    }
  };
  return {
    handleJoinGroup,
    isJoining
  };
};
const useGroupInvites = (currentUserId) => {
  const [invites, setInvites] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const { user } = useAuth();
  const userId = currentUserId || (user == null ? void 0 : user.id) || "";
  const fetchInvites = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const mockInvites = [
        // Sample invites for demo purposes
      ];
      setInvites(mockInvites);
    } catch (error) {
      console.error("Error fetching invites:", error);
    } finally {
      setLoading(false);
    }
  };
  const acceptInvite = async (inviteId) => {
    if (!userId) return null;
    try {
      const invite = invites.find((inv) => inv.id === inviteId);
      if (!invite) return null;
      console.log(`Accepting invite ${inviteId} for group ${invite.groupId}`);
      setInvites(invites.filter((inv) => inv.id !== inviteId));
      return invite.groupId;
    } catch (error) {
      console.error("Error accepting invite:", error);
      return null;
    }
  };
  const declineInvite = async (inviteId) => {
    if (!userId) return false;
    try {
      console.log(`Declining invite ${inviteId}`);
      setInvites(invites.filter((inv) => inv.id !== inviteId));
      return true;
    } catch (error) {
      console.error("Error declining invite:", error);
      return false;
    }
  };
  reactExports.useEffect(() => {
    fetchInvites();
  }, [userId]);
  return {
    invites,
    loading,
    fetchInvites,
    acceptInvite,
    declineInvite
  };
};
function useGroups(props) {
  const { user } = useAuth();
  const currentUserId = (user == null ? void 0 : user.id) || "";
  const [groups, setGroups] = reactExports.useState([]);
  const [selectedGroup, setSelectedGroup] = reactExports.useState(null);
  const { fetchGroups, isLoading } = useGroupFetching(currentUserId);
  const { inviteToGroup } = useGroupInvites(currentUserId);
  const refreshGroups = async () => {
    const result = await fetchGroups();
    setGroups(result);
  };
  reactExports.useEffect(() => {
    if (currentUserId) {
      refreshGroups();
    }
  }, [currentUserId]);
  const { handleCreateGroup } = useGroupCreation(currentUserId, setGroups, setSelectedGroup);
  const { handleJoinGroup } = useGroupJoin(currentUserId, groups, setSelectedGroup, refreshGroups);
  return {
    groups,
    setGroups,
    selectedGroup,
    setSelectedGroup,
    handleCreateGroup,
    handleJoinGroup,
    refreshGroups,
    inviteToGroup,
    loading: isLoading
  };
}
const Select = Root2$2;
const SelectValue = Value;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger$2,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = Trigger$2.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Content2,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Viewport$2,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = Content2.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label$1,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = Label$1.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
    ]
  }
));
SelectItem.displayName = Item.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator$1,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = Separator$1.displayName;
const RadioGroup = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2$3,
    {
      className: cn("grid gap-2", className),
      ...props,
      ref
    }
  );
});
RadioGroup.displayName = Root2$3.displayName;
const RadioGroupItem = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2.5 w-2.5 fill-current text-current" }) })
    }
  );
});
RadioGroupItem.displayName = Item2.displayName;
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-muted", className),
      ...props
    }
  );
}
function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = reactExports.useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isIOS: false,
    isAndroid: false,
    isWindows: false,
    isMacOS: false,
    isLinux: false,
    deviceType: "desktop",
    orientation: "landscape",
    screenWidth: typeof window !== "undefined" ? window.innerWidth : 1920,
    screenHeight: typeof window !== "undefined" ? window.innerHeight : 1080,
    pixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 1,
    browserName: "other",
    isTouchDevice: false,
    hasBiometricSupport: false,
    isLowPowerDevice: false,
    isFullScreen: false,
    hasInternetConnection: true
  });
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const detectDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) return "mobile";
      if (width < 1200) return "tablet";
      return "desktop";
    };
    const detectBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes("chrome") && !userAgent.includes("edg")) return "chrome";
      if (userAgent.includes("safari") && !userAgent.includes("chrome")) return "safari";
      if (userAgent.includes("firefox")) return "firefox";
      if (userAgent.includes("edg")) return "edge";
      if (userAgent.includes("opr") || userAgent.includes("opera")) return "opera";
      if (userAgent.includes("samsungbrowser")) return "samsung";
      return "other";
    };
    const detectOrientation = () => {
      if (typeof window.orientation === "undefined") {
        return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
      }
      return window.orientation === 0 || window.orientation === 180 ? "portrait" : "landscape";
    };
    const isLowPowerDevice = () => {
      if (navigator.hardwareConcurrency) {
        return navigator.hardwareConcurrency < 4;
      }
      const isOlderDevice = /android 4|android 5|iphone os 9|iphone os 10/i.test(navigator.userAgent);
      const isLowRes = window.screen.width * window.screen.height < 1e6;
      return isOlderDevice || isLowRes;
    };
    const hasBiometricSupport = () => {
      const modernAppleDevice = /iphone|ipad/.test(navigator.userAgent.toLowerCase()) && !/iphone os [5-9]|iphone os 10|iphone os 11/i.test(navigator.userAgent);
      const modernAndroid = /android [7-9]|android 1[0-9]/i.test(navigator.userAgent);
      return modernAppleDevice || modernAndroid;
    };
    const updateDeviceInfo = () => {
      const deviceType = detectDeviceType();
      const isOnline = navigator.onLine;
      setDeviceInfo({
        isMobile: deviceType === "mobile",
        isTablet: deviceType === "tablet",
        isDesktop: deviceType === "desktop",
        isIOS: /iphone|ipad|ipod/i.test(navigator.userAgent),
        isAndroid: /android/i.test(navigator.userAgent),
        isWindows: /win/i.test(navigator.userAgent),
        isMacOS: /mac/i.test(navigator.userAgent) && !/iphone|ipad|ipod/i.test(navigator.userAgent),
        isLinux: /linux/i.test(navigator.userAgent) && !/android/i.test(navigator.userAgent),
        deviceType,
        orientation: detectOrientation(),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
        browserName: detectBrowser(),
        isTouchDevice: "ontouchstart" in window || navigator.maxTouchPoints > 0,
        hasBiometricSupport: hasBiometricSupport(),
        isLowPowerDevice: isLowPowerDevice(),
        isFullScreen: !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement),
        hasInternetConnection: isOnline
      });
    };
    updateDeviceInfo();
    window.addEventListener("resize", updateDeviceInfo);
    window.addEventListener("orientationchange", updateDeviceInfo);
    window.addEventListener("online", updateDeviceInfo);
    window.addEventListener("offline", updateDeviceInfo);
    document.addEventListener("fullscreenchange", updateDeviceInfo);
    return () => {
      window.removeEventListener("resize", updateDeviceInfo);
      window.removeEventListener("orientationchange", updateDeviceInfo);
      window.removeEventListener("online", updateDeviceInfo);
      window.removeEventListener("offline", updateDeviceInfo);
      document.removeEventListener("fullscreenchange", updateDeviceInfo);
    };
  }, []);
  return deviceInfo;
}
function useLocalStorage(key, initialValue) {
  const readValue = () => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };
  const [storedValue, setStoredValue] = reactExports.useState(readValue);
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };
  reactExports.useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue));
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue]);
  return [storedValue, setValue];
}
const DEFAULT_OPTIONS = {
  lockOnBackground: true,
  lockOnOrientationChange: true,
  lockTimeout: 6e4,
  // 1 minute
  maxAttempts: 5,
  lockoutDuration: 300
  // 5 minutes
};
function useMobilePinSecurity(options = {}) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const [pinHash, setPinHash] = useLocalStorage("pinHash", null);
  const [isLocked, setIsLocked] = reactExports.useState(!!pinHash);
  const [attempts, setAttempts] = reactExports.useState(0);
  const [lockoutTimer, setLockoutTimer] = reactExports.useState(0);
  const [lastActive, setLastActive] = reactExports.useState(Date.now());
  const { toast } = useToast$1();
  const inactivityTimerRef = reactExports.useRef(null);
  const lockoutTimerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    setIsLocked(!!pinHash);
  }, []);
  reactExports.useEffect(() => {
    if (lockoutTimerRef.current) {
      clearInterval(lockoutTimerRef.current);
      lockoutTimerRef.current = null;
    }
    if (lockoutTimer > 0) {
      lockoutTimerRef.current = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            if (lockoutTimerRef.current) {
              clearInterval(lockoutTimerRef.current);
              lockoutTimerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1e3);
    } else if (lockoutTimer === 0 && attempts >= mergedOptions.maxAttempts) {
      setAttempts(0);
    }
    return () => {
      if (lockoutTimerRef.current) {
        clearInterval(lockoutTimerRef.current);
        lockoutTimerRef.current = null;
      }
    };
  }, [lockoutTimer, attempts, mergedOptions.maxAttempts]);
  reactExports.useEffect(() => {
    if (!pinHash) return;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        if (mergedOptions.lockOnBackground || now - lastActive > mergedOptions.lockTimeout && mergedOptions.lockTimeout > 0) {
          setIsLocked(true);
        }
        setLastActive(now);
      } else {
        setLastActive(Date.now());
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [pinHash, lastActive, mergedOptions.lockOnBackground, mergedOptions.lockTimeout]);
  reactExports.useEffect(() => {
    if (!pinHash || !mergedOptions.lockOnOrientationChange) return;
    const handleOrientationChange = () => {
      if (pinHash) setIsLocked(true);
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => window.removeEventListener("orientationchange", handleOrientationChange);
  }, [pinHash, mergedOptions.lockOnOrientationChange]);
  reactExports.useEffect(() => {
    if (!pinHash || mergedOptions.lockTimeout === 0) {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }
    const handleUserActivity = () => {
      setLastActive(Date.now());
    };
    window.addEventListener("touchstart", handleUserActivity);
    window.addEventListener("touchmove", handleUserActivity);
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);
    if (inactivityTimerRef.current) {
      clearInterval(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setInterval(() => {
      const now = Date.now();
      if (now - lastActive > mergedOptions.lockTimeout && !isLocked) {
        setIsLocked(true);
      }
    }, 1e4);
    return () => {
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("touchmove", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
  }, [pinHash, lastActive, isLocked, mergedOptions.lockTimeout]);
  const setPin = reactExports.useCallback((pin) => {
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      toast({
        title: "Ugyldig PIN",
        description: "PIN-koden må være nøyaktig 4 siffer",
        variant: "destructive"
      });
      return false;
    }
    try {
      const hash = btoa(pin);
      setPinHash(hash);
      setIsLocked(false);
      localStorage.setItem("pinHash", hash);
      toast({
        title: "PIN aktivert",
        description: "Din sikre PIN-kode er nå satt opp"
      });
      return true;
    } catch (error) {
      console.error("Error setting PIN:", error);
      toast({
        title: "Feil ved oppretting av PIN",
        description: "Kunne ikke opprette PIN-kode. Prøv igjen.",
        variant: "destructive"
      });
      return false;
    }
  }, [setPinHash, toast]);
  const verifyPin = reactExports.useCallback((pin) => {
    if (!pin || !pinHash) {
      return false;
    }
    if (lockoutTimer > 0) {
      toast({
        title: "Konto låst",
        description: `Prøv igjen om ${Math.ceil(lockoutTimer / 60)} minutter`,
        variant: "destructive"
      });
      return false;
    }
    const hash = btoa(pin);
    const isValid = hash === pinHash;
    if (!isValid) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= mergedOptions.maxAttempts) {
        setLockoutTimer(mergedOptions.lockoutDuration);
        toast({
          title: "For mange mislykkede forsøk",
          description: `Prøv igjen om ${Math.ceil(mergedOptions.lockoutDuration / 60)} minutter`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Feil PIN",
          description: `${mergedOptions.maxAttempts - newAttempts} forsøk gjenstår`,
          variant: "destructive"
        });
      }
    } else {
      setIsLocked(false);
      setAttempts(0);
    }
    return isValid;
  }, [pinHash, attempts, lockoutTimer, mergedOptions.maxAttempts, mergedOptions.lockoutDuration, toast]);
  const resetPin = reactExports.useCallback(() => {
    try {
      setPinHash(null);
      setIsLocked(false);
      setAttempts(0);
      setLockoutTimer(0);
      localStorage.removeItem("pinHash");
      localStorage.removeItem("chatCode");
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      if (lockoutTimerRef.current) {
        clearInterval(lockoutTimerRef.current);
        lockoutTimerRef.current = null;
      }
      return true;
    } catch (error) {
      console.error("Error resetting PIN:", error);
      toast({
        title: "Feil ved fjerning av PIN",
        description: "Kunne ikke fjerne PIN-kode. Prøv igjen.",
        variant: "destructive"
      });
      return false;
    }
  }, [setPinHash, toast]);
  const lock = reactExports.useCallback(() => {
    if (pinHash) {
      setIsLocked(true);
    }
  }, [pinHash]);
  return {
    hasPin: !!pinHash,
    isLocked,
    lockoutTimer,
    attemptsRemaining: mergedOptions.maxAttempts - attempts,
    isLockedOut: lockoutTimer > 0,
    setPin,
    verifyPin,
    resetPin,
    lock
  };
}
function useIsAdmin(userId) {
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
  }, [userId]);
  return { isAdmin, loading };
}
const TooltipProvider = Provider$1;
const Tooltip = Root3;
const TooltipTrigger = Trigger$3;
const TooltipContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2$1,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = Content2$1.displayName;
const useFriends = (userId, activeChat, onCloseChatFn, setSelectedFriend) => {
  const [friends, setFriends] = reactExports.useState([]);
  const [friendsList, setFriendsList] = reactExports.useState([]);
  const { toast } = useToast();
  reactExports.useEffect(() => {
    return;
  }, [userId, activeChat, onCloseChatFn, setSelectedFriend]);
  const handleSendFriendRequest = async (friendId) => {
    return;
  };
  const handleStartChat = (friendId) => {
    const friend = friends.find(
      (f) => f.user_id === userId && f.friend_id === friendId || f.friend_id === userId && f.user_id === friendId
    );
    if (friend) {
      setSelectedFriend(friend);
    } else {
      toast({
        title: "Finner ikke venn",
        description: "Kunne ikke finne vennskap med denne brukeren",
        variant: "destructive"
      });
    }
  };
  return {
    friends,
    friendsList,
    handleSendFriendRequest,
    handleStartChat
  };
};
const Separator = reactExports.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root$5,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = Root$5.displayName;
const useUsernameValidation = () => {
  const [validationState, setValidationState] = reactExports.useState({
    isChecking: false,
    isAvailable: null,
    error: null,
    suggestions: []
  });
  useToast();
  const generateSuggestions = (baseUsername) => {
    const suggestions = [
      `${baseUsername}_${(/* @__PURE__ */ new Date()).getFullYear()}`,
      `${baseUsername}${Math.floor(Math.random() * 999)}`,
      `${baseUsername}_beta`,
      `${baseUsername}_chat`,
      `${baseUsername}${Math.floor(Math.random() * 99)}`
    ];
    return suggestions.slice(0, 3);
  };
  const validateUsername = reactExports.useCallback(async (username, currentUserId) => {
    setValidationState({
      isChecking: true,
      isAvailable: null,
      error: null,
      suggestions: []
    });
    if (!username) {
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Brukernavn kan ikke være tomt",
        suggestions: []
      });
      return false;
    }
    if (username.length < 3) {
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Brukernavn må være minst 3 tegn",
        suggestions: []
      });
      return false;
    }
    if (username.length > 20) {
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Brukernavn kan ikke være lengre enn 20 tegn",
        suggestions: []
      });
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Brukernavn kan kun inneholde bokstaver, tall og underscore",
        suggestions: []
      });
      return false;
    }
    const reservedUsernames = [
      "admin",
      "administrator",
      "root",
      "user",
      "test",
      "guest",
      "snakkaz",
      "support",
      "help",
      "beta",
      "api",
      "www",
      "mail",
      "chat",
      "group",
      "team",
      "system",
      "official",
      "bot"
    ];
    if (reservedUsernames.includes(username.toLowerCase())) {
      setValidationState({
        isChecking: false,
        isAvailable: false,
        error: "Dette brukernavnet er reservert",
        suggestions: generateSuggestions(username)
      });
      return false;
    }
    try {
      const { data: existingUser, error } = await supabase$1.from("profiles").select("id").eq("username", username).maybeSingle();
      if (error) {
        console.error("Error checking username:", error);
        setValidationState({
          isChecking: false,
          isAvailable: null,
          error: "Kunne ikke sjekke brukernavn. Prøv igjen.",
          suggestions: []
        });
        return false;
      }
      if (existingUser && existingUser.id !== currentUserId) {
        setValidationState({
          isChecking: false,
          isAvailable: false,
          error: "❌ Dette brukernavnet er allerede tatt",
          suggestions: generateSuggestions(username)
        });
        return false;
      }
      setValidationState({
        isChecking: false,
        isAvailable: true,
        error: null,
        suggestions: []
      });
      return true;
    } catch (error) {
      console.error("Username validation error:", error);
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Nettverksfeil. Sjekk internettforbindelsen.",
        suggestions: []
      });
      return false;
    }
  }, []);
  return { validationState, validateUsername };
};
const useEmailValidation = () => {
  const [validationState, setValidationState] = reactExports.useState({
    isChecking: false,
    isAvailable: null,
    error: null,
    suggestions: []
  });
  useToast();
  const validateEmail = reactExports.useCallback(async (email) => {
    var _a;
    setValidationState({
      isChecking: true,
      isAvailable: null,
      error: null,
      suggestions: []
    });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Vennligst oppgi en gyldig e-postadresse",
        suggestions: []
      });
      return false;
    }
    const disposableDomains = [
      "10minutemail.com",
      "tempmail.org",
      "guerrillamail.com",
      "mailinator.com",
      "yopmail.com",
      "temp-mail.org"
    ];
    const domain = (_a = email.split("@")[1]) == null ? void 0 : _a.toLowerCase();
    if (disposableDomains.includes(domain)) {
      setValidationState({
        isChecking: false,
        isAvailable: false,
        error: "Midlertidige e-postadresser er ikke tillatt",
        suggestions: ["Bruk en permanent e-postadresse som Gmail, Outlook eller din egen domain"]
      });
      return false;
    }
    try {
      const { data: existingUser, error } = await supabase$1.from("profiles").select("id, username").eq("email", email.toLowerCase()).maybeSingle();
      if (error && error.code !== "PGRST116") {
        console.error("Error checking email:", error);
        setValidationState({
          isChecking: false,
          isAvailable: null,
          error: "Kunne ikke sjekke e-post. Prøv igjen.",
          suggestions: []
        });
        return false;
      }
      if (existingUser) {
        setValidationState({
          isChecking: false,
          isAvailable: false,
          error: "❌ E-posten er allerede registrert",
          suggestions: [`Vil du logge inn som ${existingUser.username}?`]
        });
        return false;
      }
      setValidationState({
        isChecking: false,
        isAvailable: true,
        error: null,
        suggestions: []
      });
      return true;
    } catch (error) {
      console.error("Email validation error:", error);
      setValidationState({
        isChecking: false,
        isAvailable: null,
        error: "Nettverksfeil. Sjekk internettforbindelsen.",
        suggestions: []
      });
      return false;
    }
  }, []);
  return { validationState, validateEmail };
};
const defaultOptions = {
  retryInterval: 5e3,
  maxRetries: 3,
  enablePing: false,
  pingUrl: "/api/ping",
  pingInterval: 3e4
};
function useNetworkStatus(options = {}) {
  const mergedOptions = { ...defaultOptions, ...options };
  const [status, setStatus] = reactExports.useState({
    online: navigator.onLine,
    wasOffline: false,
    lastOnlineTime: navigator.onLine ? /* @__PURE__ */ new Date() : null,
    lastOfflineTime: !navigator.onLine ? /* @__PURE__ */ new Date() : null,
    reconnecting: false,
    retryCount: 0
  });
  const checkServerConnection = reactExports.useCallback(async () => {
    if (!mergedOptions.enablePing) return true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5e3);
      const response = await fetch(mergedOptions.pingUrl, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn("Server connection check failed:", error);
      return false;
    }
  }, [mergedOptions.enablePing, mergedOptions.pingUrl]);
  const handleOnline = reactExports.useCallback(async () => {
    const serverAvailable = await checkServerConnection();
    if (serverAvailable) {
      setStatus((prev) => ({
        ...prev,
        online: true,
        wasOffline: prev.lastOfflineTime !== null,
        lastOnlineTime: /* @__PURE__ */ new Date(),
        reconnecting: false,
        retryCount: 0
      }));
      if (mergedOptions.onReconnect) {
        mergedOptions.onReconnect();
      }
    } else {
      setStatus((prev) => ({
        ...prev,
        online: false,
        wasOffline: true
      }));
    }
  }, [checkServerConnection, mergedOptions]);
  const handleOffline = reactExports.useCallback(() => {
    setStatus((prev) => ({
      ...prev,
      online: false,
      lastOfflineTime: /* @__PURE__ */ new Date(),
      reconnecting: true,
      retryCount: 0
    }));
    if (mergedOptions.onOffline) {
      mergedOptions.onOffline();
    }
  }, [mergedOptions]);
  const attemptReconnect = reactExports.useCallback(async () => {
    if (navigator.onLine) {
      const serverAvailable = await checkServerConnection();
      if (serverAvailable) {
        setStatus((prev) => ({
          ...prev,
          online: true,
          wasOffline: true,
          lastOnlineTime: /* @__PURE__ */ new Date(),
          reconnecting: false
        }));
        if (mergedOptions.onReconnect) {
          mergedOptions.onReconnect();
        }
        return;
      }
    }
    setStatus((prev) => {
      const newRetryCount = prev.retryCount + 1;
      const shouldContinueRetrying = newRetryCount < (mergedOptions.maxRetries || 3);
      return {
        ...prev,
        retryCount: newRetryCount,
        reconnecting: shouldContinueRetrying
      };
    });
  }, [checkServerConnection, mergedOptions]);
  reactExports.useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);
  reactExports.useEffect(() => {
    let reconnectTimer;
    if (status.reconnecting) {
      reconnectTimer = window.setTimeout(attemptReconnect, mergedOptions.retryInterval);
    }
    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [status.reconnecting, status.retryCount, attemptReconnect, mergedOptions.retryInterval]);
  reactExports.useEffect(() => {
    let pingTimer;
    if (mergedOptions.enablePing && status.online) {
      pingTimer = window.setInterval(async () => {
        const serverAvailable = await checkServerConnection();
        if (!serverAvailable && status.online) {
          setStatus((prev) => ({
            ...prev,
            online: false,
            lastOfflineTime: /* @__PURE__ */ new Date(),
            reconnecting: true,
            retryCount: 0
          }));
          if (mergedOptions.onOffline) {
            mergedOptions.onOffline();
          }
        }
      }, mergedOptions.pingInterval);
    }
    return () => {
      if (pingTimer) {
        clearInterval(pingTimer);
      }
    };
  }, [mergedOptions, status.online, checkServerConnection]);
  const forceReconnect = reactExports.useCallback(async () => {
    setStatus((prev) => ({
      ...prev,
      reconnecting: true,
      retryCount: 0
    }));
    await attemptReconnect();
  }, [attemptReconnect]);
  return {
    ...status,
    forceReconnect
  };
}
const DropdownMenu = Root2$4;
const DropdownMenuTrigger = Trigger$4;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-cyberblue-800 focus:text-cybergold-200 data-[state=open]:bg-cyberred-900/80 transition-all duration-200",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-[120] min-w-[8rem] overflow-hidden rounded-md border-2 shadow-lg bg-gradient-to-br from-cyberdark-950 via-cyberblue-900/90 to-cyberred-900/85 backdrop-blur-xl border-cybergold-500/50",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2$2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-[120] min-w-[8rem] overflow-hidden rounded-md border-2 shadow-lg bg-gradient-to-br from-cyberdark-950 via-cyberblue-900/90 to-cyberred-900/85 backdrop-blur-xl border-cybergold-500/50",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2$2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2$1,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm transition-colors focus:bg-cyberred-900/40 focus:text-cyberblue-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2$1.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm focus:bg-cyberblue-950 focus:text-cybergold-400 transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm focus:bg-cyberblue-950 focus:text-cybergold-400 transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold text-cybergold-400",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-cyberblue-700/60", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
const AlertDialog = Root2$5;
const AlertDialogTrigger = Trigger2;
const AlertDialogPortal = Portal2$1;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2$3,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2$3.displayName;
const AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Action$1,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = Action$1.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
function useMediaQuery(query) {
  const [matches, setMatches] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);
  return matches;
}
function useOfflineMessages(options) {
  const { onSendMessage, onSyncComplete, enabled = true } = options;
  const { online } = useNetworkStatus();
  const { toast } = useToast$1();
  const [pendingCount, setPendingCount] = reactExports.useState(0);
  const [isSyncing, setIsSyncing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (enabled) {
      const updatePendingCount = async () => {
        const messages = await getOfflineMessages();
        const pending = messages.filter((msg) => msg.status === "pending" || msg.status === "failed").length;
        setPendingCount(pending);
      };
      updatePendingCount();
    }
  }, [enabled]);
  reactExports.useEffect(() => {
    if (!enabled) return;
    const syncMessages2 = async () => {
      if (!online || isSyncing) return;
      try {
        setIsSyncing(true);
        const messages = await getOfflineMessages();
        const pendingMessages = messages.filter(
          (msg) => msg.status === "pending" || msg.status === "failed"
        );
        if (pendingMessages.length === 0) {
          setIsSyncing(false);
          return;
        }
        console.log(`[OfflineSync] Starting sync of ${pendingMessages.length} messages`);
        let sent = 0;
        let failed = 0;
        for (const message of pendingMessages) {
          try {
            await updateOfflineMessageStatus(message.id, "sending");
            let mediaBlob = null;
            if (message.mediaId) {
              mediaBlob = await getOfflineMessageMedia(message.mediaId);
            }
            const success = await onSendMessage(message, mediaBlob || void 0);
            if (success) {
              await removeOfflineMessage(message.id);
              sent++;
            } else {
              await updateOfflineMessageStatus(
                message.id,
                "failed",
                message.retryCount + 1
              );
              failed++;
            }
          } catch (error) {
            console.error(`[OfflineSync] Failed to sync message ${message.id}:`, error);
            await updateOfflineMessageStatus(
              message.id,
              "failed",
              message.retryCount + 1
            );
            failed++;
          }
        }
        setPendingCount((prev) => Math.max(0, prev - sent));
        if (sent > 0 || failed > 0) {
          let message = "";
          if (sent > 0) {
            message += `${sent} melding${sent !== 1 ? "er" : ""} sendt. `;
          }
          if (failed > 0) {
            message += `${failed} melding${failed !== 1 ? "er" : ""} feilet.`;
          }
          toast({
            title: "Synkronisering fullført",
            description: message.trim(),
            variant: failed > 0 ? "destructive" : "default"
          });
        }
        if (onSyncComplete) {
          onSyncComplete({ sent, failed });
        }
      } finally {
        setIsSyncing(false);
      }
    };
    if (online) {
      syncMessages2();
    }
    const handleOnline = () => {
      syncMessages2();
    };
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [enabled, online, onSendMessage, onSyncComplete, toast, isSyncing]);
  const sendMessage = reactExports.useCallback(async (text, options2) => {
    if (!enabled) {
      throw new Error("Offline message handling is disabled");
    }
    if (!text.trim() && !options2.mediaBlob) {
      throw new Error("Message cannot be empty");
    }
    if (online && !isSyncing) {
      try {
        const offlineMessage = await saveOfflineMessage(text, options2);
        const success = await onSendMessage(
          offlineMessage,
          options2.mediaBlob
        );
        if (success) {
          await removeOfflineMessage(offlineMessage.id);
          return { id: offlineMessage.id, queued: false };
        }
        await updateOfflineMessageStatus(offlineMessage.id, "failed");
        setPendingCount((prev) => prev + 1);
        toast({
          title: "Sending feilet",
          description: "Meldingen vil bli sendt automatisk når tilkoblingen er gjenopprettet.",
          variant: "destructive"
        });
        return { id: offlineMessage.id, queued: true };
      } catch (error) {
        console.error("Failed to send message:", error);
        const offlineMessage = await saveOfflineMessage(text, options2);
        setPendingCount((prev) => prev + 1);
        toast({
          title: "Sending feilet",
          description: "Meldingen vil bli sendt automatisk når tilkoblingen er gjenopprettet.",
          variant: "destructive"
        });
        return { id: offlineMessage.id, queued: true };
      }
    } else {
      const offlineMessage = await saveOfflineMessage(text, options2);
      setPendingCount((prev) => prev + 1);
      if (!online) {
        toast({
          title: "Lagret offline",
          description: "Meldingen vil bli sendt automatisk når tilkoblingen er gjenopprettet."
        });
      }
      return { id: offlineMessage.id, queued: true };
    }
  }, [enabled, online, isSyncing, onSendMessage, toast]);
  const syncMessages = reactExports.useCallback(async () => {
    if (!enabled || !online || isSyncing) return;
    setIsSyncing(true);
    try {
      const messages = await getOfflineMessages();
      const pendingMessages = messages.filter(
        (msg) => msg.status === "pending" || msg.status === "failed"
      );
      if (pendingMessages.length === 0) {
        toast({
          title: "Ingen meldinger å synkronisere",
          description: "Alle meldinger er allerede sendt."
        });
        return;
      }
      toast({
        title: "Synkroniserer meldinger...",
        description: `Sender ${pendingMessages.length} ventende meldinger.`
      });
      let sent = 0;
      let failed = 0;
      for (const message of pendingMessages) {
        try {
          await updateOfflineMessageStatus(message.id, "sending");
          let mediaBlob = null;
          if (message.mediaId) {
            mediaBlob = await getOfflineMessageMedia(message.mediaId);
          }
          const success = await onSendMessage(message, mediaBlob || void 0);
          if (success) {
            await removeOfflineMessage(message.id);
            sent++;
          } else {
            await updateOfflineMessageStatus(
              message.id,
              "failed",
              message.retryCount + 1
            );
            failed++;
          }
        } catch (error) {
          console.error(`Failed to sync message ${message.id}:`, error);
          await updateOfflineMessageStatus(
            message.id,
            "failed",
            message.retryCount + 1
          );
          failed++;
        }
      }
      setPendingCount((prev) => Math.max(0, prev - sent));
      let resultMessage = "";
      if (sent > 0) {
        resultMessage += `${sent} melding${sent !== 1 ? "er" : ""} sendt. `;
      }
      if (failed > 0) {
        resultMessage += `${failed} melding${failed !== 1 ? "er" : ""} feilet.`;
      }
      toast({
        title: "Synkronisering fullført",
        description: resultMessage.trim(),
        variant: failed > 0 ? "destructive" : "default"
      });
      if (onSyncComplete) {
        onSyncComplete({ sent, failed });
      }
    } finally {
      setIsSyncing(false);
    }
  }, [enabled, online, isSyncing, onSendMessage, onSyncComplete, toast]);
  return {
    sendMessage,
    syncMessages,
    pendingCount,
    isSyncing
  };
}
const useEnhancedOfflineMessages = useOfflineMessages;
export {
  FormMessage as $,
  Avatar as A,
  Button as B,
  Card as C,
  Dialog as D,
  ScrollArea as E,
  Skeleton as F,
  CardFooter as G,
  Tabs as H,
  Input as I,
  TabsList as J,
  TabsTrigger as K,
  Label as L,
  TabsContent as M,
  Separator as N,
  useUsernameValidation as O,
  useEmailValidation as P,
  Alert as Q,
  AlertTitle as R,
  Switch as S,
  Textarea as T,
  AlertDescription as U,
  DialogFooter as V,
  Form as W,
  FormField as X,
  FormItem as Y,
  FormLabel as Z,
  FormControl as _,
  AvatarImage as a,
  useGroups as a0,
  RadioGroup as a1,
  RadioGroupItem as a2,
  Select as a3,
  SelectTrigger as a4,
  SelectValue as a5,
  SelectContent as a6,
  SelectItem as a7,
  useFriends as a8,
  DropdownMenu as a9,
  DropdownMenuTrigger as aa,
  DropdownMenuContent as ab,
  DropdownMenuItem as ac,
  AlertDialog as ad,
  AlertDialogTrigger as ae,
  AlertDialogContent as af,
  AlertDialogHeader as ag,
  AlertDialogTitle as ah,
  AlertDialogDescription as ai,
  AlertDialogFooter as aj,
  AlertDialogCancel as ak,
  AlertDialogAction as al,
  useNetworkStatus as am,
  useMediaQuery as an,
  useEnhancedOfflineMessages as ao,
  AuthProvider as ap,
  Toaster as aq,
  AvatarFallback as b,
  useIsMobile as c,
  useToast as d,
  cn as e,
  CardHeader as f,
  CardTitle as g,
  CardDescription as h,
  CardContent as i,
  DialogTrigger as j,
  DialogContent as k,
  DialogHeader as l,
  DialogTitle as m,
  DialogDescription as n,
  useIsAdmin as o,
  useDeviceDetection as p,
  useMobilePinSecurity as q,
  supabase$1 as r,
  supabase as s,
  TooltipProvider as t,
  useAuth as u,
  Tooltip as v,
  TooltipTrigger as w,
  TooltipContent as x,
  useToast$1 as y,
  Badge as z
};
//# sourceMappingURL=app-utils-CvwRV1zG.js.map
