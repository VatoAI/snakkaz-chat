
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
          "flex h-10 w-full rounded-md border bg-cyberdark-800 border-cybergold-500/30 px-3 py-2 text-base text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-cybergold-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyberblue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-neon-blue/10",
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
