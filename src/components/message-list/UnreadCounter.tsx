
import React from "react";

interface UnreadCounterProps {
  count: number;
  show: boolean;
}

export function UnreadCounter({ count, show }: UnreadCounterProps) {
  if (!show || count <= 0) return null;
  return (
    <div className="absolute bottom-4 right-4 bg-cyberred-600 rounded-full text-white text-xs px-2 py-1 z-20 animate-bounce">
      {count > 99 ? "99+" : count} nye
    </div>
  );
}
