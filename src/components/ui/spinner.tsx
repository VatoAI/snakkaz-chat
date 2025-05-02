
import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

export function Spinner({ 
  size = "md", 
  className, 
  color = "text-primary" 
}: SpinnerProps) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 
      className={cn(
        "animate-spin", 
        sizeMap[size], 
        color, 
        className
      )} 
    />
  );
}

export default Spinner;
