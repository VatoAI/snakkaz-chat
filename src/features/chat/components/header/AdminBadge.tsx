
import { BadgeCheck } from "lucide-react";

export function AdminBadge() {
  return (
    <span title="Admin" className="flex items-center gap-1 rounded-full bg-cyberblue-900 border border-cyberblue-400 text-cyberblue-300 p-0.5">
      <BadgeCheck className="w-4 h-4 text-cyberblue-400" />
    </span>
  );
}
