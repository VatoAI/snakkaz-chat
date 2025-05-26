
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-cyberdark-950/60 border border-gray-700",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full transition-all duration-300 ease-out"
      style={{ 
        width: `${value || 0}%`,
        background: 'linear-gradient(90deg, #1a9dff 0%, #3b82f6 50%, #e60000 100%)',
        boxShadow: '0 0 15px rgba(26,157,255,0.4), 0 0 15px rgba(230,0,0,0.4)'
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
