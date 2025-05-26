
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * Wrapper for glassmorphism look used in all chat panels (global/private/group)
 */
interface ChatGlassPanelProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const ChatGlassPanel = ({ children, className, noPadding }: ChatGlassPanelProps) => (
  <div
    className={cn(
      "bg-gradient-to-br from-cyberdark-900/85 via-cyberdark-950/95 to-cyberblue-950/90",
      "border border-cybergold-400/20 shadow-neon-blue/20 rounded-2xl",
      "backdrop-blur-md glass-morphism",
      noPadding ? "" : "p-4 sm:p-6",
      className
    )}
    style={{ minHeight: "0", width: "100%" }}
  >
    {children}
  </div>
);
