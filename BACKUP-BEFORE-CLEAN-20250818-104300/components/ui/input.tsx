

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // cyberpunk style input
          "flex h-10 w-full rounded-md border-2 bg-cyberdark-800 border-cybergold-500/40 px-3 py-2 text-base text-cybergold-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-cybergold-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyberblue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-neon-blue/20",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

