
import { BadgeCheck } from "lucide-react";

export function AdminBadge() {
  return (
    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 bg-cyberblue-900 border border-cyberblue-400 text-cyberblue-300 text-xs font-bold animate-glow ml-1">
      <BadgeCheck className="w-4 h-4 text-cyberblue-400" />
      Admin
    </span>
  );
}
