import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Modernisert knappdesign med bedre støtte for lys/mørk-modus
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
        
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 dark:border-cyberdark-600/50 dark:bg-cyberdark-800/30 dark:hover:bg-cyberdark-700/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-6 text-base",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
